import { CalendarDay } from './CalendarDay';
import type { TradeDay } from '../../models/TradeDay';

interface CalendarGridProps {
  days: Date[];
  trade: Record<string, TradeDay>;
  onClick: (date: Date) => void;
}

export default function CalendarGrid({ days, trade, onClick }: CalendarGridProps) {
  const handleDayClick = (date: Date) => {
    onClick(date);
  };

  return (
    <div className="calendar-grid">
      {days
        .map((day) => {
          const key = day.toISOString().split("T")[0];

          return (
            <CalendarDay
              key={key}
              day={day}
              trade={trade[key]}
              onClick={handleDayClick}
            />
          );
        })}
    </div>
  );
}
