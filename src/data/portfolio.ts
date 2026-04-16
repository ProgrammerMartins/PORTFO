export const identity = {
  name: "Programmer Martins",
  handle: "martins",
  role: "Frontend Developer | AI Engineer in the making",
  location: "Remote · Earth",
  tagline:
    "I build interfaces that feel alive, and teach machines to speak human.",
};

export const about = [
  "Hey — I'm Martins Charles.",
  "",
  "I'm a frontend developer obsessed with the craft of interfaces:",
  "the millisecond of a hover, the weight of a shadow, the rhythm of type.",
  "",
  "I'm also an AI engineer in the making — teaching language models to",
  "reason, to build, and to ship real products alongside me.",
  "",
  "When I'm not shipping pixels, I'm probably debugging a prompt,",
  "refactoring a component, or staring at a terminal. Like this one.",
];

export type SkillGroup = {
  title: string;
  icon: string;
  color: "accent" | "cyan" | "purple" | "pink";
  items: { name: string; level: number }[];
};

export const skills: SkillGroup[] = [
  {
    title: "Frontend Development",
    icon: "▲",
    color: "accent",
    items: [
      { name: "HTML / CSS", level: 95 },
      { name: "JavaScript", level: 92 },
      { name: "React + TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 94 },
      { name: "Vite / Next.js", level: 85 },
    ],
  },
  {
    title: "UI / UX Design",
    icon: "◆",
    color: "cyan",
    items: [
      { name: "Figma (wireframing, prototyping)", level: 88 },
      { name: "Clean UI principles", level: 90 },
      { name: "User-centered design", level: 86 },
      { name: "Design systems", level: 82 },
    ],
  },
  {
    title: "AI / Prompt Engineering",
    icon: "✦",
    color: "purple",
    items: [
      { name: "Prompt design & optimization", level: 90 },
      { name: "Working with LLMs (GPT, Claude, Gemini)", level: 88 },
      { name: "AI-assisted development", level: 92 },
      { name: "Retrieval & context engineering", level: 80 },
    ],
  },
];

export type CaseStudy = {
  problem: string;
  approach: string[];
  decisions: { title: string; body: string }[];
  metrics: { label: string; value: string }[];
  stackNotes: { label: string; why: string }[];
};

export type Project = {
  id: string;
  name: string;
  stack: string[];
  summary: string;
  highlights: string[];
  status: "shipped" | "building" | "prototype";
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    id: "01",
    name: "Neural Notes",
    stack: ["React", "TypeScript", "OpenAI API", "Tailwind"],
    summary:
      "An AI notebook that turns messy thoughts into structured, linkable ideas.",
    highlights: [
      "Context-aware summarization across a personal knowledge graph",
      "Streaming UI with optimistic rendering",
      "Prompt cache layer cut token costs by ~60%",
    ],
    status: "shipped",
    caseStudy: {
      problem:
        "I kept writing fragments — half-thoughts in Notion, TODOs in Obsidian, voice memos in my phone. None of them talked to each other. I wanted one place that could read the whole graph, find the through-line, and surface the idea I was circling around without me having to remember where I wrote it down.",
      approach: [
        "Ingest notes as plain markdown and chunk them by heading + paragraph, not by token count.",
        "Embed chunks with OpenAI text-embedding-3-small and store vectors locally in IndexedDB — no server needed for a personal tool.",
        "At query time, retrieve top-k chunks, assemble a compact context window, and stream a summarization back into the UI.",
        "Cache prompt prefixes aggressively — the system prompt and retrieved context rarely change between follow-ups.",
      ],
      decisions: [
        {
          title: "Local-first over cloud sync",
          body: "Vector store lives in IndexedDB. No account, no backend, no privacy worry. Sync is a separate concern I chose not to solve on v1.",
        },
        {
          title: "Streaming over wait-and-render",
          body: "Users tolerate slow AI if they see progress. I ship the first token in <400ms and optimistically render markdown as it arrives — hashes become headings before the stream is done.",
        },
        {
          title: "Prompt cache, not result cache",
          body: "Caching final outputs breaks the minute wording changes. Caching the prefix (system + retrieved context) hits on every follow-up in a session — that's where the 60% token savings came from.",
        },
        {
          title: "Chunk by structure, not size",
          body: "Fixed-size chunking shreds ideas mid-sentence. Splitting on markdown headings preserves semantic units — retrieval quality jumped noticeably once I switched.",
        },
      ],
      metrics: [
        { label: "Token cost", value: "↓ ~60%" },
        { label: "First token", value: "<400ms" },
        { label: "Retrieval quality", value: "↑ ~40%" },
        { label: "Bundle size", value: "112kb gz" },
      ],
      stackNotes: [
        {
          label: "React + TypeScript",
          why: "Strict types caught more bugs than any test I wrote. Streaming state machines especially.",
        },
        {
          label: "OpenAI Embeddings + GPT-4o-mini",
          why: "Cheap embeddings, capable-enough model. Swapping for Claude was a one-file change — provider-agnostic adapter.",
        },
        {
          label: "IndexedDB via idb-keyval",
          why: "Zero-config persistence. Handles 10k+ vectors without a backend. Tiny footprint.",
        },
        {
          label: "Tailwind + CSS vars",
          why: "Design tokens live in CSS so themes swap without re-rendering React.",
        },
      ],
    },
  },
  {
    id: "02",
    name: "Pulse UI Kit",
    stack: ["React", "Framer Motion", "Tailwind"],
    summary:
      "A component library of micro-interactions designed for product teams.",
    highlights: [
      "40+ accessible components, fully typed",
      "Motion primitives built on Framer Motion",
      "Dark-first design with light-mode parity",
    ],
    status: "shipped",
  },
  {
    id: "03",
    name: "PromptForge",
    stack: ["Next.js", "LLMs", "Edge Functions"],
    summary:
      "A playground for designing, testing and versioning prompts like code.",
    highlights: [
      "Side-by-side model comparisons",
      "Prompt diffing with semantic highlights",
      "Shareable runs with one-click reproducibility",
    ],
    status: "building",
  },
  {
    id: "04",
    name: "Terminal Portfolio",
    stack: ["Vite", "React", "TypeScript", "Tailwind"],
    summary:
      "The site you're looking at. A CLI that thinks it's a portfolio.",
    highlights: [
      "Fake filesystem with `cd` and `ls`",
      "Command history, autocomplete, themes",
      "Built in a single evening because it was fun",
    ],
    status: "shipped",
  },
];

