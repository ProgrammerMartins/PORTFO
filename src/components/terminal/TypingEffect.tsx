import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
};

/**
 * Character-by-character typewriter for plain strings.
 * Used inside the boot sequence; command output uses a different,
 * chunked reveal to keep layout and animation in sync.
 */
export default function TypingEffect({
  text,
  speed = 18,
  className,
  onDone,
}: Props) {
  const [i, setI] = useState(0);

  // Reset on text change so parents can reuse the same instance safely.
  useEffect(() => {
    setI(0);
  }, [text]);

  useEffect(() => {
    if (i >= text.length) {
      if (i > 0) onDone?.();
      return;
    }
    const jitter = speed + Math.random() * 12;
    const t = setTimeout(() => setI((v) => v + 1), jitter);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, text, speed]);

  return (
    <span className={className}>
      {text.slice(0, i)}
      {i < text.length && <span className="text-accent animate-blink">▌</span>}
    </span>
  );
}
