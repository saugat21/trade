"use client";

import { useEffect, useState } from "react";
import PnLHeatmap from "@/components/PnLHeatmap";
import MonthlyAccuracy from "@/components/MonthlyAccuracy";

export default function ProfitLossPage() {
  const [trades, setTrades] = useState([]);
  const [capital, setCapital] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // default current month
  });

  /* ---------- FETCH TRADES ---------- */
  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then(setTrades);
  }, []);
   useEffect(() => {
     fetch("/api/settings")
       .then((res) => res.json())
       .then((data) => {
         setCapital(data?.startingCapital || 0);
       });
   }, []);

  /* ---------- FILTERED TRADES BY MONTH ---------- */
  const filteredTrades = trades.filter((t) => {
    const d = new Date(t.date);
    const tradeMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return tradeMonth === selectedMonth;
  });
 const totalTrades = filteredTrades.length;
  const wins = filteredTrades.filter((t) => t.result === "WIN").length;
 
   const totalProfit = filteredTrades.reduce((sum, t) => {
     if (t.result === "WIN") return sum + t.reward;
     if (t.result === "LOSS") return sum - t.risk;
     if (t.result === "BREAKEVEN") return sum;
     if (t.result === "PARTIAL_CLOSE") return sum + t.reward * 0.5; // example
     return sum;
   }, 0);
   const percentReturn =
     capital > 0 ? ((totalProfit / capital) * 100).toFixed(2) : 0;


  /* ---------- MONTH OPTIONS FOR SELECT ---------- */
  const monthOptions = Array.from(
    new Set(
      trades.map((t) => {
        const d = new Date(t.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }),
    ),
  );

   return (
     <div className="min-h-screen bg-slate-950 p-6">
       <div className="max-w-7xl mx-auto space-y-6">
         {/* HEADER */}
         <div className="flex flex-wrap items-center justify-between gap-4">
           <h1 className="text-xl font-semibold text-slate-100">
             Profit & Loss
           </h1>

           <select
             value={selectedMonth}
             onChange={(e) => setSelectedMonth(e.target.value)}
             className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm"
           >
             <option value="ALL">All Months</option>
             {monthOptions.map((m) => {
               const display = new Date(m + "-01").toLocaleDateString("en-US", {
                 month: "short",
                 year: "numeric",
               });
               return (
                 <option key={m} value={m}>
                   {display}
                 </option>
               );
             })}
           </select>
         </div>

         {/* STATS BOXES */}
         <div className="flex flex-wrap gap-4">
           <MonthlyAccuracy wins={wins} trades={totalTrades} />

           {/* TOTAL TRADES */}
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 w-full md:w-64">
             <p className="text-slate-400 text-sm mb-1">Total Trades</p>
             <p className="text-xl font-semibold text-blue-400">
               {totalTrades}
             </p>
           </div>

           {/* TOTAL PROFIT */}
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 w-full md:w-64">
             <p className="text-slate-400 text-sm mb-1">Total Profit</p>
             <p
               className={`text-xl font-semibold ${
                 totalProfit >= 0 ? "text-green-400" : "text-red-400"
               }`}
             >
               ${totalProfit.toFixed(2)}
             </p>
           </div>

           {/* RETURN % */}
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 w-full md:w-64">
             <p className="text-slate-400 text-sm mb-1">Return %</p>
             <p
               className={`text-xl font-semibold ${
                 percentReturn >= 0 ? "text-green-400" : "text-red-400"
               }`}
             >
               {percentReturn}%
             </p>
           </div>
         </div>

         {/* HEATMAP */}
         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <PnLHeatmap trades={filteredTrades} selectedMonth={selectedMonth} />
         </div>
       </div>
     </div>
   );
}
