import { CalendarDay } from './CalendarDay';

interface CalendarGridProps {
  days: (Date | null)[];
  trade: any[];
}

export default function CalendarGrid({ days, trade }: CalendarGridProps) {
  return (
    <>
      {days.map((day, index) => {
    if (!day) {
      return <div key={index} className="day" />;
    }

    const formatted = day.toISOString().split("T")[0];
    const tradeData = trade.find((t) => t.date === formatted);

        return <CalendarDay key={formatted} day={day} trade={tradeData} />;
      })}
    </>
  );
}
