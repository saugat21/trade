"use client";

import { useState } from "react";
import DailyPnLBox from "./DailyPnLBOX";

function getDaysInMonth(year, monthIndex) {
  const days = [];
  const date = new Date(year, monthIndex, 1);

  while (date.getMonth() === monthIndex) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function PnLHeatmap({ trades, selectedMonth }) {
  const [selectedDayTrades, setSelectedDayTrades] = useState(null);

  if (!selectedMonth) return null;

  const [year, month] = selectedMonth.split("-").map(Number);
  const monthIndex = month - 1;

  const daysInMonth = getDaysInMonth(year, monthIndex);
  const dailyStats = {};
  const tradesByDay = {};

  trades.forEach((t) => {
    const key = new Date(t.date).toISOString().split("T")[0];

    if (!dailyStats[key]) {
      dailyStats[key] = { pnl: 0, wins: 0, losses: 0, trades: 0 };
      tradesByDay[key] = [];
    }

    if (t.result === "WIN") {
      dailyStats[key].pnl += t.reward;
      dailyStats[key].wins++;
    }

    if (t.result === "LOSS") {
      dailyStats[key].pnl -= t.risk;
      dailyStats[key].losses++;
    }

    if (t.result === "PARTIAL_CLOSE") {
      dailyStats[key].pnl += t.reward * 0.5;
    }

    dailyStats[key].trades++;
    tradesByDay[key].push(t);
  });

  const pnlValues = Object.values(dailyStats).map((d) => d.pnl);
  const maxProfit = Math.max(...pnlValues, 1);
  const maxLoss = Math.min(...pnlValues, -1);

  return (
    <>
      {/* HEATMAP */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((d) => {
          const key = d.toISOString().split("T")[0];
          return (
            <DailyPnLBox
              key={key}
              data={dailyStats[key]}
              maxProfit={maxProfit}
              maxLoss={maxLoss}
              date={d}
              onClick={() =>
                tradesByDay[key] && setSelectedDayTrades(tradesByDay[key])
              }
            />
          );
        })}
      </div>

      {/* MODAL */}
      {selectedDayTrades && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-100">
                Lesson Review
              </h2>
              <button
                onClick={() => setSelectedDayTrades(null)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Lessons */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {selectedDayTrades.map((t, i) => (
                <div
                  key={i}
                  className="bg-slate-800/60 border border-slate-700 rounded-xl p-4"
                >
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {t.lessonLearned || "No lesson written for this trade."}
                  </p>
                </div>
              ))}
            </div>

            
          </div>
        </div>
      )}
    </>
  );
}
