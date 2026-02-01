"use client";

export default function DailyPnLBox({ data, maxProfit, maxLoss, date, onClick }) {
  // Default empty box if no data
  if (!data) {
    return (
      <div className="h-24 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-xs">
        <span className="text-slate-400">
          {date.toDateString().split(" ")[0]}
        </span>
        <span className="text-slate-400">{date.getDate()}</span>
      </div>
    );
  }

  const isProfit = data.pnl > 0;
  const isLoss = data.pnl < 0;
  const isBreakeven = data.pnl === 0;

  const intensity = isProfit
    ? Math.min(data.pnl / maxProfit, 1)
    : isLoss
      ? Math.min(Math.abs(data.pnl) / Math.abs(maxLoss), 1)
      : 0.5; // medium intensity for breakeven

  const bgColor = isProfit
    ? `rgba(34,197,94,${0.3 + intensity * 0.7})`
    : isLoss
      ? `rgba(239,68,68,${0.3 + intensity * 0.7})`
      : `rgba(250,204,21,0.6)`; // yellow for breakeven

  // Day abbreviation and date
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dateNumber = date.getDate();

  return (
    <div
      onClick={onClick}
      className="h-24 rounded-lg flex flex-col items-center justify-center text-xs font-semibold cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-1"
      style={{ backgroundColor: bgColor }}
      title={`PnL: $${data.pnl}\nTrades: ${data.trades}\nWins: ${data.wins}\nLosses: ${data.losses}`}
    >
      <span className="text-slate-200 text-[10px]">{dayName}</span>
      <span className="text-slate-200 text-[12px] font-bold">{dateNumber}</span>
      <span className="text-white">${data.pnl}</span>
      <span className="text-slate-200 text-[10px]">
        {data.trades}T {data.wins}W / {data.losses}L
      </span>
    </div>
  );
}
