import type { WeddingDate } from "@/types/wedding";

export function DateDisplay({ date }: { date: WeddingDate }) {
  return (
    <div>
      <div className="date-display">
        <span className="date-display__side">{date.weekday}</span>
        <span className="date-display__divider" />
        <span className="date-display__day">{date.day}</span>
        <span className="date-display__divider" />
        <span className="date-display__side date-display__side--right">
          Tháng {date.month}
        </span>
      </div>
      <p className="mt-2 font-display text-xl text-crimson">{date.year}</p>
      {date.lunar && (
        <p className="mt-1 font-serif text-sm text-ink/60">({date.lunar})</p>
      )}
    </div>
  );
}
