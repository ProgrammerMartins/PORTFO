import type { ReactNode } from "react";

type Props = { cwd: string[]; children?: ReactNode };

export default function Prompt({ cwd, children }: Props) {
  const path = "~" + (cwd.length ? "/" + cwd.join("/") : "");
  return (
    <span>
      <span className="text-accent glow-accent">martins</span>
      <span className="text-dim">@</span>
      <span className="text-cyan glow-cyan">portfolio</span>
      <span className="text-dim"> </span>
      <span className="text-purple">{path}</span>
      <span className="text-accent"> ❯ </span>
      {children}
    </span>
  );
}
