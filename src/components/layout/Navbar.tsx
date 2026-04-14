import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSiteTheme } from "../../lib/useSiteTheme";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Terminal", href: "#terminal" },
  { label: "Contact", href: "#contact" },
];

function ThemeToggle() {
  const { theme, toggle } = useSiteTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={`switch to ${isDark ? "light" : "dark"} mode`}
      className="relative w-14 h-7 rounded-full border border-slate-300 dark:border-surface-300 bg-slate-100 dark:bg-surface-100 transition-colors"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-[2px] ${
          isDark ? "right-[2px]" : "left-[2px]"
        } w-[22px] h-[22px] rounded-full bg-white dark:bg-brand shadow flex items-center justify-center text-[10px]`}
      >
        {isDark ? "🌙" : "☀"}
      </motion.span>
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-surface/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-surface-300/50 shadow-sm dark:shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a
          href="#hero"
          className="font-mono text-emerald-600 dark:text-brand font-bold text-lg tracking-tight"
        >
          {"<"}martins{" />"}
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-brand text-sm font-medium transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile toggle + menu */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-[5px] w-7"
            aria-label="toggle menu"
          >
            <span
              className={`block h-[2px] bg-slate-800 dark:bg-slate-300 transition-all duration-300 ${
                open ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block h-[2px] bg-slate-800 dark:bg-slate-300 transition-all duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] bg-slate-800 dark:bg-slate-300 transition-all duration-300 ${
                open ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 dark:bg-surface-50/95 backdrop-blur-lg border-b border-slate-200 dark:border-surface-300/50"
        >
          <div className="flex flex-col px-5 py-4 gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-brand text-sm font-medium py-2 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
