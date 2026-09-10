"use client";

import { cn } from "@/lib/utils";

export function DoubleHappiness({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("select-none font-serif leading-none text-gold/30", className)}
    >
      囍
    </span>
  );
}

const STREAM_COUNT = 16;
const BASE_DURATION = 14;

const SIZES = ["text-xl", "text-2xl", "text-3xl", "text-4xl"] as const;
const GLOWS = ["hy-glow-sm", "hy-glow-md", "hy-glow-lg"] as const;

const STREAM_ITEMS = Array.from({ length: STREAM_COUNT }, (_, i) => {
  const duration = BASE_DURATION + (i % 4) * 1.5;
  return {
    left: `${6 + ((i * 23 + 13) % 82)}%`,
    size: SIZES[i % SIZES.length],
    glow: GLOWS[i % GLOWS.length],
    delay: (i / STREAM_COUNT) * duration,
    duration,
  };
});

interface DoubleHappinessFieldProps {
  className?: string;
  active?: boolean;

  isOpening?: boolean;
}

export function DoubleHappinessField({
  className,
  active = true,
  isOpening = false,
}: DoubleHappinessFieldProps) {
  if (!active || isOpening) return null;

  return (
    <div
      className={cn(
        "hy-stream-field pointer-events-none absolute inset-0",
        className,
      )}
    >
      {STREAM_ITEMS.map((it, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "hy-stream-char absolute bottom-0 select-none font-serif text-gold/90 will-change-transform",
            it.size,
            it.glow,
          )}
          style={{
            left: it.left,
            ["--hy-dur" as string]: `${it.duration}s`,
            ["--hy-delay" as string]: `${it.delay}s`,
          }}
        >
          囍
        </span>
      ))}
    </div>
  );
}
