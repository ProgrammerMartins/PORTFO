import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { contact, projects } from "../data/portfolio";
import { useSiteTheme } from "../lib/useSiteTheme";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "projects" | "social" | "action";
  keywords?: string;
  run: () => void;
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { toggle: toggleTheme } = useSiteTheme();

  const actions = useMemo<Action[]>(() => {
    const base: Action[] = [
      { id: "nav-hero", label: "Go to Home", group: "navigate", keywords: "top hero start", run: () => scrollToId("hero") },
      { id: "nav-about", label: "Go to About", group: "navigate", run: () => scrollToId("about") },
      { id: "nav-skills", label: "Go to Skills", group: "navigate", run: () => scrollToId("skills") },
      { id: "nav-projects", label: "Go to Projects", group: "navigate", run: () => scrollToId("projects") },
      { id: "nav-experience", label: "Go to Experience", group: "navigate", run: () => scrollToId("experience") },
      { id: "nav-terminal", label: "Go to Terminal", group: "navigate", keywords: "cli shell", run: () => scrollToId("terminal") },
      { id: "nav-contact", label: "Go to Contact", group: "navigate", run: () => scrollToId("contact") },

      { id: "action-theme", label: "Toggle light / dark mode", hint: "site theme", group: "action", keywords: "dark light mode theme", run: () => toggleTheme() },
      { id: "action-copy-email", label: "Copy email address", hint: contact.email, group: "action", keywords: "email address", run: () => navigator.clipboard?.writeText(contact.email) },
      { id: "action-resume", label: "Open resume (terminal: resume)", hint: "scrolls to terminal", group: "action", keywords: "cv resume", run: () => scrollToId("terminal") },

      { id: "social-github", label: "Open GitHub", hint: contact.github, group: "social", run: () => window.open(`https://${contact.github}`, "_blank") },
      { id: "social-twitter", label: "Open Twitter / X", hint: contact.twitter, group: "social", run: () => window.open(`https://x.com/${contact.twitter.replace("@", "")}`, "_blank") },
      { id: "social-linkedin", label: "Open LinkedIn", hint: contact.linkedin, group: "social", run: () => window.open(`https://${contact.linkedin}`, "_blank") },
      { id: "social-email", label: "Send email", hint: contact.email, group: "social", run: () => (window.location.href = `mailto:${contact.email}`) },
    ];

    projects.forEach((p) => {
      base.push({
        id: `proj-${p.id}`,
        label: `Project: ${p.name}`,
        hint: p.summary,
        group: "projects",
        keywords: p.stack.join(" "),
        run: () => scrollToId("projects"),
      });
    });

    return base;
  }, [toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      (a.label + " " + (a.hint ?? "") + " " + (a.keywords ?? "") + " " + a.group)
        .toLowerCase()
        .includes(q),
    );
  }, [actions, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(`[data-i="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const runAt = (i: number) => {
    const a = filtered[i];
    if (!a) return;
    a.run();
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(filtered.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(cursor);
    }
  };

  const groupLabels: Record<Action["group"], string> = {
    navigate: "Navigate",
    projects: "Projects",
    social: "Social",
    action: "Actions",
  };

  const grouped = useMemo(() => {
    const g: Record<string, { a: Action; i: number }[]> = {};
    filtered.forEach((a, i) => {
      (g[a.group] ??= []).push({ a, i });
    });
    return g;
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[120] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white dark:bg-surface-50 border border-slate-200 dark:border-surface-300/50 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-surface-300/40">
              <span className="font-mono text-sm text-emerald-600 dark:text-brand">&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="search commands, projects, sections…"
                className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm outline-none"
              />
              <kbd className="hidden sm:inline-block font-mono text-[10px] text-slate-500 border border-slate-200 dark:border-surface-300/50 rounded px-1.5 py-0.5">
                esc
              </kbd>
            </div>

            <ul
              ref={listRef}
              className="max-h-[50vh] overflow-y-auto py-2"
            >
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-slate-500">
                  no matches
                </li>
              )}

              {(Object.keys(grouped) as Action["group"][]).map((g) => (
                <div key={g}>
                  <div className="px-4 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {groupLabels[g]}
                  </div>
                  {grouped[g].map(({ a, i }) => (
                    <li
                      key={a.id}
                      data-i={i}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => runAt(i)}
                      className={`px-4 py-2 cursor-pointer flex items-center justify-between gap-3 ${
                        cursor === i
                          ? "bg-emerald-50 dark:bg-brand/10"
                          : "hover:bg-slate-50 dark:hover:bg-surface-100/50"
                      }`}
                    >
                      <span
                        className={`text-sm truncate ${
                          cursor === i
                            ? "text-emerald-700 dark:text-brand"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {a.label}
                      </span>
                      {a.hint && (
                        <span className="text-xs font-mono text-slate-400 truncate max-w-[40%]">
                          {a.hint}
                        </span>
                      )}
                    </li>
                  ))}
                </div>
              ))}
            </ul>

            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-surface-300/40 text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-surface-100/40">
              <div className="flex items-center gap-3">
                <span><kbd className="border border-slate-200 dark:border-surface-300/50 rounded px-1">↑</kbd> <kbd className="border border-slate-200 dark:border-surface-300/50 rounded px-1">↓</kbd> navigate</span>
                <span><kbd className="border border-slate-200 dark:border-surface-300/50 rounded px-1">↵</kbd> select</span>
              </div>
              <span className="text-emerald-600 dark:text-brand">martins.ctrl+k</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
