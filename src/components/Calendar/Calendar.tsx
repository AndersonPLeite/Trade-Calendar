import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import { TradeModal } from "./TradeModal";
import { useTradeCalendar } from "../../hooks/useTradeCalendar";
import { dateToLocalKey, parseLocalKeyToDate } from "../../utils/dateUtils";
import "./calendar.css";

export function Calendar() {
  const {
    trades,
    addTrade,
    removeTrade,
    initialBalance,
    setInitialBalance,
    tradesTotal,
    accountTotal,
  } = useTradeCalendar();
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

  const weekIndexByDateKey = new Map<string, number>();
  days.forEach((day, dayIndex) => {
    const dateKey = dateToLocalKey(day);
    weekIndexByDateKey.set(dateKey, Math.floor(dayIndex / 5) + 1);
  });

  const maxWeekInMonth = Math.ceil(days.length / 5);

  const weeklyStats = Array.from({ length: maxWeekInMonth }, (_, i) => ({
    week: i + 1,
    result: 0,
    trades: 0,
  }));

  Object.values(trades).forEach((trade) => {
    const tradeDate = parseLocalKeyToDate(trade.date);
    if (
      tradeDate.getFullYear() !== now.getFullYear() ||
      tradeDate.getMonth() !== now.getMonth()
    ) {
      return;
    }

    const weekIndex = (weekIndexByDateKey.get(trade.date) ?? 0) - 1;
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

  function handleInitialBalanceChange(value: string) {
    const parsed = Number(value);
    setInitialBalance(Number.isFinite(parsed) ? parsed : 0);
  }

  const selectedKey = selectedDate ? dateToLocalKey(selectedDate) : undefined;
  const selectedTrade = selectedKey ? trades[selectedKey] : undefined;

  return (
    <div>
      <div className="month-header">
        <div>
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

        <div className="account-panel">
          <label htmlFor="initialBalance" className="account-label">
            Saldo inicial da conta
          </label>
          <input
            id="initialBalance"
            type="number"
            step="0.01"
            value={initialBalance}
            onChange={(e) => handleInitialBalanceChange(e.target.value)}
            className="account-input"
          />

          <div className="account-values">
            <div className="account-row">
              <span>Resultado acumulado:</span>
              <strong>{formatCurrency(tradesTotal)}</strong>
            </div>
            <div className="account-row total">
              <span>Total da conta:</span>
              <strong>{formatCurrency(accountTotal)}</strong>
            </div>
          </div>
        </div>
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
