import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import { TradeModal } from "./TradeModal";
import { useTradeCalendar } from "../../hooks/useTradeCalendar";
import "./calendar.css";

export function Calendar() {
  const { trades, addTrade, removeTrade } = useTradeCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const now = new Date();

  const getBusinessDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days: Date[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      const weekday = day.getDay();
      if (weekday !== 0 && weekday !== 6) {
        days.push(day);
      }
    }

    return days;
  };

  const days = getBusinessDaysInMonth(now);

  const getWeekIndexInMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstWeekdayMondayStart = (firstDay.getDay() + 6) % 7;
    const dayOffset = date.getDate() - 1;
    return Math.floor((firstWeekdayMondayStart + dayOffset) / 7) + 1;
  };

  const maxWeekInMonth = days.length
    ? Math.max(...days.map(getWeekIndexInMonth))
    : 0;

  const weeklyStats = Array.from({ length: maxWeekInMonth }, (_, i) => ({
    week: i + 1,
    result: 0,
    trades: 0,
  }));

  Object.values(trades).forEach((trade) => {
    const tradeDate = new Date(trade.date);
    if (
      tradeDate.getFullYear() !== now.getFullYear() ||
      tradeDate.getMonth() !== now.getMonth()
    ) {
      return;
    }

    const weekIndex = getWeekIndexInMonth(tradeDate) - 1;
    if (!weeklyStats[weekIndex]) return;
    weeklyStats[weekIndex].result += trade.result;
    weeklyStats[weekIndex].trades += trade.trades;
  });

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

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
        <div className="calendar-main">
          <div className="weekdays">  
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
          </div>

          <CalendarGrid
            days={days}
            trade={trades}
            onClick={(date: Date) => setSelectedDate(date)}
          />
        </div>

        <div className="sidebar">
          {weeklyStats.map((week) => (
            <div className="week-card" key={week.week}>
              <h4>Week {week.week}</h4>
              <div
                className={
                  week.result > 0
                    ? "week-profit"
                    : week.result < 0
                    ? "week-loss"
                    : "week-neutral"
                }
              >
                {formatCurrency(week.result)}
              </div>
              <div className="week-trades">{week.trades} trades</div>
            </div>
          ))}
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
