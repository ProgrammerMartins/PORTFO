import { useCallback, useEffect, useState } from "react";

export type SiteTheme = "light" | "dark";

const STORAGE_KEY = "martins.site-theme";

function resolveInitial(): SiteTheme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY) as SiteTheme | null;
  if (saved === "light" || saved === "dark") return saved;
  // default = dark (brand identity)
  return "dark";
}

export function applyTheme(t: SiteTheme) {
  const root = document.documentElement;
  if (t === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.setAttribute("data-site-theme", t);
}

export function useSiteTheme() {
  const [theme, setTheme] = useState<SiteTheme>(() => resolveInitial());

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, setTheme, toggle };
}
