"use client";

export default function DailyPnLBox({
  data,
  maxProfit,
  maxLoss,
  date,
  onClick,
}) {
  // Empty day box
  if (!data) {
    return (
      <div className="relative h-24 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-xs">
        {/* Date Badge */}
        <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-200">
          {date.getDate()}
        </div>

        <span className="text-slate-400 text-sm">
          {date.toLocaleDateString("en-US", { weekday: "short" })}
        </span>
      </div>
    );
  }

  const isProfit = data.pnl > 0;
  const isLoss = data.pnl < 0;

  const intensity = isProfit
    ? Math.min(data.pnl / maxProfit, 1)
    : isLoss
      ? Math.min(Math.abs(data.pnl) / Math.abs(maxLoss), 1)
      : 0.5;

  const bgColor = isProfit
    ? `rgba(34,197,94,${0.3 + intensity * 0.7})`
    : isLoss
      ? `rgba(239,68,68,${0.3 + intensity * 0.7})`
      : `rgba(250,204,21,0.6)`; // breakeven

  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div
      onClick={onClick}
      className="relative h-24 sm:h-24 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-2"
      style={{ backgroundColor: bgColor }}
      title={`PnL: $${data.pnl}\nTrades: ${data.trades}\nWins: ${data.wins}\nLosses: ${data.losses}`}
    >
      {/* Date Badge */}
      <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-[11px] font-bold text-white">
        {date.getDate()}
      </div>

      {/* Day */}
      <span className="text-slate-100 text-sm font-semibold">{dayName}</span>

      {/* PnL */}
      <span className="text-white text-sm font-extrabold leading-tight">
        ${data.pnl}
      </span>

      {/* Stats */}
      <span className="text-[10px] sm:text-xs text-slate-100 leading-tight">
        {data.trades}T · {data.wins}W / {data.losses}L
      </span>
    </div>
  );
}
