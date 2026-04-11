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

export type Project = {
  id: string;
  name: string;
  stack: string[];
  summary: string;
  highlights: string[];
  status: "shipped" | "building" | "prototype";
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
  email: "martins@example.dev",
  github: "github.com/programmer-martins",
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
