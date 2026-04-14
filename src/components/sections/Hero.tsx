import { motion } from "framer-motion";
import { identity } from "../../data/portfolio";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-300/20 dark:bg-brand/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-300/15 dark:bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-5 max-w-4xl">
        <motion.div {...fadeUp(0.3)}>
          <span className="inline-block font-mono text-emerald-600 dark:text-brand text-sm sm:text-base tracking-widest mb-6 px-4 py-1.5 rounded-full border border-emerald-500/30 dark:border-brand/20 bg-emerald-50 dark:bg-brand/5">
            &gt; hello world
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.5)}
          className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-slate-900 dark:text-white">I'm </span>
          <span
            className="text-emerald-600 dark:text-brand dark:glow-accent"
          >
            {identity.name.split(" ").slice(-1)[0]}
          </span>
          <span className="text-slate-900 dark:text-white">.</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.7)}
          className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          {identity.role}
        </motion.p>

        <motion.p
          {...fadeUp(0.85)}
          className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto mb-10 italic"
        >
          "{identity.tagline}"
        </motion.p>

        <motion.div
          {...fadeUp(1)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group px-8 py-3.5 bg-emerald-500 dark:bg-brand text-white dark:text-surface font-semibold rounded-lg hover:bg-emerald-600 dark:hover:bg-brand-500 transition-all shadow-lg shadow-emerald-500/20 dark:shadow-glow dark:hover:shadow-glow-strong text-sm sm:text-base"
          >
            View my work
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </a>
          <a
            href="#terminal"
            className="px-8 py-3.5 border border-slate-300 dark:border-surface-300 text-slate-700 dark:text-slate-300 rounded-lg hover:border-emerald-500/60 dark:hover:border-brand/50 hover:text-emerald-600 dark:hover:text-brand transition-all text-sm sm:text-base font-mono"
          >
            &gt; open terminal_
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-9 rounded-full border-2 border-slate-300 dark:border-surface-400 flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-500 dark:bg-brand rounded-full mt-1.5"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
