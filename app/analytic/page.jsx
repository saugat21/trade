"use client";

import { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Equity from "@/components/Equity";

/* ---------- COLORS ---------- */
const COLORS = [
  "#22c55e",
  "#38bdf8",
  "#facc15",
  "#a855f7",
  "#f97316",
  "#14b8a6",
  "#e11d48",
];

/* ---------- CUSTOM LABEL ---------- */
const renderPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[11px] fill-white font-medium"
    >
      <tspan x={x} dy="-0.4em">
        {payload.name}
      </tspan>
      <tspan x={x} dy="1.1em">
        {Math.round(percent * 100)}%
      </tspan>
      <tspan x={x} dy="1.1em" className="fill-slate-300">
        {payload.wins}W / {payload.losses}L
      </tspan>
    </text>
  );
};

export default function AnalyticsPage() {
  const [trades, setTrades] = useState([]);
  const [groupBy, setGroupBy] = useState("strategy");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [capital, setCapital] = useState(0);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then(setTrades);

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setCapital(data.startingCapital || 500));
  }, []);

  /* ---------- MONTH SAFETY ---------- */
  const currentMonth = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    [],
  );

  const effectiveMonth = selectedMonth || currentMonth;

  /* ---------- PIE DATA ---------- */
  const pieData = useMemo(() => {
    const grouped = {};

    const filteredTrades =
      effectiveMonth === "ALL"
        ? trades
        : trades.filter(
            (t) =>
              new Date(t.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              }) === effectiveMonth,
          );

    filteredTrades.forEach((t) => {
      let key;
      if (groupBy === "strategy") key = t.strategy;
      if (groupBy === "session") key = t.session;
      if (groupBy === "asset") key = t.asset;
      if (groupBy === "day")
        key = new Date(t.date).toLocaleDateString("en-US", {
          weekday: "long",
        });

      if (!key) return;

      if (!grouped[key]) grouped[key] = { pnl: 0, wins: 0, losses: 0 };

      if (t.result === "WIN") {
        grouped[key].pnl += t.reward;
        grouped[key].wins += 1;
      }
      if (t.result === "LOSS") {
        grouped[key].pnl -= t.risk;
        grouped[key].losses += 1;
      }
      if (t.result === "PARTIAL_CLOSE") {
        grouped[key].pnl += t.reward * 0.5;
      }
    });

    return Object.keys(grouped)
      .filter((k) => grouped[k].pnl > 0)
      .map((k) => {
        const { wins, losses } = grouped[k];
        const total = wins + losses;
        return {
          name: k,
          value: total ? Number(((wins / total) * 100).toFixed(1)) : 0,
          wins,
          losses,
        };
      });
  }, [trades, groupBy, effectiveMonth]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-slate-100">Analytics</h1>

          <select
            value={effectiveMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm"
          >
            <option value="ALL">All Months</option>
            {Array.from(
              new Set(
                trades.map((t) =>
                  new Date(t.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  }),
                ),
              ),
            ).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm"
          >
            <option value="strategy">Strategy</option>
            <option value="day">Day</option>
            <option value="session">Session</option>
            <option value="asset">Asset</option>
          </select>
        </div>

        {/* PIE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-slate-100 font-medium mb-4">
            Profitable {groupBy} Analysis
          </h2>

          {pieData.length === 0 ? (
            <p className="text-slate-400">No profitable data</p>
          ) : (
            <div className="h-85">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    label={renderPieLabel}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* EQUITY */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-slate-100 font-medium mb-4">Equity Curve</h2>
          <Equity trades={trades} startingCapital={capital} />
        </div>
      </div>
    </div>
  );
}
