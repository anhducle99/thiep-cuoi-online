"use client";

import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/calendar";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function HeartDay({ day }: { day: number }) {
  return (
    <span className="calendar-heart-day">
      <svg
        viewBox="0 0 24 22"
        className="calendar-heart-day__shape"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <span className="calendar-heart-day__num">{day}</span>
    </span>
  );
}

export function MonthCalendar({
  year,
  month,
  highlightDay,
}: {
  year: number;
  month: number;
  highlightDay: number;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="calendar-card">
      <p className="calendar-card__title">
        Tháng {month} / {year}
      </p>
      <div className="calendar-card__divider" aria-hidden />

      <div className="calendar-card__grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="calendar-card__weekday">
            {d}
          </span>
        ))}
        {cells.map((day, i) => (
          <span key={i} className="calendar-card__cell">
            {day === highlightDay ? (
              <HeartDay day={day} />
            ) : (
              day
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
