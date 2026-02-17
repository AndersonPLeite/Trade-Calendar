import { type TradeDay } from "../models/TradeDay";

export class TradeCalendar {
  private trades: TradeDay[] = [];

  addTrade(date: string, result: number, trades: number) {
    this.trades = this.trades.filter(t => t.date !== date);
    this.trades.push({ date, result, trades });
  }

  getTrades() {
    return this.trades;
  }

  getMonthlyStats(year: number, month: number) {
    const monthly = this.trades.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const total = monthly.reduce((acc, t) => acc + t.result, 0);

    return {
      total,
      days: monthly.length
    };
  }

  getStats() {
  const trades = this.getTrades();
  
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      totalResult: 0,
      winRate: 0,
      averageResult: 0
    };
  }

  const totalResult = trades.reduce((sum, trade) => sum + trade.result, 0);
  const winningTrades = trades.filter(trade => trade.result > 0).length;
  const winRate = (winningTrades / trades.length) * 100;
  const averageResult = totalResult / trades.length;

  return {
    totalTrades: trades.length,
    totalResult,
    winRate,
    averageResult
  };
}

}
