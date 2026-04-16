import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { answer, suggestedQuestions } from "../../lib/aiSearch";

type Msg = {
  id: number;
  role: "user" | "ai";
  text: string;
  typing?: boolean;
};

let idSeq = 0;
const nextId = () => ++idSeq;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: nextId(),
          role: "ai",
          text: "hey — i'm a tiny AI trained on Martins' portfolio. ask me anything about his work, stack, or projects.",
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const userMsg: Msg = { id: nextId(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);

    // simulate "thinking"
    setTimeout(() => {
      const reply = answer(text);
      setMessages((m) => [...m, { id: nextId(), role: "ai", text: reply, typing: true }]);
      setBusy(false);
    }, 350 + Math.random() * 300);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed z-[90] bottom-20 right-4 sm:right-6 w-[min(380px,calc(100vw-2rem))] h-[min(560px,70vh)] flex flex-col bg-white dark:bg-surface-50 border border-slate-200 dark:border-surface-300/50 rounded-2xl shadow-2xl dark:shadow-glow-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-surface-300/40 bg-slate-50 dark:bg-surface-100/60">
              <div className="flex items-center gap-2.5">
                <span className="relative flex">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-brand" />
                  <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-brand animate-ping opacity-70" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                    ask martins.ai
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    trained on this portfolio
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="close chat"
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm"
            >
              {messages.map((m) => (
                <Bubble key={m.id} msg={m} />
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-surface-100/70 text-slate-500 flex gap-1">
                    <Dot delay={0} />
                    <Dot delay={0.15} />
                    <Dot delay={0.3} />
                  </div>
                </div>
              )}
              {messages.length === 1 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-full border border-slate-200 dark:border-surface-300/50 text-slate-600 dark:text-slate-400 hover:border-emerald-500/50 dark:hover:border-brand/50 hover:text-emerald-600 dark:hover:text-brand transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 px-3 py-3 border-t border-slate-200 dark:border-surface-300/40 bg-slate-50 dark:bg-surface-100/60"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ask anything about martins…"
                className="flex-1 bg-white dark:bg-surface text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-surface-300/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 dark:focus:border-brand/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                className="px-3 py-2 rounded-lg bg-emerald-500 dark:bg-brand text-white dark:text-surface text-sm font-semibold disabled:opacity-40 hover:bg-emerald-600 dark:hover:bg-brand-500 transition-colors"
              >
                send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "close AI chat" : "open AI chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-[91] bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 rounded-full bg-emerald-500 dark:bg-brand text-white dark:text-surface shadow-lg shadow-emerald-500/30 dark:shadow-glow flex items-center justify-center text-2xl"
      >
        {open ? "×" : "✦"}
      </motion.button>
    </>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const [shown, setShown] = useState(msg.typing ? "" : msg.text);

  useEffect(() => {
    if (!msg.typing) return;
    let i = 0;
    const speed = Math.max(6, Math.min(18, 600 / msg.text.length));
    const id = setInterval(() => {
      i += 1;
      setShown(msg.text.slice(0, i));
      if (i >= msg.text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [msg.text, msg.typing]);

  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
          isUser
            ? "bg-emerald-500 dark:bg-brand text-white dark:text-surface rounded-br-sm"
            : "bg-slate-100 dark:bg-surface-100/70 text-slate-800 dark:text-slate-200 rounded-bl-sm"
        }`}
      >
        {shown}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full bg-current inline-block"
      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}
