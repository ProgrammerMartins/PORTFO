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
      {/* Background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-5 max-w-4xl">
        <motion.div {...fadeUp(0.3)}>
          <span className="inline-block font-mono text-brand text-sm sm:text-base tracking-widest mb-6 px-4 py-1.5 rounded-full border border-brand/20 bg-brand/5">
            &gt; hello world
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.5)}
          className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-white">I'm </span>
          <span
            className="text-brand"
            style={{ textShadow: "0 0 40px rgba(0,255,156,0.35)" }}
          >
            {identity.name.split(" ").slice(-1)[0]}
          </span>
          <span className="text-white">.</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.7)}
          className="text-lg sm:text-xl lg:text-2xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed"
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
            className="group px-8 py-3.5 bg-brand text-surface font-semibold rounded-lg hover:bg-brand-500 transition-all shadow-glow hover:shadow-glow-strong text-sm sm:text-base"
          >
            View my work
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </a>
          <a
            href="#terminal"
            className="px-8 py-3.5 border border-surface-300 text-slate-300 rounded-lg hover:border-brand/50 hover:text-brand transition-all text-sm sm:text-base font-mono"
          >
            &gt; open terminal_
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-9 rounded-full border-2 border-surface-400 flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
