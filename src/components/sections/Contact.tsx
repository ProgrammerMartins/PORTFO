import { motion } from "framer-motion";
import { contact, identity } from "../../data/portfolio";

export default function Contact() {
  return (
    <section id="contact" className="section relative text-center overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-300/15 dark:bg-brand/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <p className="font-mono text-emerald-600 dark:text-brand text-sm mb-2">
          06. Contact
        </p>
        <h2 className="section-title text-slate-900 dark:text-white mx-auto">
          Let's build something
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          I'm always open to interesting projects, freelance work, or just a
          conversation about the frontier of AI and interfaces. Let's talk.
        </p>

        <a
          href={`mailto:${contact.email}`}
          className="inline-block px-10 py-4 bg-emerald-500 dark:bg-brand text-white dark:text-surface font-semibold rounded-lg hover:bg-emerald-600 dark:hover:bg-brand-500 transition-all shadow-lg shadow-emerald-500/20 dark:shadow-glow dark:hover:shadow-glow-strong text-sm sm:text-base"
        >
          Say hello &rarr;
        </a>

        <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-5 sm:gap-10 text-sm">
          {[
            {
              label: "Email",
              value: contact.email,
              href: `mailto:${contact.email}`,
            },
            {
              label: "GitHub",
              value: contact.github,
              href: `https://${contact.github}`,
            },
            {
              label: "Twitter",
              value: contact.twitter,
              href: `https://x.com/${contact.twitter.replace("@", "")}`,
            },
            {
              label: "LinkedIn",
              value: contact.linkedin,
              href: `https://${contact.linkedin}`,
            },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1"
            >
              <span className="text-slate-500 text-xs font-mono">
                {c.label}
              </span>
              <span className="text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-brand transition-colors text-xs sm:text-sm break-all text-center">
                {c.value}
              </span>
            </a>
          ))}
        </div>

        <p className="mt-16 text-slate-500 dark:text-slate-600 text-xs font-mono">
          {identity.name} &middot; {new Date().getFullYear()} &middot; built
          from scratch with React + TypeScript + Tailwind
        </p>
      </motion.div>
    </section>
  );
}
