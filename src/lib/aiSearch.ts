import {
  about,
  contact,
  experience,
  identity,
  projects,
  skills,
  stats,
} from "../data/portfolio";

/* ============================================================
   Tiny semantic search + intent classifier
   -----------------------------------------------------------
   All runs client-side. No embeddings, no API calls.
   Design:
     1. Tokenize + stem + strip stopwords.
     2. Expand queries via a synonym map so "hiring", "freelance",
        "available" all resolve to the same intent.
     3. Intent classification = scored bag-of-keywords per intent,
        pick the argmax above a confidence threshold.
     4. Fallback = BM25-ish ranking over a corpus built from
        portfolio data, return the best-matching chunk.
   ============================================================ */

/* ---------- 1. tokenization ---------- */

const STOPWORDS = new Set([
  "a","an","and","are","as","at","be","by","for","from","has","have","he",
  "his","her","i","in","is","it","its","of","on","or","that","the","to",
  "was","were","will","with","you","your","me","my","mine","do","does",
  "did","can","could","would","should","there","here","this","these","those",
  "am","so","but","if","then","than","what","which","who","whom","how",
  "why","when","where","about","into","out","up","down","over","under",
  "also","just","some","any","all","no","not","yes","ok","okay","im","ive",
  "hes","shes","theyre","youre","tell","show","give","know","like","want",
  "need","please","hi","hey","hello",
]);

/** ultra-light Porter-ish stemmer: enough to collapse common variants. */
function stem(w: string): string {
  if (w.length <= 3) return w;
  const rules: [RegExp, string][] = [
    [/ingly$/, ""],
    [/ing$/, ""],
    [/edly$/, ""],
    [/ed$/, ""],
    [/ies$/, "y"],
    [/ves$/, "f"],
    [/ses$/, "s"],
    [/ically$/, "ic"],
    [/ally$/, "al"],
    [/fully$/, "ful"],
    [/ly$/, ""],
    [/tions$/, "tion"],
    [/sions$/, "sion"],
    [/ments$/, "ment"],
    [/ers$/, "er"],
    [/es$/, ""],
    [/s$/, ""],
  ];
  for (const [r, rep] of rules) {
    if (r.test(w)) return w.replace(r, rep);
  }
  return w;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s+#./-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !STOPWORDS.has(t))
    .map(stem);
}

/* ---------- 2. synonyms (query expansion) ---------- */

/** Each entry: all these terms (stemmed) count as the key term. */
const SYNONYMS: Record<string, string[]> = {
  hire: ["hire", "hiring", "avail", "freelanc", "work", "contract", "job", "open", "gig", "client", "engag"],
  skill: ["skill", "stack", "tech", "tool", "expert", "good", "strength", "fluent", "proficient"],
  project: ["project", "build", "ship", "made", "work", "portfolio", "product", "app"],
  contact: ["contact", "email", "reach", "dm", "message", "mail", "talk", "connect"],
  social: ["github", "twitter", "x", "linkedin", "social"],
  ai: ["ai", "llm", "gpt", "claude", "gemini", "prompt", "openai", "anthropic", "model", "agent", "rag", "retriev"],
  frontend: ["frontend", "react", "ui", "typescript", "tailwind", "interfac", "css", "html", "javascript", "next", "vite"],
  design: ["design", "ux", "figma", "wireframe", "prototyp", "visual"],
  who: ["who", "bio", "about", "yourself", "name", "introduc", "background"],
  experience: ["experi", "career", "history", "journey", "past", "resum", "cv", "year"],
  stats: ["stat", "number", "metric", "mani", "count", "lines", "code", "coffee", "bug"],
  greet: ["hi", "hey", "hello", "yo", "sup", "gm", "greeting", "howdy"],
};

/** Reverse index: stemmed-token → canonical concept keys it hits. */
const TOKEN_TO_CONCEPT: Record<string, Set<string>> = (() => {
  const map: Record<string, Set<string>> = {};
  for (const [concept, terms] of Object.entries(SYNONYMS)) {
    for (const t of terms) {
      const s = stem(t);
      (map[s] ??= new Set()).add(concept);
    }
  }
  return map;
})();

function conceptsFor(tokens: string[]): Set<string> {
  const s = new Set<string>();
  for (const t of tokens) TOKEN_TO_CONCEPT[t]?.forEach((c) => s.add(c));
  return s;
}

/* ---------- 3. intent classification ---------- */

type Intent =
  | "greet"
  | "who"
  | "skills"
  | "projects"
  | "project-detail"
  | "experience"
  | "contact"
  | "hire"
  | "ai"
  | "stats"
  | "fallback";

