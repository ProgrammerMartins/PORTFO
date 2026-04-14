import { motion } from "framer-motion";
import { about, identity, stats } from "../../data/portfolio";

const statItems = [
  { label: "Years Coding", value: stats.yearsCoding + "+" },
  { label: "Projects", value: String(stats.projectsShipped) },
  { label: "Lines of Code", value: stats.linesOfCode },
  { label: "Coffees", value: stats.coffees },
];

export default function About() {
  return (
    <section id="about" className="section relative">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-300/15 dark:bg-purple-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-emerald-600 dark:text-brand text-sm mb-2">
          01. About
        </p>
        <h2 className="section-title text-slate-900 dark:text-white">
          Who is{" "}
          <span className="text-emerald-600 dark:text-brand dark:glow-accent">
            {identity.name}
          </span>
          ?
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-3 space-y-4"
        >
          {about.map((line, i) =>
            line ? (
              <p
                key={i}
                className="text-slate-700 dark:text-slate-400 leading-relaxed text-base sm:text-lg"
              >
                {line}
              </p>
            ) : null,
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 grid grid-cols-2 gap-4"
        >
          {statItems.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-white dark:bg-surface-100/60 border border-slate-200 dark:border-surface-300/40 p-5 text-center hover:border-emerald-500/40 dark:hover:border-brand/30 transition-colors shadow-sm dark:shadow-none"
            >
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-brand font-mono dark:glow-accent">
                {s.value}
              </div>
              <div className="text-slate-500 text-xs sm:text-sm mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
