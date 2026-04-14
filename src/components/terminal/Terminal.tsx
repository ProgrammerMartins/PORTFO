import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Prompt from "./Prompt";
import BootSequence from "./BootSequence";
import TypedOutput from "./TypedOutput";
import { commandNames, runCommand } from "../../lib/CommandHandler";
import type { TerminalLine, Theme } from "../../types";

const STORAGE_THEME = "martins.term-theme";

export default function Terminal() {
  const [booted, setBooted] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [cwd, setCwd] = useState<string[]>([]);
  const [theme, setThemeState] = useState<Theme>("dark");
  const [suggestion, setSuggestion] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineId = useRef(0);

  /* ---------- theme bootstrapping ---------- */
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_THEME) as Theme) || "dark";
    setThemeState(saved);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_THEME, t);
  }, []);

  /* ---------- scrolling: follow content as it grows (typing reveal) ---------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollDown = () => {
      el.scrollTop = el.scrollHeight;
    };
    scrollDown();
    const ro = new ResizeObserver(scrollDown);
    // observe inner content so we catch the height animation of TypedOutput
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [lines, booted]);

  /* ---------- focus management (scoped to terminal container) ---------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => inputRef.current?.focus();
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  /* ---------- primitives ---------- */
  const pushLine = useCallback((node: ReactNode, typed = false) => {
    lineId.current += 1;
    setLines((l) => [...l, { id: lineId.current, node, typed }]);
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const execute = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();

      pushLine(
        <Prompt cwd={cwd}>
          <span className="text-term">{raw}</span>
        </Prompt>,
      );

      if (!trimmed) return;

      const ctx = {
        theme,
        setTheme,
        clear,
        cwd,
        setCwd,
        print: pushLine,
        runCommand: (c: string) => execute(c),
      };

      const { node } = runCommand(trimmed, ctx);
      if (node)
        pushLine(
          <TypedOutput>
            <div className="pl-0 py-1">{node}</div>
          </TypedOutput>,
          true,
        );

      setHistory((h) => (h[h.length - 1] === trimmed ? h : [...h, trimmed]));
      setHistoryIndex(null);
    },
    [clear, cwd, pushLine, setTheme, theme],
  );

  /* ---------- suggestion / autocomplete ---------- */
  useEffect(() => {
    if (!input) {
      setSuggestion("");
      return;
    }
    const match = commandNames().find(
      (c) => c.startsWith(input) && c !== input,
    );
    setSuggestion(match ?? "");
  }, [input]);

  /* ---------- key handling ---------- */
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      clear();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      execute(input);
      setInput("");
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) setInput(suggestion);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next] ?? "");
      }
      return;
    }
  };

  /* ---------- post-boot hello ---------- */
  const helloPushed = useRef(false);
  useEffect(() => {
    if (booted && !helloPushed.current) {
      helloPushed.current = true;
      pushLine(
        <div>
          <div className="text-cyan glow-cyan">
            session established &middot; {new Date().toLocaleString()}
          </div>
          <div className="text-dim">
            type <span className="text-accent glow-accent">help</span> to see
            available commands
          </div>
        </div>,
      );
    }
  }, [booted, pushLine]);

  /* ---------- theme class for terminal container ---------- */
  const themeClass =
    theme === "neon"
      ? "[--term-bg:#0b0320] [--term-panel:#120636] [--term-border:#3a1065] [--term-text:#f5d0ff] [--term-dim:#a78bfa] [--term-accent:#ff5cf4] [--term-cyan:#22d3ee] [--term-purple:#c084fc] [--term-pink:#ff3df0]"
      : theme === "matrix"
      ? "[--term-bg:#000] [--term-panel:#020a02] [--term-border:#0f3a0f] [--term-text:#9effa0] [--term-dim:#4bd14b] [--term-accent:#00ff41] [--term-cyan:#00ff41] [--term-purple:#00cc33] [--term-pink:#66ff66]"
      : "[--term-bg:#0a0e14] [--term-panel:#0d1117] [--term-border:#1f2933] [--term-text:#c9d1d9] [--term-dim:#7d8590] [--term-accent:#00ff9c] [--term-cyan:#22d3ee] [--term-purple:#a78bfa] [--term-pink:#ff5cf4]";

  /* ---------- header ---------- */
  const header = useMemo(
    () => (
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-term bg-panel">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block" />
        </div>
        <div className="text-dim text-[10px] sm:text-sm tracking-wider font-mono truncate min-w-0">
          <span className="hidden sm:inline">martins@portfolio &mdash; zsh &mdash; </span>
          <span className="sm:hidden">zsh — </span>
          {cwd.length ? "~/" + cwd.join("/") : "~"}
        </div>
        <div className="text-dim text-xs hidden sm:block font-mono shrink-0">
          theme: <span className="text-accent glow-accent">{theme}</span>
        </div>
      </div>
    ),
    [cwd, theme],
  );

  return (
    <div
      ref={containerRef}
      className={`relative crt w-full font-mono rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 dark:border-surface-300/40 shadow-lg dark:shadow-glow-card glow-box ${themeClass}`}
      style={{ height: "min(70vh, 560px)", minHeight: "400px" }}
    >
      <div className="scan-line animate-scan" />
      <div className="relative w-full h-full bg-panel flex flex-col rounded-2xl overflow-hidden">
        {header}

        <div
          ref={scrollRef}
          className="term-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-6 py-3 sm:py-4 text-[12px] sm:text-[14px] leading-relaxed break-words"
        >
          {!booted && <BootSequence onDone={() => setBooted(true)} />}

          {booted && (
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mb-0.5"
                >
                  {l.node}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {booted && (
            <div className="relative flex items-center" dir="ltr">
              <Prompt cwd={cwd}>
                <span className="text-term">{input}</span>
                {suggestion && (
                  <span className="text-dim opacity-40">
                    {suggestion.slice(input.length)}
                  </span>
                )}
                <span className="cursor-block align-middle" />
              </Prompt>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                dir="ltr"
                type="text"
                inputMode="text"
                enterKeyHint="go"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="terminal input"
                className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-transparent border-0 outline-none p-0 m-0 select-none"
                style={{ WebkitTextFillColor: "transparent" }}
              />
            </div>
          )}
        </div>

        {/* mobile quick-commands */}
        <div className="sm:hidden border-t border-term bg-panel flex overflow-x-auto gap-2 px-3 py-2 text-xs">
          {["help", "about", "skills", "projects", "contact", "theme", "clear"].map(
            (c) => (
              <button
                key={c}
                onClick={() => {
                  execute(c);
                  setInput("");
                }}
                className="px-2 py-1 rounded border border-term text-accent whitespace-nowrap active:opacity-70"
              >
                {c}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
