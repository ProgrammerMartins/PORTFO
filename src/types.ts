import type { ReactNode } from "react";

export type Theme = "dark" | "neon" | "matrix";

export type TerminalLine = {
  id: number;
  node: ReactNode;
  /** If true, the line is animated with the typewriter effect on mount. */
  typed?: boolean;
};

export type CommandContext = {
  setTheme: (t: Theme) => void;
  theme: Theme;
  clear: () => void;
  cwd: string[];
  setCwd: (path: string[]) => void;
  print: (node: ReactNode, typed?: boolean) => void;
  runCommand: (cmd: string) => void;
};

export type CommandResult = ReactNode | ReactNode[] | null | void;
