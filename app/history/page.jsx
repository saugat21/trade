"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [trades, setTrades] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    const res = await fetch("/api/trades");
    const data = await res.json();
    setTrades(data.slice(0, 15)); // limit to 15
  };

  const filteredTrades = trades.filter((trade) => {
    const tradeDate = new Date(trade.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && tradeDate < from) return false;
    if (to && tradeDate > to) return false;
    return true;
  });
const formatRR = (value) => {
  if (!value) return "—";
  return Number.isInteger(value)
    ? value
    : value.toFixed(2).replace(/\.?0+$/, "");
};
const getDayName = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short", // Mon, Tue, Wed
  });
};

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-100">
            Trade History
          </h1>

          {/* Date Filter */}
          <div className="flex gap-3 mt-4 md:mt-0">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Day</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Side</th>
                <th className="p-3">Strategy</th>
                <th className="p-3">Session</th>
                <th className="p-3">RR</th>
                <th className="p-3">Result</th>
              </tr>
            </thead>

            <tbody className="text-white">
              {filteredTrades.map((trade) => {
                const rr = trade.reward / trade.risk;

                return (
                  <tr
                    key={trade._id}
                    className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                  >
                    <td className="p-3">
                      {new Date(trade.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-slate-300">
                      {getDayName(trade.date)}
                    </td>
                    <td className="p-3 font-medium">{trade.asset}</td>
                    <td
                      className={`p-3 font-semibold ${
                        trade.position === "BUY"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {trade.position}
                    </td>
                    <td className="p-3">{trade.strategy}</td>
                    <td className="p-3">{trade.session}</td>

                    {/* RR */}
                    <td
                      className={`p-3 font-semibold ${
                        rr >= 2 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      1:{formatRR(rr)}
                    </td>

                    {/* Result */}
                    <td
                      className={`p-3 font-semibold ${
                        trade.result === "WIN"
                          ? "text-green-400"
                          : trade.result === "LOSS"
                            ? "text-red-400"
                            : trade.result === "BREAKEVEN"
                              ? "text-slate-400"
                              : "text-yellow-400"
                      }`}
                    >
                      {trade.result}
                    </td>
                  </tr>
                );
              })}

              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">
                    No trades found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <p className="text-slate-500 text-xs mt-4">Showing latest 15 trades</p>
      </div>
    </div>
  );
}
