import { cn } from "@/lib/utils";

const SPARKLES = [
  { top: "8%", left: "12%", size: 4, delay: "0s", dur: "2.2s" },
  { top: "15%", left: "78%", size: 3, delay: "0.4s", dur: "1.8s" },
  { top: "22%", left: "35%", size: 5, delay: "0.8s", dur: "2.5s" },
  { top: "30%", left: "92%", size: 3, delay: "1.2s", dur: "2s" },
  { top: "38%", left: "8%", size: 4, delay: "0.2s", dur: "2.8s" },
  { top: "42%", left: "62%", size: 6, delay: "1.6s", dur: "2.1s" },
  { top: "50%", left: "25%", size: 3, delay: "0.6s", dur: "1.9s" },
  { top: "55%", left: "88%", size: 5, delay: "1s", dur: "2.4s" },
  { top: "63%", left: "48%", size: 4, delay: "1.4s", dur: "2.6s" },
  { top: "68%", left: "15%", size: 3, delay: "0.3s", dur: "2s" },
  { top: "72%", left: "72%", size: 5, delay: "1.8s", dur: "2.3s" },
  { top: "80%", left: "40%", size: 4, delay: "0.9s", dur: "2.7s" },
  { top: "88%", left: "58%", size: 3, delay: "1.1s", dur: "1.7s" },
  { top: "12%", left: "50%", size: 5, delay: "2s", dur: "2.2s" },
  { top: "75%", left: "5%", size: 4, delay: "0.5s", dur: "2.5s" },
  { top: "5%", left: "65%", size: 3, delay: "1.3s", dur: "2s" },
  { top: "92%", left: "82%", size: 5, delay: "0.7s", dur: "2.8s" },
  { top: "48%", left: "95%", size: 3, delay: "1.5s", dur: "1.9s" },
];

interface SparkleFieldProps {
  className?: string;
  intense?: boolean;
}

export function SparkleField({ className, intense = false }: SparkleFieldProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "absolute rounded-full",
            intense ? "animate-sparkle-intense" : "animate-sparkle",
          )}
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
            background:
              i % 3 === 0
                ? "radial-gradient(circle, #fff8e7 0%, #e3c77a 45%, transparent 70%)"
                : "radial-gradient(circle, #ffe9a8 0%, #c9a24b 50%, transparent 75%)",
            boxShadow:
              i % 2 === 0
                ? "0 0 6px 1px rgba(255, 238, 180, 0.8)"
                : "0 0 10px 2px rgba(201, 162, 75, 0.6)",
          }}
        />
      ))}
      {/* Tia sáng chéo */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[140%] w-px -translate-x-1/2 -translate-y-1/2 animate-shimmer-ray bg-gradient-to-b from-transparent via-gold-light/25 to-transparent"
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 animate-shimmer-ray bg-gradient-to-r from-transparent via-gold-light/20 to-transparent"
        style={{ animationDelay: "0.8s" }}
      />
    </div>
  );
}
