import { cn } from "@/lib/utils";

export function SectionBand({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("section-band w-full py-4 sm:py-5", className)}>
      <h2 className="font-serif font-semibold leading-snug">{title}</h2>
    </div>
  );
}
