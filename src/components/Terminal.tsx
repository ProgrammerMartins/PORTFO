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
import { commandNames, runCommand } from "../lib/CommandHandler";
import type { TerminalLine, Theme } from "../types";

const STORAGE_THEME = "martins.theme";

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
  const lineId = useRef(0);

  /* ---------- theme bootstrapping ---------- */
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_THEME) as Theme) || "dark";
    setThemeState(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem(STORAGE_THEME, t);
  }, []);

  /* ---------- scrolling ---------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, booted]);

  /* ---------- focus management ---------- */
  useEffect(() => {
    const handler = () => inputRef.current?.focus();
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
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

      // Echo the prompt + command the user typed
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
      if (node) pushLine(<div className="pl-0 py-1">{node}</div>, true);

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
    // Ctrl+L → clear
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
        historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
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
            session established · {new Date().toLocaleString()}
          </div>
          <div className="text-dim">
            type <span className="text-accent glow-accent">help</span> to see
            available commands · try{" "}
            <span className="text-accent">about</span>,{" "}
            <span className="text-accent">skills</span>,{" "}
            <span className="text-accent">projects</span>
          </div>
        </div>,
      );
    }
  }, [booted, pushLine]);

  /* ---------- header ---------- */
  const header = useMemo(
    () => (
      <div className="flex items-center justify-between px-4 py-2 border-b border-term bg-panel backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
        </div>
        <div className="text-dim text-xs sm:text-sm tracking-wider">
          martins@portfolio — zsh — {cwd.length ? "~/" + cwd.join("/") : "~"}
        </div>
        <div className="text-dim text-xs hidden sm:block">
          theme:{" "}
          <span className="text-accent glow-accent">{theme}</span>
        </div>
      </div>
    ),
    [cwd, theme],
  );

  return (
    <div className="crt h-full w-full p-2 sm:p-6 flex items-stretch justify-center">
      <div className="scan-line animate-scan" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-5xl h-full bg-panel border border-term rounded-xl shadow-glow-strong overflow-hidden flex flex-col"
      >
        {header}

        <div
          ref={scrollRef}
          className="term-scroll flex-1 overflow-y-auto px-4 sm:px-6 py-4 text-[13px] sm:text-[14px] leading-relaxed"
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
            <div className="flex items-center">
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
                className="caret-hidden absolute opacity-0 w-0 h-0"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="terminal input"
              />
            </div>
          )}
        </div>

        {/* mobile quick-commands bar */}
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
      </motion.div>
    </div>
  );
}
