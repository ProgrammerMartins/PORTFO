import { motion } from "framer-motion";
import { experience } from "../../data/portfolio";

export default function Experience() {
  return (
    <section id="experience" className="section relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-emerald-600 dark:text-brand text-sm mb-2">
          04. Experience
        </p>
        <h2 className="section-title text-slate-900 dark:text-white">
          The journey so far
        </h2>
        <p className="section-sub">
          Every step was intentional. Here's the road.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-px bg-slate-200 dark:bg-surface-300/50" />

        <div className="space-y-10">
          {experience.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-12 sm:pl-14"
            >
              <div className="absolute left-[11px] sm:left-[15px] top-1.5 w-[9px] h-[9px] rounded-full bg-emerald-500 dark:bg-brand dark:shadow-[0_0_12px_rgba(0,255,156,0.5)]" />

              <div className="font-mono text-emerald-600 dark:text-brand text-sm mb-1">
                {e.when}
              </div>
              <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-1">
                {e.what}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {e.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
