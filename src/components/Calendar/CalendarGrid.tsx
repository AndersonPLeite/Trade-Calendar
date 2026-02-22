import type { TradeDay } from '../../models/TradeDay';
import { CalendarDay } from './CalendarDay';

interface CalendarGridProps {
  days: (Date | null)[];
  trade: Record<string, TradeDay>;
  onClick: (date: Date) => void;
}

export default function CalendarGrid({ days, trade, onClick }: CalendarGridProps) {
  return (
    <div className="calendar-grid">
      {days.map((day, index) => {
        if (!day) {
          return <div key={index} className="day" />;
        }

        const formatted = day.toISOString().split("T")[0];
        const tradeData = trade[formatted];

        return <CalendarDay key={formatted} day={day} trade={tradeData} onClick={onClick} />;
      })}
    </div>
  );
}
