import type { ReactNode } from "react";
import type { CommandContext, CommandResult } from "../types";
import {
  about,
  asciiName,
  contact,
  experience,
  identity,
  projects,
  skills,
  stats,
} from "../data/portfolio";

type Command = {
  name: string;
  description: string;
  usage?: string;
  hidden?: boolean;
  run: (args: string[], ctx: CommandContext) => CommandResult;
};

const colorClassFor = (c: "accent" | "cyan" | "purple" | "pink") =>
  c === "accent"
    ? "text-accent"
    : c === "cyan"
    ? "text-cyan"
    : c === "purple"
    ? "text-purple"
    : "text-pink";

/* ---------- Renderers (pure JSX — no state) ---------- */

const Line = ({ children }: { children?: ReactNode }) => (
  <div className="leading-relaxed">{children ?? "\u00A0"}</div>
);

const Section = ({
  title,
  color = "text-accent",
  children,
}: {
  title: string;
  color?: string;
  children: ReactNode;
}) => (
  <div className="mb-3">
    <div className={`${color} glow-accent font-semibold`}>
      ┌─ {title}
    </div>
    <div className="pl-3 border-l border-term ml-[4px] mt-1">{children}</div>
  </div>
);

const Bar = ({ value }: { value: number }) => {
  const total = 22;
  const filled = Math.round((value / 100) * total);
  return (
    <span className="text-dim">
      [<span className="text-accent glow-accent">{"█".repeat(filled)}</span>
      <span>{"░".repeat(total - filled)}</span>] {value}%
    </span>
  );
};

/* ---------- Commands ---------- */

