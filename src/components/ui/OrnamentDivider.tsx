export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={`my-4 flex items-center justify-center gap-3 ${className ?? ""}`}>
      <span className="h-px w-16 bg-cream-btn/60" />
      <span className="font-serif text-lg text-cream-btn/80">❦</span>
      <span className="h-px w-16 bg-cream-btn/60" />
    </div>
  );
}
