import { useState } from "react";
import { TradeCalendar } from "../services/TradeCalendar";

export function useTradeCalendar() {
  const [calendar] = useState(new TradeCalendar());
  const [, setRefresh] = useState(0);

  function addTrade(date: string, result: number, trades: number) {
    calendar.addTrade(date, result, trades);
    setRefresh(prev => prev + 1);
  }

  return {
    trades: calendar.getTrades(),
    stats: calendar.getStats(),
    addTrade
  };
}
