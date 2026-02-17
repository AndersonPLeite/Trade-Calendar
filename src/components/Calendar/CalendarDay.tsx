import type { TradeDay } from "../../models/TradeDay";

type Props = {
  day: Date;
  trade?: TradeDay;
};

export function CalendarDay({ day, trade }: Props) {
  const result = trade?.result ?? 0;

  let className = "day";
  if (result > 0) className += " profit";
  if (result < 0) className += " loss";

  return (
    <div className={className}>
      <span className="date">{day.getDate()}</span>

      {trade && (
        <>
          <div className="result">${trade.result}</div>
          <div className="trades">{trade.trades} trades</div>
        </>
      )}
    </div>
  );
}
