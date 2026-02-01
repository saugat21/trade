"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Equity({ trades, startingCapital }) {
  let runningBalance = startingCapital;
  const equityData = [];

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  sortedTrades.forEach((t) => {
    let pnl = 0;

    if (t.result === "WIN") pnl = t.reward;
    if (t.result === "LOSS") pnl = -t.risk;
    if (t.result === "PARTIAL_CLOSE") pnl = t.reward * 0.5;

    runningBalance += pnl;

    equityData.push({
      date: new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      balance: Number(runningBalance.toFixed(2)),
    });
  });

  if (equityData.length === 0) {
    return <p className="text-slate-400">No trade data available</p>;
  }

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={equityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;
              return (
                <div className="bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-sm">
                  <p className="text-slate-400">{label}</p>
                  <p className="text-green-400 font-semibold">
                    ${payload[0].value}
                  </p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
