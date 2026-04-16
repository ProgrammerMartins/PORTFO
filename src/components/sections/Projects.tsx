import { useState } from "react";
import { motion } from "framer-motion";
import { projects, type Project } from "../../data/portfolio";
import CaseStudyModal from "../projects/CaseStudyModal";

const statusColor: Record<string, string> = {
  shipped:
    "text-emerald-700 dark:text-brand bg-emerald-100 dark:bg-brand/10 border-emerald-200 dark:border-brand/25",
  building:
    "text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-400/10 border-cyan-200 dark:border-cyan-400/25",
  prototype:
    "text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-400/10 border-purple-200 dark:border-purple-400/25",
};

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  return (
    <section id="projects" className="section relative overflow-hidden">
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-300/15 dark:bg-brand/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-emerald-600 dark:text-brand text-sm mb-2">
          03. Projects
        </p>
        <h2 className="section-title text-slate-900 dark:text-white">
          Things I've built
        </h2>
        <p className="section-sub">
          Real products, real users. From AI notebooks to component libraries.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group rounded-xl sm:rounded-2xl bg-white dark:bg-surface-100/60 border border-slate-200 dark:border-surface-300/40 p-5 sm:p-6 lg:p-8 hover:border-emerald-500/40 dark:hover:border-brand/30 hover:shadow-lg dark:hover:shadow-glow-card shadow-sm dark:shadow-none transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-slate-500 text-xs">
                  #{p.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-brand transition-colors">
                  {p.name}
                </h3>
              </div>
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-full border ${statusColor[p.status]}`}
              >
                {p.status}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
              {p.summary}
            </p>

            <ul className="space-y-1.5 mb-5">
              {p.highlights.map((h, hi) => (
                <li
                  key={hi}
                  className="text-slate-600 dark:text-slate-500 text-sm flex items-start gap-2"
                >
                  <span className="text-emerald-500 dark:text-brand mt-0.5 shrink-0">
                    &#9656;
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-surface-300/30 text-slate-600 dark:text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>

            {p.caseStudy && (
              <button
                onClick={() => setActive(p)}
                className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-brand hover:gap-2.5 transition-all"
              >
                Read case study <span aria-hidden>&rarr;</span>
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <CaseStudyModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
