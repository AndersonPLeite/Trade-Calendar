import { useState, useEffect } from "react";
import type { TradeDay } from "../models/TradeDay";
import { dateToLocalKey } from "../utils/dateUtils";

export function useTradeCalendar() {
  const [trades, setTrades] = useState<Record<string, TradeDay>>({});
  const [initialBalance, setInitialBalanceState] = useState(0);

  const TRADE_STORAGE_KEY = "trades";
  const INITIAL_BALANCE_STORAGE_KEY = "initialBalance";

  function addTrade(date: Date, result: number, tradesQty: number) {
    const key = dateToLocalKey(date);

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
    localStorage.setItem(TRADE_STORAGE_KEY, JSON.stringify(updated));
  }

  function removeTrade(date: Date) {
    const key = dateToLocalKey(date);
    const updated = { ...trades };
    delete updated[key];

    setTrades(updated);
    localStorage.setItem(TRADE_STORAGE_KEY, JSON.stringify(updated));
  }

  function setInitialBalance(value: number) {
    setInitialBalanceState(value);
    localStorage.setItem(INITIAL_BALANCE_STORAGE_KEY, String(value));
  }

  useEffect(() => {
    const saved = localStorage.getItem(TRADE_STORAGE_KEY);
    if (saved) {
      const parsedTrades = JSON.parse(saved) as Record<string, TradeDay>;
      const currentYear = new Date().getFullYear();
      const startFromMarchKey = `${currentYear}-03-01`;

      const filteredTrades = Object.fromEntries(
        Object.entries(parsedTrades).filter(([dateKey]) => {
          return dateKey >= startFromMarchKey;
        }),
      ) as Record<string, TradeDay>;

      setTrades(filteredTrades);

      if (
        Object.keys(filteredTrades).length !== Object.keys(parsedTrades).length
      ) {
        localStorage.setItem(TRADE_STORAGE_KEY, JSON.stringify(filteredTrades));
      }
    }

    const savedInitialBalance = localStorage.getItem(
      INITIAL_BALANCE_STORAGE_KEY,
    );
    if (savedInitialBalance !== null) {
      const parsed = Number(savedInitialBalance);
      if (Number.isFinite(parsed)) {
        setInitialBalanceState(parsed);
      }
    }
  }, []);

  const tradesTotal = Object.values(trades).reduce(
    (sum, trade) => sum + trade.result,
    0,
  );
  const accountTotal = initialBalance + tradesTotal;

  return {
    trades,
    addTrade,
    removeTrade,
    initialBalance,
    setInitialBalance,
    tradesTotal,
    accountTotal,
  };
}
