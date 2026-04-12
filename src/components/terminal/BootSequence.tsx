import { useEffect, useState } from "react";
import TypingEffect from "./TypingEffect";
import { asciiName } from "../../data/portfolio";

type Props = { onDone: () => void };

const steps = [
  "booting martins-os v4.6.2 ...",
  "mounting /home/martins ......... [ OK ]",
  "loading frontend modules ....... [ OK ]",
  "loading ai subsystems .......... [ OK ]",
  "initializing prompt engine ..... [ OK ]",
  "verifying coffee supply ........ [ OK ]",
  "establishing secure channel .... [ OK ]",
  "launching portfolio shell ...... [ OK ]",
];

export default function BootSequence({ onDone }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showName, setShowName] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (stepIndex >= steps.length) {
      const t = setTimeout(() => setShowName(true), 180);
      return () => clearTimeout(t);
    }
  }, [stepIndex]);

  useEffect(() => {
    if (!showName) return;
    const t = setTimeout(() => setDone(true), 750);
    return () => clearTimeout(t);
  }, [showName]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onDone, 220);
      return () => clearTimeout(t);
    }
  }, [done, onDone]);

  return (
    <div className="font-mono text-[13px] sm:text-sm">
      {steps.slice(0, stepIndex).map((s, i) => (
        <div key={i} className="text-dim">
          <span className="text-accent">›</span>{" "}
          <span>{s.replace("[ OK ]", "")}</span>
          <span className="text-accent glow-accent">[ OK ]</span>
        </div>
      ))}
      {stepIndex < steps.length && (
        <div className="text-dim">
          <span className="text-accent">›</span>{" "}
          <TypingEffect
            text={steps[stepIndex].replace("[ OK ]", "")}
            speed={10}
            onDone={() => setStepIndex((i) => i + 1)}
          />
        </div>
      )}
      {showName && (
        <div className="mt-4">
          <pre className="ascii text-accent glow-accent animate-flicker">
            {asciiName}
          </pre>
          <div className="text-cyan glow-cyan mt-2">
            welcome, visitor. type{" "}
            <span className="text-accent">help</span> to begin.
          </div>
        </div>
      )}
    </div>
  );
}