/** Per-intent weighted concept bag. Higher = stronger signal. */
const INTENT_WEIGHTS: Record<Exclude<Intent, "fallback" | "project-detail">, Record<string, number>> = {
  greet: { greet: 3 },
  who: { who: 3 },
  skills: { skill: 3, frontend: 1.5, design: 1 },
  projects: { project: 2.5 },
  experience: { experience: 3 },
  contact: { contact: 3, social: 2 },
  hire: { hire: 3, contact: 0.5 },
  ai: { ai: 3 },
  stats: { stats: 3 },
};

function scoreIntent(concepts: Set<string>, weights: Record<string, number>): number {
  let score = 0;
  for (const c of concepts) score += weights[c] ?? 0;
  return score;
}

/** If a query mentions a project name directly, that beats everything else. */
function directProjectMatch(query: string, tokens: string[]): (typeof projects)[number] | null {
  const q = query.toLowerCase();
  for (const p of projects) {
    if (q.includes(p.name.toLowerCase())) return p;
  }
  const nameTokens = projects.map((p) => ({ p, toks: tokenize(p.name) }));
  for (const { p, toks } of nameTokens) {
    const overlap = toks.filter((t) => tokens.includes(t)).length;
    if (overlap >= Math.max(1, Math.ceil(toks.length * 0.6))) return p;
  }
  return null;
}

function classify(query: string): {
  intent: Intent;
  confidence: number;
  project: (typeof projects)[number] | null;
} {
  const tokens = tokenize(query);
  const concepts = conceptsFor(tokens);

  const project = directProjectMatch(query, tokens);
  if (project) return { intent: "project-detail", confidence: 1, project };

  let best: Intent = "fallback";
  let bestScore = 0;
  for (const [intent, weights] of Object.entries(INTENT_WEIGHTS)) {
    const s = scoreIntent(concepts, weights);
    if (s > bestScore) {
      bestScore = s;
      best = intent as Intent;
    }
  }

  // normalized confidence: 0 if nothing matched, ~1 if strong hit
  const confidence = Math.min(1, bestScore / 3);
  if (bestScore < 1.5) best = "fallback";
  return { intent: best, confidence, project: null };
}

/* ---------- 4. BM25-ish corpus ranking (fallback + deep search) ---------- */

type Doc = {
  id: string;
  kind: "about" | "skill" | "project" | "experience" | "contact";
  title: string;
  body: string;
  payload?: unknown;
};

function buildCorpus(): Doc[] {
  const docs: Doc[] = [];
  docs.push({
    id: "about",
    kind: "about",
    title: identity.name,
    body: `${identity.role} ${identity.location} ${identity.tagline} ${about.join(" ")}`,
  });
  skills.forEach((g) =>
    docs.push({
      id: `skill-${g.title}`,
      kind: "skill",
      title: g.title,
      body: `${g.title} ${g.items.map((i) => i.name).join(" ")}`,
      payload: g,
    }),
  );
  projects.forEach((p) =>
    docs.push({
      id: `project-${p.id}`,
      kind: "project",
      title: p.name,
      body: `${p.name} ${p.summary} ${p.highlights.join(" ")} ${p.stack.join(" ")} ${p.status}`,
      payload: p,
    }),
  );
  experience.forEach((e, i) =>
    docs.push({
      id: `exp-${i}`,
      kind: "experience",
      title: e.what,
      body: `${e.when} ${e.what} ${e.detail}`,
      payload: e,
    }),
  );
  docs.push({
    id: "contact",
    kind: "contact",
    title: "contact",
    body: `${contact.email} ${contact.github} ${contact.twitter} ${contact.linkedin} email reach`,
  });
  return docs;
}

const CORPUS = buildCorpus();
const DOC_TOKENS: { doc: Doc; tokens: string[]; tf: Map<string, number>; len: number }[] =
  CORPUS.map((doc) => {
    const tokens = tokenize(`${doc.title} ${doc.body}`);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { doc, tokens, tf, len: tokens.length };
  });
const AVG_LEN = DOC_TOKENS.reduce((a, d) => a + d.len, 0) / DOC_TOKENS.length;
const DF: Map<string, number> = (() => {
  const df = new Map<string, number>();
  for (const { tokens } of DOC_TOKENS) {
    const seen = new Set(tokens);
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
  }
  return df;
})();
const N = DOC_TOKENS.length;

function idf(term: string): number {
  const df = DF.get(term) ?? 0;
  // BM25 idf with +0.5 smoothing
  return Math.log(1 + (N - df + 0.5) / (df + 0.5));
}

const K1 = 1.4;
const B = 0.75;

