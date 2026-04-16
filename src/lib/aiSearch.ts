import {
  about,
  contact,
  experience,
  identity,
  projects,
  skills,
  stats,
} from "../data/portfolio";

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

const TOK = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(Boolean);

function has(q: string, ...needles: string[]) {
  const t = q.toLowerCase();
  return needles.some((n) => t.includes(n));
}

function detectIntent(q: string): Intent {
  if (!q.trim()) return "fallback";
  if (has(q, "hi", "hey", "hello", "yo ", "sup", "gm")) return "greet";
  if (has(q, "who are you", "about", "bio", "who is", "who's", "yourself")) return "who";
  if (has(q, "skill", "stack", "tech", "know", "good at", "expert")) return "skills";
  if (has(q, "hire", "available", "freelance", "work with", "contract", "job")) return "hire";
  if (has(q, "email", "contact", "reach", "github", "twitter", "linkedin", "x.com", "social"))
    return "contact";
  if (has(q, "experience", "career", "journey", "history", "background", "past")) return "experience";
  if (has(q, "stats", "numbers", "metrics", "how many", "lines of code", "coffees")) return "stats";
  if (has(q, "ai", "llm", "prompt", "gpt", "claude", "gemini", "openai", "anthropic")) return "ai";

  // project-name match
  const qt = q.toLowerCase();
  if (projects.some((p) => qt.includes(p.name.toLowerCase()))) return "project-detail";
  if (has(q, "project", "built", "ship", "made", "portfolio work")) return "projects";
  return "fallback";
}

function findProject(q: string) {
  const qt = q.toLowerCase();
  return projects.find((p) => qt.includes(p.name.toLowerCase()));
}

const greetings = [
  "hey — i'm the AI version of martins. ask me anything about his work, stack, or projects.",
  "hi there. want to hear about a project, his skills, or how to hire him?",
  "hey 👋 type a question — i'll dig through his actual portfolio to answer.",
];

function stripMarkdownAbout() {
  return about.filter((l) => l.trim()).join(" ").replace(/\s+/g, " ");
}

export function answer(q: string): string {
  const intent = detectIntent(q);

  switch (intent) {
    case "greet":
      return greetings[Math.floor(Math.random() * greetings.length)];

    case "who":
      return `${identity.name} — ${identity.role}, based ${identity.location}. ${stripMarkdownAbout()}`;

    case "skills": {
      const flat = skills
        .map(
          (g) =>
            `${g.title}: ${g.items
              .slice(0, 4)
              .map((i) => i.name)
              .join(", ")}`,
        )
        .join("\n• ");
      return `Here's what he works with day-to-day:\n• ${flat}`;
    }

    case "projects": {
      const list = projects
        .map((p) => `• ${p.name} — ${p.summary} [${p.status}]`)
        .join("\n");
      return `Shipped and in-flight work:\n${list}\n\nAsk about any of them by name for the details.`;
    }

    case "project-detail": {
      const p = findProject(q);
      if (!p) return "i couldn't find that one. try: " + projects.map((x) => x.name).join(", ");
      const cs = p.caseStudy ? `\n\nthere's a full case study — click "Read case study" on the ${p.name} card.` : "";
      return `${p.name} — ${p.summary}\n\nStack: ${p.stack.join(", ")}\nStatus: ${p.status}\n\nHighlights:\n${p.highlights.map((h) => "• " + h).join("\n")}${cs}`;
    }

    case "experience": {
      const list = experience.map((e) => `• ${e.when} — ${e.what}: ${e.detail}`).join("\n");
      return `Career so far:\n${list}`;
    }

    case "contact":
      return `Best ways to reach him:\n• email: ${contact.email}\n• github: ${contact.github}\n• twitter: ${contact.twitter}\n• linkedin: ${contact.linkedin}\n\nhe replies fastest on email.`;

    case "hire":
      return `He's currently taking on freelance frontend + AI work. Best path: email ${contact.email} with a short brief (what, when, why). He'll reply within a day or two.`;

    case "ai":
      return `AI/LLM work is a big part of what he does:\n• prompt design & optimization\n• retrieval + context engineering (see Neural Notes case study)\n• AI-assisted development workflows\n• building with GPT-4, Claude, Gemini\n\nask about PromptForge or Neural Notes for concrete examples.`;

    case "stats":
      return `By the numbers:\n• ${stats.linesOfCode} lines of code\n• ${stats.projectsShipped} projects shipped\n• ${stats.yearsCoding} years coding\n• ${stats.coffees} coffees\n• bugs fixed: ${stats.bugsFixed}`;

    case "fallback":
    default: {
      // last-ditch keyword scan
      const toks = TOK(q);
      for (const p of projects) {
        const hay = TOK(p.name + " " + p.summary + " " + p.stack.join(" "));
        if (toks.some((t) => t.length > 3 && hay.includes(t))) {
          return `closest match i found: ${p.name} — ${p.summary}. Stack: ${p.stack.join(", ")}.`;
        }
      }
      return `hmm, not sure about that. try asking about: his skills, projects, experience, how to hire him, or say a project name like "${projects[0].name}".`;
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
