"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant =
  | "fade-up"
  | "fade-scale"
  | "slide-left"
  | "slide-right"
  | "blur-up";

const VARIANT_CLASS: Record<RevealVariant, { hidden: string; show: string }> = {
  "fade-up": { hidden: "reveal-hidden", show: "reveal-show" },
  "fade-scale": { hidden: "reveal-scale-hidden", show: "reveal-scale-show" },
  "slide-left": { hidden: "reveal-slide-left-hidden", show: "reveal-slide-left-show" },
  "slide-right": { hidden: "reveal-slide-right-hidden", show: "reveal-slide-right-show" },
  "blur-up": { hidden: "reveal-blur-hidden", show: "reveal-blur-show" },
};

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  threshold = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const v = VARIANT_CLASS[variant];

  return (
    <div
      ref={ref}
      className={cn(visible ? v.show : v.hidden, className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
