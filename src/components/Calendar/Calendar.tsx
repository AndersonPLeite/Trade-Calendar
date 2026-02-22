import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import { TradeModal } from "./TradeModal";
import { useTradeCalendar } from "../../hooks/useTradeCalendar";
import "./calendar.css";

export function Calendar() {
  const { trades, addTrade, removeTrade } = useTradeCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const now = new Date();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(now);

  function handleSaveTrade(date: Date, result: number, tradesQty: number) {
    addTrade(date, result, tradesQty);
    setSelectedDate(null);
  }

  function handleDeleteTrade(date: Date) {
    removeTrade(date);
    setSelectedDate(null);
  }

  const selectedKey = selectedDate?.toISOString().split("T")[0];
  const selectedTrade = selectedKey ? trades[selectedKey] : undefined;

  return (
    <div>
      <div className="month-header">
        <div className="month-title">
          {now
            .toLocaleString("pt-BR", { month: "long" })
            .charAt(0)
            .toUpperCase() +
            now.toLocaleString("pt-BR", { month: "long" }).slice(1)}{" "}
          {now.getFullYear()}
        </div>

        <div className="month-stats">Estatísticas do mês</div>
      </div>

      <div className="calendar-wrapper">
        <div>
          <div className="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <CalendarGrid
            days={days}
            trade={trades}
            onClick={(date: Date) => setSelectedDate(date)}
          />
        </div>

        <div className="sidebar">
          <div className="week-card">
            <h4>Week 1</h4>
            <div className="week-profit">$830</div>
          </div>

          <div className="week-card">
            <h4>Week 2</h4>
            <div className="week-profit">$1.46K</div>
          </div>

          <div className="week-card">
            <h4>Week 3</h4>
            <div className="week-profit">$1.44K</div>
          </div>

          <div className="week-card">
            <h4>Week 4</h4>
            <div className="week-loss">-$1.01K</div>
          </div>
        </div>
      </div>

      {selectedDate && (
        <TradeModal
          date={selectedDate}
          trade={selectedTrade}
          onSave={handleSaveTrade}
          onDelete={handleDeleteTrade}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
