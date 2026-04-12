import { motion } from "framer-motion";
import { skills } from "../../data/portfolio";

const colorMap: Record<string, { bar: string; bg: string; border: string; glow: string }> = {
  accent: {
    bar: "bg-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
    glow: "shadow-[0_0_20px_rgba(0,255,156,0.2)]",
  },
  cyan: {
    bar: "bg-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.2)]",
  },
  purple: {
    bar: "bg-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.2)]",
  },
  pink: {
    bar: "bg-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    glow: "shadow-[0_0_20px_rgba(244,114,182,0.2)]",
  },
};

export default function Skills() {
  return (
    <section id="skills" className="section relative">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-brand text-sm mb-2">02. Skills</p>
        <h2 className="section-title text-white">What I work with</h2>
        <p className="section-sub">
          From pixel-perfect frontends to prompt engineering — my toolkit.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {skills.map((group, gi) => {
          const c = colorMap[group.color] ?? colorMap.accent;
          return (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: gi * 0.12 }}
              className={`rounded-2xl ${c.bg} border ${c.border} p-6 hover:${c.glow} transition-shadow`}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl">{group.icon}</span>
                <h3 className="text-white font-semibold text-lg">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-300 text-sm">
                        {item.name}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">
                        {item.level}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-300/40 overflow-hidden">
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
