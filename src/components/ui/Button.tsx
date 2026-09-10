import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
};

export function Button({
  variant = "solid",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium uppercase tracking-wider transition-colors disabled:opacity-50";
  const variants = {
    solid: "bg-wine text-cream-light hover:bg-wine-dark",
    outline: "border border-gold text-crimson hover:bg-gold/10",
    ghost: "text-crimson hover:bg-gold/10",
  } as const;

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
