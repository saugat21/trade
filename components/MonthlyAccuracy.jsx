"use client";

export default function MonthlyAccuracy({ wins, trades }) {
  const accuracy = trades ? Math.round((wins / trades) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 w-full md:w-64">
      <p className="text-slate-400 text-sm mb-2">Monthly Accuracy</p>

      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            accuracy >= 50 ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${accuracy}%` }}
        />
      </div>

      <p
        className={`mt-2 text-sm font-semibold ${
          accuracy >= 50 ? "text-green-400" : "text-red-400"
        }`}
      >
        {accuracy}%
      </p>
    </div>
  );
}
