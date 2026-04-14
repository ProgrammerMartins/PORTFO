import { motion } from "framer-motion";
import { skills } from "../../data/portfolio";

const colorMap: Record<
  string,
  { bar: string; bg: string; border: string }
> = {
  accent: {
    bar: "bg-emerald-500 dark:bg-brand",
    bg: "bg-emerald-50 dark:bg-brand/10",
    border: "border-emerald-200 dark:border-brand/20",
  },
  cyan: {
    bar: "bg-cyan-500 dark:bg-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-400/10",
    border: "border-cyan-200 dark:border-cyan-400/20",
  },
  purple: {
    bar: "bg-purple-500 dark:bg-purple-400",
    bg: "bg-purple-50 dark:bg-purple-400/10",
    border: "border-purple-200 dark:border-purple-400/20",
  },
  pink: {
    bar: "bg-pink-500 dark:bg-pink-400",
    bg: "bg-pink-50 dark:bg-pink-400/10",
    border: "border-pink-200 dark:border-pink-400/20",
  },
};

export default function Skills() {
  return (
    <section id="skills" className="section relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-300/15 dark:bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-emerald-600 dark:text-brand text-sm mb-2">
          02. Skills
        </p>
        <h2 className="section-title text-slate-900 dark:text-white">
          What I work with
        </h2>
        <p className="section-sub">
          From pixel-perfect frontends to prompt engineering &mdash; my toolkit.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        {skills.map((group, gi) => {
          const c = colorMap[group.color] ?? colorMap.accent;
          return (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.12 }}
              className={`rounded-xl sm:rounded-2xl ${c.bg} border ${c.border} p-5 sm:p-6 shadow-sm dark:shadow-none transition-shadow`}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl">{group.icon}</span>
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-700 dark:text-slate-300 text-sm">
                        {item.name}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">
                        {item.level}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-surface-300/40 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: gi * 0.1 + 0.3,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full ${c.bar}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
