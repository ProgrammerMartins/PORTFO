import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Project } from "../../data/portfolio";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function CaseStudyModal({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && project.caseStudy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-white dark:bg-surface-50 border border-slate-200 dark:border-surface-300/50 rounded-t-2xl sm:rounded-2xl shadow-2xl dark:shadow-glow-card"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 bg-white/95 dark:bg-surface-50/95 backdrop-blur border-b border-slate-200 dark:border-surface-300/40">
              <div>
                <span className="font-mono text-xs text-slate-500">
                  case study · #{project.id}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {project.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="close case study"
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-surface-300/50 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-brand hover:border-emerald-400/60 dark:hover:border-brand/40 transition-colors flex items-center justify-center text-lg"
              >
                ×
              </button>
            </div>

            <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-8">
              <section>
                <h3 className="font-mono text-emerald-600 dark:text-brand text-xs mb-2">
                  01. The problem
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.caseStudy.problem}
                </p>
              </section>

              <section>
                <h3 className="font-mono text-emerald-600 dark:text-brand text-xs mb-3">
                  02. Approach
                </h3>
                <ol className="space-y-2">
                  {project.caseStudy.approach.map((a, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-1 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h3 className="font-mono text-emerald-600 dark:text-brand text-xs mb-3">
                  03. Key decisions & tradeoffs
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {project.caseStudy.decisions.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-200 dark:border-surface-300/40 bg-slate-50 dark:bg-surface-100/50 p-4"
                    >
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                        {d.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {d.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-mono text-emerald-600 dark:text-brand text-xs mb-3">
                  04. Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.caseStudy.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-lg border border-slate-200 dark:border-surface-300/40 bg-slate-50 dark:bg-surface-100/50 p-4 text-center"
                    >
                      <div className="text-xl font-bold text-emerald-600 dark:text-brand font-mono">
                        {m.value}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-mono text-emerald-600 dark:text-brand text-xs mb-3">
                  05. Stack notes
                </h3>
                <ul className="space-y-2.5">
                  {project.caseStudy.stackNotes.map((s) => (
                    <li
                      key={s.label}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
                    >
                      <span className="font-mono text-sm text-slate-900 dark:text-white sm:w-48 shrink-0">
                        {s.label}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {s.why}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