function bm25Rank(query: string): { doc: Doc; score: number }[] {
  const qTokens = tokenize(query);
  // expand with concept-sibling tokens (synonyms) at 0.5 weight
  const concepts = conceptsFor(qTokens);
  const expanded: { term: string; weight: number }[] = qTokens.map((t) => ({ term: t, weight: 1 }));
  for (const c of concepts) {
    for (const syn of SYNONYMS[c] ?? []) {
      const s = stem(syn);
      if (!qTokens.includes(s)) expanded.push({ term: s, weight: 0.5 });
    }
  }

  const scored = DOC_TOKENS.map(({ doc, tf, len }) => {
    let score = 0;
    for (const { term, weight } of expanded) {
      const f = tf.get(term) ?? 0;
      if (f === 0) continue;
      const numer = f * (K1 + 1);
      const denom = f + K1 * (1 - B + B * (len / AVG_LEN));
      score += weight * idf(term) * (numer / denom);
    }
    return { doc, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/* ---------- 5. response composition ---------- */

function stripAbout() {
  return about.filter((l) => l.trim()).join(" ").replace(/\s+/g, " ");
}

const greetings = [
  "hey — i'm the AI version of martins. ask me anything about his work, stack, or projects.",
  "hi there. want to hear about a project, his skills, or how to hire him?",
  "hey — type a question and i'll dig through his actual portfolio to answer.",
];

function describeProject(p: (typeof projects)[number]): string {
  const cs = p.caseStudy
    ? `\n\nthere's a full case study — click "Read case study" on the ${p.name} card for the deep dive.`
    : "";
  return `${p.name} — ${p.summary}\n\nStack: ${p.stack.join(", ")}\nStatus: ${p.status}\n\nHighlights:\n${p.highlights.map((h) => "• " + h).join("\n")}${cs}`;
}

export function answer(q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return greetings[0];

  const { intent, confidence, project } = classify(trimmed);

  switch (intent) {
    case "greet":
      return greetings[Math.floor(Math.random() * greetings.length)];

    case "who":
      return `${identity.name} — ${identity.role}, based ${identity.location}. ${stripAbout()}`;

    case "skills": {
      const flat = skills
        .map((g) => `${g.title}: ${g.items.slice(0, 4).map((i) => i.name).join(", ")}`)
        .join("\n• ");
      return `Here's what he works with day-to-day:\n• ${flat}`;
    }

    case "projects": {
      const list = projects.map((p) => `• ${p.name} — ${p.summary} [${p.status}]`).join("\n");
      return `Shipped and in-flight work:\n${list}\n\nAsk about any of them by name for the details.`;
    }

    case "project-detail":
      return describeProject(project!);

    case "experience":
      return `Career so far:\n${experience.map((e) => `• ${e.when} — ${e.what}: ${e.detail}`).join("\n")}`;

    case "contact":
      return `Best ways to reach him:\n• email: ${contact.email}\n• github: ${contact.github}\n• twitter: ${contact.twitter}\n• linkedin: ${contact.linkedin}\n\nhe replies fastest on email.`;

    case "hire":
      return `He's currently taking on freelance frontend + AI work. Best path: email ${contact.email} with a short brief (what, when, why). Reply within a day or two.`;

    case "ai":
      return `AI/LLM work is a big part of what he does:\n• prompt design & optimization\n• retrieval + context engineering (see the Neural Notes case study)\n• AI-assisted development workflows\n• shipping with GPT-4, Claude, Gemini\n\nask about PromptForge or Neural Notes for concrete examples.`;

    case "stats":
      return `By the numbers:\n• ${stats.linesOfCode} lines of code\n• ${stats.projectsShipped} projects shipped\n• ${stats.yearsCoding} years coding\n• ${stats.coffees} coffees\n• bugs fixed: ${stats.bugsFixed}`;

    case "fallback":
    default: {
      // semantic fallback — rank the corpus and return the best doc
      const ranked = bm25Rank(trimmed);
      const top = ranked[0];
      if (!top || top.score < 0.5) {
        return `hmm, not sure about that. try asking about: his skills, projects, experience, how to hire him, or say a project name like "${projects[0].name}".`;
      }
      const hint = confidence < 0.1 ? "closest match i found" : "here's what's most relevant";
      switch (top.doc.kind) {
        case "project":
          return `${hint}:\n\n${describeProject(top.doc.payload as (typeof projects)[number])}`;
        case "skill": {
          const g = top.doc.payload as (typeof skills)[number];
          return `${hint} — ${g.title}:\n${g.items.map((i) => `• ${i.name} (${i.level}%)`).join("\n")}`;
        }
        case "experience": {
          const e = top.doc.payload as (typeof experience)[number];
          return `${hint}:\n${e.when} — ${e.what}\n${e.detail}`;
        }
        case "contact":
          return `${hint}:\nemail ${contact.email} — fastest reply.`;
        case "about":
        default:
          return `${hint}:\n${stripAbout()}`;
      }
    }
  }
}

export const suggestedQuestions = [
  "what does he do?",
  "show me his projects",
  "tell me about Neural Notes",
  "is he available for hire?",
  "how do i contact him?",
];

/* exported for tests / terminal integration */
export const __internals = { tokenize, stem, classify, bm25Rank };
