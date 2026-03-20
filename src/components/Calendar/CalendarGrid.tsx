import { CalendarDay } from "./CalendarDay";
import type { TradeDay } from "../../models/TradeDay";
import { dateToLocalKey } from "../../utils/dateUtils";

interface CalendarGridProps {
  days: Date[];
  trade: Record<string, TradeDay>;
  onClick: (date: Date) => void;
}

export default function CalendarGrid({
  days,
  trade,
  onClick,
}: CalendarGridProps) {
  const handleDayClick = (date: Date) => {
    onClick(date);
  };

  return (
    <div className="calendar-grid">
      {days.map((day) => {
        const key = dateToLocalKey(day);

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