export const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "show all available commands",
    run: () => {
      const list = Object.values(commands).filter((c) => !c.hidden);
      return (
        <div>
          <Line>
            <span className="text-dim">Available commands — type any of them:</span>
          </Line>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {list.map((c) => (
              <div key={c.name} className="flex">
                <span className="text-accent glow-accent w-24 shrink-0">
                  {c.name}
                </span>
                <span className="text-dim">{c.description}</span>
              </div>
            ))}
          </div>
          <Line>&nbsp;</Line>
          <Line>
            <span className="text-dim">
              tip: <span className="text-cyan">Tab</span> to autocomplete,{" "}
              <span className="text-cyan">↑/↓</span> for history,{" "}
              <span className="text-cyan">Ctrl+L</span> to clear.
            </span>
          </Line>
        </div>
      );
    },
  },

  about: {
    name: "about",
    description: "who is Programmer Martins?",
    run: () => (
      <div>
        <pre className="ascii text-accent glow-accent">{asciiName}</pre>
        <Line>
          <span className="text-cyan">{identity.name}</span>{" "}
          <span className="text-dim">— {identity.role}</span>
        </Line>
        <Line>
          <span className="text-dim">{identity.location}</span>
        </Line>
        <Line>&nbsp;</Line>
        {about.map((l, i) => (
          <Line key={i}>{l || "\u00A0"}</Line>
        ))}
      </div>
    ),
  },

  whoami: {
    name: "whoami",
    description: "print current identity",
    run: () => (
      <div>
        <Line>
          <span className="text-accent glow-accent">
            {identity.handle}@portfolio
          </span>
        </Line>
        <Line>
          <span className="text-dim">name    </span> {identity.name}
        </Line>
        <Line>
          <span className="text-dim">role    </span> {identity.role}
        </Line>
        <Line>
          <span className="text-dim">status  </span>{" "}
          <span className="text-accent">online</span>{" "}
          <span className="text-dim">· shipping</span>
        </Line>
        <Line>
          <span className="text-dim">motto   </span>{" "}
          <span className="text-purple">"{identity.tagline}"</span>
        </Line>
      </div>
    ),
  },

  skills: {
    name: "skills",
    description: "list technical skills",
    run: () => (
      <div>
        {skills.map((group) => (
          <Section
            key={group.title}
            title={`${group.icon}  ${group.title}`}
            color={colorClassFor(group.color)}
          >
            {group.items.map((item) => (
              <div key={item.name} className="flex flex-wrap gap-x-3">
                <span className="text-term w-56 shrink-0">{item.name}</span>
                <Bar value={item.level} />
              </div>
            ))}
          </Section>
        ))}
      </div>
    ),
  },

  projects: {
    name: "projects",
    description: "list featured projects",
    run: () => (
      <div>
        <Line>
          <span className="text-dim">
            {projects.length} projects · type{" "}
            <span className="text-cyan">open &lt;id&gt;</span> for details
          </span>
        </Line>
        <Line>&nbsp;</Line>
        {projects.map((p) => (
          <div key={p.id} className="mb-2">
            <div>
              <span className="text-dim">#{p.id} </span>
              <span className="text-accent glow-accent font-semibold">
                {p.name}
              </span>{" "}
              <span
                className={
                  p.status === "shipped"
                    ? "text-accent"
                    : p.status === "building"
                    ? "text-cyan"
                    : "text-purple"
                }
              >
                [{p.status}]
              </span>
            </div>
            <div className="pl-4 text-dim">{p.summary}</div>
            <div className="pl-4 text-purple text-sm">
              {p.stack.join(" · ")}
            </div>
          </div>
        ))}
      </div>
    ),
  },

  open: {
    name: "open",
    description: "open a project by id (e.g. open 02)",
    usage: "open <id>",
    run: (args) => {
      const id = args[0];
      if (!id) {
        return (
          <div className="text-pink">
            usage: open &lt;id&gt; — try{" "}
            <span className="text-cyan">projects</span> first.
          </div>
        );
      }
      const p = projects.find(
        (x) => x.id === id.padStart(2, "0") || x.name.toLowerCase() === id.toLowerCase(),
      );
      if (!p)
        return (
          <div className="text-pink">project "{id}" not found.</div>
        );
      return (
        <div>
          <div className="text-accent glow-accent text-lg">
            ▸ {p.name}{" "}
            <span className="text-dim text-sm">#{p.id}</span>
          </div>
          <div className="text-purple">{p.stack.join(" · ")}</div>
          <div className="text-dim mt-1">{p.summary}</div>
          <div className="mt-2 text-cyan">highlights:</div>
          <ul className="pl-4">
            {p.highlights.map((h, i) => (
              <li key={i} className="text-term">
                <span className="text-accent">▸ </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },

  experience: {
    name: "experience",
    description: "short career journey",
    run: () => (
      <div>
        {experience.map((e, i) => (
          <div key={i} className="mb-2">
            <div>
              <span className="text-accent glow-accent">{e.when}</span>{" "}
              <span className="text-term">·</span>{" "}
              <span className="text-cyan">{e.what}</span>
            </div>
            <div className="pl-4 text-dim">{e.detail}</div>
          </div>
        ))}
      </div>
    ),
  },

  contact: {
    name: "contact",
    description: "how to reach me",
    run: () => (
      <div>
        <Line>
          <span className="text-dim">email   </span>{" "}
          <a
            className="text-accent glow-accent underline-offset-2 hover:underline"
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
        </Line>
        <Line>
          <span className="text-dim">github  </span>{" "}
          <span className="text-cyan">{contact.github}</span>
        </Line>
        <Line>
          <span className="text-dim">twitter </span>{" "}
          <span className="text-cyan">{contact.twitter}</span>
        </Line>
        <Line>
          <span className="text-dim">linkedin</span>{" "}
          <span className="text-cyan">{contact.linkedin}</span>
        </Line>
        <Line>&nbsp;</Line>
        <Line>
          <span className="text-purple">
            dm's open · collabs welcome · coffee encouraged
          </span>
        </Line>
      </div>
    ),
  },

  stats: {
    name: "stats",
    description: "portfolio statistics",
    run: () => (
      <div>
        <Line>
          <span className="text-dim">lines of code   </span>{" "}
          <span className="text-accent glow-accent">{stats.linesOfCode}</span>
        </Line>
        <Line>
          <span className="text-dim">projects shipped</span>{" "}
          <span className="text-accent glow-accent">
            {stats.projectsShipped}
          </span>
        </Line>
        <Line>
          <span className="text-dim">years coding    </span>{" "}
          <span className="text-accent glow-accent">{stats.yearsCoding}</span>
        </Line>
        <Line>
          <span className="text-dim">coffees consumed</span>{" "}
          <span className="text-accent glow-accent">{stats.coffees}</span>
        </Line>
        <Line>
          <span className="text-dim">bugs fixed      </span>{" "}
          <span className="text-purple">{stats.bugsFixed}</span>
        </Line>
      </div>
    ),
  },

  theme: {
    name: "theme",
    description: "switch themes (dark | neon | matrix)",
    usage: "theme <dark|neon|matrix>",
    run: (args, ctx) => {
      const next = args[0] as "dark" | "neon" | "matrix" | undefined;
      if (!next) {
        const cycle = { dark: "neon", neon: "matrix", matrix: "dark" } as const;
        const chosen = cycle[ctx.theme];
        ctx.setTheme(chosen);
        return (
          <div>
            theme switched to{" "}
            <span className="text-accent glow-accent">{chosen}</span>
          </div>
        );
      }
      if (!["dark", "neon", "matrix"].includes(next)) {
        return <div className="text-pink">unknown theme: {next}</div>;
      }
      ctx.setTheme(next);
      return (
        <div>
          theme switched to{" "}
          <span className="text-accent glow-accent">{next}</span>
        </div>
      );
    },
  },

  clear: {
    name: "clear",
    description: "clear the terminal",
    run: (_a, ctx) => {
      ctx.clear();
      return null;
    },
  },

  ls: {
    name: "ls",
    description: "list files in current directory",
    run: (_a, ctx) => {
      const fs: Record<string, string[]> = {
        "~": ["about.md", "skills.json", "projects/", "experience.log", "contact.vcf", ".secret"],
        "~/projects": projects.map((p) => `${p.name.toLowerCase().replace(/\s+/g, "-")}.md`),
      };
      const key = "~" + (ctx.cwd.length ? "/" + ctx.cwd.join("/") : "");
      const entries = fs[key] ?? [];
      if (!entries.length)
        return <div className="text-dim">(empty directory)</div>;
      return (
        <div className="flex flex-wrap gap-x-6">
          {entries.map((e) => (
            <span
              key={e}
              className={
                e.endsWith("/") ? "text-cyan glow-cyan" : "text-term"
              }
            >
              {e}
            </span>
          ))}
        </div>
      );
    },
  },

  cd: {
    name: "cd",
    description: "change directory (try: cd projects)",
    usage: "cd <dir>",
    run: (args, ctx) => {
      const target = args[0] ?? "~";
      if (target === "~" || target === "/") {
        ctx.setCwd([]);
        return null;
      }
      if (target === "..") {
        ctx.setCwd(ctx.cwd.slice(0, -1));
        return null;
      }
      const clean = target.replace(/\/$/, "");
      if (clean === "projects") {
        ctx.setCwd(["projects"]);
        return (
          <div className="text-dim">
            entered <span className="text-cyan">~/projects</span> — try{" "}
            <span className="text-cyan">ls</span>
          </div>
        );
      }
      return <div className="text-pink">cd: no such directory: {target}</div>;
    },
  },

  pwd: {
    name: "pwd",
    description: "print working directory",
    run: (_a, ctx) => (
      <div className="text-cyan">
        ~{ctx.cwd.length ? "/" + ctx.cwd.join("/") : ""}
      </div>
    ),
  },

  echo: {
    name: "echo",
    description: "print text",
    run: (args) => <div>{args.join(" ")}</div>,
  },

  date: {
    name: "date",
    description: "current date/time",
    run: () => <div className="text-cyan">{new Date().toString()}</div>,
  },

  sudo: {
    name: "sudo",
    description: "try it...",
    run: () => (
      <div className="text-pink">
        nice try. you are not in the sudoers file. this incident will be
        reported.
      </div>
    ),
  },

  secret: {
    name: "secret",
    description: "???",
    hidden: true,
    run: () => (
      <div>
        <div className="text-purple glow-purple">
          ✦ you found the secret command ✦
        </div>
        <Line>&nbsp;</Line>
        <Line>
          <span className="text-dim">
            here's the truth: most "10x engineers" are just people who
          </span>
        </Line>
        <Line>
          <span className="text-dim">
            shipped small things every day for a long, long time.
          </span>
        </Line>
        <Line>&nbsp;</Line>
        <Line>
          <span className="text-accent glow-accent">
            keep shipping. you're closer than you think.
          </span>
        </Line>
      </div>
    ),
  },

  matrix: {
    name: "matrix",
    description: "enter the matrix",
    hidden: true,
    run: (_a, ctx) => {
      ctx.setTheme("matrix");
      return (
        <div className="text-accent glow-accent">
          wake up, neo... the matrix has you.
        </div>
      );
    },
  },

  exit: {
    name: "exit",
    description: "close the session",
    run: () => (
      <div className="text-dim">
        you can't really exit a portfolio. but nice try.{" "}
        <span className="text-purple">[connection kept alive]</span>
      </div>
    ),
  },
};

/* ---------- Dispatcher ---------- */

export function runCommand(
  raw: string,
  ctx: CommandContext,
): { node: ReactNode; typed: boolean } {
  const trimmed = raw.trim();
  if (!trimmed) return { node: null, typed: false };

  const [name, ...args] = trimmed.split(/\s+/);
  const cmd = commands[name.toLowerCase()];
  if (!cmd) {
    return {
      node: (
        <div>
          <span className="text-pink">command not found: </span>
          <span className="text-term">{name}</span>
          <span className="text-dim">
            {" "}
            — type <span className="text-cyan">help</span>
          </span>
        </div>
      ),
      typed: false,
    };
  }

  const out = cmd.run(args, ctx);
  return { node: out ?? null, typed: false };
}

export const commandNames = () =>
  Object.values(commands)
    .filter((c) => !c.hidden)
    .map((c) => c.name);