export const experience = [
  {
    when: "2024 — now",
    what: "Freelance Frontend Developer",
    detail:
      "Shipping React + TS interfaces for startups. Design systems, motion, LLM-powered features.",
  },
  {
    when: "2023",
    what: "AI / Prompt Engineering — Self-directed",
    detail:
      "Deep dive into LLM tooling: retrieval, evals, agent workflows. Shipped 3 AI products solo.",
  },
  {
    when: "2022",
    what: "Frontend Developer — Indie",
    detail:
      "Built and launched small products. Fell in love with the craft of UI.",
  },
  {
    when: "2021",
    what: "Started coding",
    detail: "First line of JavaScript. Never looked back.",
  },
];

export const contact = {
  email: "ProgrammerMartins@gmail.com",
  github: "github.com/ProgrammerMartins",
  twitter: "@programmer_mtns",
  linkedin: "linkedin.com/in/programmer-martins",
};

export const stats = {
  linesOfCode: "120k+",
  projectsShipped: 14,
  coffees: "∞",
  bugsFixed: "most of them",
  yearsCoding: 4,
};

export const asciiName = String.raw`
  __  __    _    ____ _____ ___ _   _ ____
 |  \/  |  / \  |  _ \_   _|_ _| \ | / ___|
 | |\/| | / _ \ | |_) || |  | ||  \| \___ \
 | |  | |/ ___ \|  _ < | |  | || |\  |___) |
 |_|  |_/_/   \_\_| \_\|_| |___|_| \_|____/
`;
