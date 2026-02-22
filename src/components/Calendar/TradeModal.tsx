import { useEffect, useState } from "react";
import type { TradeDay } from "../../models/TradeDay";

type Props = {
  date: Date;
  trade?: TradeDay;
  onSave: (date: Date, result: number, trades: number) => void;
  onDelete: (date: Date) => void;
  onClose: () => void;
};

export function TradeModal({ date, trade, onSave, onDelete, onClose }: Props) {
  const [result, setResult] = useState(0);
  const [trades, setTrades] = useState(0);

  useEffect(() => {
    setResult(trade?.result ?? 0);
    setTrades(trade?.trades ?? 0);
  }, [trade, date]);

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Trade - {date.toLocaleDateString()}</h3>

        <input
          type="number"
          placeholder="Resultado ($)"
          value={result}
          onChange={(e) => setResult(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Qtd Trades"
          value={trades}
          onChange={(e) => setTrades(Number(e.target.value))}
        />

        <button onClick={() => onSave(date, result, trades)}>
          {trade ? "Salvar alteracoes" : "Salvar"}
        </button>

        {trade && (
          <button className="danger" onClick={() => onDelete(date)}>
            Apagar valor
          </button>
        )}

        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
