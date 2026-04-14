import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** ms per character — lower is faster */
  cps?: number;
  onDone?: () => void;
};

/**
 * Progressive reveal of any ReactNode — looks like the terminal is
 * printing/typing the output, regardless of how complex the JSX is.
 *
 * Strategy:
 *   1. Render children off-screen for one frame to measure height + text length.
 *   2. Animate container height 0 → measured, with overflow clipped.
 *   3. Duration scales with character count, so long outputs "type" longer.
 *   4. A block cursor blinks at the bottom while revealing, then vanishes.
 */
export default function TypedOutput({ children, cps = 220, onDone }: Props) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<{ h: number; chars: number } | null>(
    null,
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!measureRef.current || metrics) return;
    const h = measureRef.current.offsetHeight;
    const chars = (measureRef.current.innerText || "").length;
    setMetrics({ h, chars });
  }, [metrics]);

  if (!metrics) {
    return (
      <div
        ref={measureRef}
        style={{
          visibility: "hidden",
          position: "absolute",
          left: 0,
          right: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        {children}
      </div>
    );
  }

  // duration: chars / cps, clamped between 0.2s and 1.6s
  const duration = Math.min(1.6, Math.max(0.2, metrics.chars / cps));

  return (
    <div className="relative">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: metrics.h }}
        transition={{ duration, ease: "linear" }}
        onAnimationComplete={() => {
          setDone(true);
          onDone?.();
        }}
        style={{ overflow: "hidden" }}
      >
        {children}
      </motion.div>
      {!done && (
        <span
          aria-hidden
          className="inline-block w-[9px] h-[16px] align-middle ml-1 mt-1"
          style={{
            background: "var(--term-accent)",
            boxShadow: "0 0 10px var(--term-accent)",
            animation: "blink 1s steps(1) infinite",
          }}
        />
      )}
    </div>
  );
}
