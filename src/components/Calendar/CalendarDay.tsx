import type { TradeDay } from "../../models/TradeDay";

type Props = {
  day: Date;
  trade?: TradeDay;
  onClick: (date: Date) => void;
};

export function CalendarDay({ day, trade, onClick }: Props) {
  const result = trade?.result ?? 0;

  let className = "day";
  if (result > 0) className += " profit";
  if (result < 0) className += " loss";

  return (
    <div className={className} onClick={() => onClick(day)}>
      <span className="date">{day.getDate()}</span>

      {trade && (
        <>
          <div className="result">${trade.result}</div>
          <div className="trades">{trade.trades} trades</div>
        </>
      )}

      {!trade && <span className="add">+</span>}
    </div>
  );
}