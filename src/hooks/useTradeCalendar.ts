import { useState, useEffect } from "react";
import type { TradeDay } from "../models/TradeDay";

export function useTradeCalendar() {
  const [trades, setTrades] = useState<Record<string, TradeDay>>({});

  function addTrade(date: Date, result: number, tradesQty: number) {
    const key = date.toISOString().split("T")[0];

    const newTrade = {
      date: key,
      result,
      trades: tradesQty,
    };

    const updated = {
      ...trades,
      [key]: newTrade,
    };

    setTrades(updated);
    localStorage.setItem("trades", JSON.stringify(updated));
  }

  function removeTrade(date: Date) {
    const key = date.toISOString().split("T")[0];
    const updated = { ...trades };
    delete updated[key];

    setTrades(updated);
    localStorage.setItem("trades", JSON.stringify(updated));
  }

  useEffect(() => {
    const saved = localStorage.getItem("trades");
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  return {
    trades,
    addTrade,
    removeTrade,
  };
}
