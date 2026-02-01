"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Edit2 } from "lucide-react";

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [capital, setCapital] = useState(500); // default
  const [editing, setEditing] = useState(false);
  const [capitalInput, setCapitalInput] = useState(capital);

  // Fetch trades
  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then(setTrades);
  }, []);

  // Fetch capital from DB
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setCapital(data.startingCapital);
        setCapitalInput(data.startingCapital);
      });
  }, []);

  const today = new Date().toDateString();

  // ---------------- STATS ----------------
  const pnl = trades.reduce((acc, t) => {
    if (t.result === "WIN") return acc + t.reward;
    if (t.result === "LOSS") return acc - t.risk;
    if (t.result === "PARTIAL_CLOSE") return acc + t.reward * 0.5;
    return acc;
  }, 0);
  const balance = capital + pnl;
  const wins = trades.filter((t) => t.result === "WIN").length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(1) : 0;
  const todayTrades = trades.filter(
    (t) => new Date(t.date).toDateString() === today,
  );

  // ---------------- MONTHLY P&L ----------------
  // ---------------- MONTHLY P&L ----------------
  const monthlyPnLMap = {};
  const monthlyTradesCount = {};

  trades.forEach((t) => {
    const month = new Date(t.date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    // Calculate P&L
    let value = 0;
    if (t.result === "WIN") value = t.reward;
    if (t.result === "LOSS") value = -t.risk;
    if (t.result === "PARTIAL_CLOSE") value = t.reward * 0.5;

    monthlyPnLMap[month] = (monthlyPnLMap[month] || 0) + value;

    // Count trades
    monthlyTradesCount[month] = (monthlyTradesCount[month] || 0) + 1;
  });

  const monthlyData = Object.keys(monthlyPnLMap).map((month) => ({
    month,
    pnl: Number(monthlyPnLMap[month].toFixed(2)),
    trades: monthlyTradesCount[month], // <-- total trades in this month
  }));

  function MonthlyPnLTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    const { value, payload: data } = payload[0]; // payload[0].payload contains your data object
    const tradeCount = data.trades || 0;

    return (
      <div className="bg-slate-950 border border-slate-700 px-4 py-2 rounded-lg text-sm">
        <p className="text-slate-400">{label}</p>
        <p
          className={`font-semibold ${value >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          {value >= 0 ? "+" : "-"}${Math.abs(value)}
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Total Trades: {tradeCount}
        </p>
      </div>
    );
  }


  const handleSaveCapital = async () => {
    try {
      const numericCapital = Number(capitalInput); // convert here
      if (isNaN(numericCapital) || numericCapital < 0) {
        alert("Please enter a valid number");
        return;
      }
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startingCapital: numericCapital }),
      });
      const data = await res.json();
      setCapital(data.startingCapital);
      setEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update capital");
    }
  };

  const profitPercent = capital > 0 ? ((pnl / capital) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* CAPITAL ROW */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
          {!editing ? (
            <>
              <p className="text-slate-200 font-semibold">
                Starting Capital: ${capital}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="text-yellow-400 hover:text-yellow-300 p-1 rounded transition cursor-pointer"
                title="Edit Lesson"
              >
                <Edit2 size={18} />
              </button>
            </>
          ) : (
            <div className="flex gap-2 w-full justify-between items-center">
              <input
                type="number"
                value={capitalInput}
                onChange={(e) => setCapitalInput(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 px-3 py-1 rounded-lg flex-1"
              />
              <button
                onClick={handleSaveCapital}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setCapitalInput(capital);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* STAT ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <StatCard title="Net P&L" value={`$${pnl}`} positive={pnl >= 0} />
          <StatCard
            title="Current Balance"
            value={`$${balance}`}
            positive={balance >= capital}
          />
          <StatCard
            title="Profit %"
            value={`${profitPercent}%`}
            positive={profitPercent >= 0}
          />
          <StatCard title="Win Rate" value={`${winRate}%`} />
          <StatCard title="Total Trades" value={trades.length} />
        </div>

        {/* MONTHLY P&L CHART */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-slate-100 font-semibold mb-4">
            Monthly Profit & Loss
          </h2>
          {monthlyData.length === 0 ? (
            <p className="text-slate-400">No trade data yet</p>
          ) : (
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barCategoryGap="30%" barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#94a3b8" tickMargin={10} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip cursor={false} content={<MonthlyPnLTooltip />} />
                  <Bar dataKey="pnl" barSize={32} radius={[6, 6, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* TODAY TRADES */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-slate-100 font-semibold mb-4">Today’s Trades</h2>
          {todayTrades.length === 0 ? (
            <p className="text-slate-400">No trades today</p>
          ) : (
            <ul className="space-y-2 text-slate-200">
              {todayTrades.map((t) => (
                <li key={t._id} className="flex justify-between text-sm">
                  <span>
                    {t.asset} ({t.strategy})
                  </span>
                  <span
                    className={
                      t.result === "WIN"
                        ? "text-green-400"
                        : t.result === "LOSS"
                          ? "text-red-400"
                          : "text-slate-400"
                    }
                  >
                    {t.result}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- STAT CARD ----------------
function StatCard({ title, value, positive }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 min-w-25 flex flex-col items-center">
      <p className="text-slate-400 text-sm">{title}</p>
      <p
        className={`text-xl md:text-2xl font-bold ${
          positive === undefined
            ? "text-slate-100"
            : positive
              ? "text-green-400"
              : "text-red-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
