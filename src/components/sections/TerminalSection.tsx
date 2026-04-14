import { motion } from "framer-motion";
import Terminal from "../terminal/Terminal";

export default function TerminalSection() {
  return (
    <section id="terminal" className="section relative overflow-hidden">
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-emerald-300/10 dark:bg-brand/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <p className="font-mono text-emerald-600 dark:text-brand text-sm mb-2">
          05. Terminal
        </p>
        <h2 className="section-title text-slate-900 dark:text-white">
          Talk to my portfolio
        </h2>
        <p className="section-sub">
          An interactive CLI &mdash; type{" "}
          <code className="text-emerald-700 dark:text-brand font-mono bg-emerald-100 dark:bg-brand/10 px-1.5 py-0.5 rounded text-sm">
            help
          </code>{" "}
          to get started. Try{" "}
          <code className="text-emerald-700 dark:text-brand font-mono bg-emerald-100 dark:bg-brand/10 px-1.5 py-0.5 rounded text-sm">
            secret
          </code>{" "}
          if you're feeling curious.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <Terminal />
      </motion.div>
    </section>
  );
}
