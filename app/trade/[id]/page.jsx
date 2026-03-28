"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";


function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <input
        {...props}
        required
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-slate-400"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <select
        {...props}
        required
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-slate-400"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <textarea
        {...props}
        rows="3"
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-slate-400"
      />
    </div>
  );
}


export default function EditTradePage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    date: "",
    asset: "",
    position: "",
    strategy: "",
    session: "",
    risk: "",
    reward: "",
    result: "",
    lessonLearned: "",
  });


  useEffect(() => {
    if (id) fetchTrade();
  }, [id]);

  const fetchTrade = async () => {
    const res = await fetch(`/api/trades/${id}`);
    const data = await res.json();

    setForm({
      ...data,
      date: data.date?.split("T")[0], 
    });
  };

  const rr =
    form.risk && form.reward ? `1:${(form.reward / form.risk).toFixed(1)}` : "";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE instead of POST
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`/api/trades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

   
    router.push("/profitandloss");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-8">
        <h1 className="text-2xl font-semibold text-slate-100 mb-6 text-center">
          Edit Trade
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            label="Trade Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <Select
            label="Asset"
            name="asset"
            value={form.asset}
            onChange={handleChange}
            options={["BTC", "GOLD", "SILVER", "FOREX", "OTHER"]}
          />

          <Select
            label="Position"
            name="position"
            value={form.position}
            onChange={handleChange}
            options={["BUY", "SELL"]}
          />

          <Select
            label="Strategy"
            name="strategy"
            value={form.strategy}
            onChange={handleChange}
            options={["EMA", "CRT", "SESSION_SWEEP", "OTHER"]}
          />

          <Select
            label="Session"
            name="session"
            value={form.session}
            onChange={handleChange}
            options={["ASIAN", "LONDON", "NEW_YORK"]}
          />

          <Select
            label="Result"
            name="result"
            value={form.result}
            onChange={handleChange}
            options={["WIN", "LOSS", "BREAKEVEN", "PARTIAL_CLOSE"]}
          />

          <Input
            label="Risk ($)"
            type="number"
            name="risk"
            value={form.risk}
            onChange={handleChange}
          />

          <Input
            label="Reward ($)"
            type="number"
            name="reward"
            value={form.reward}
            onChange={handleChange}
          />

          <div className="md:col-span-2 text-sm text-slate-400">
            Risk : Reward →
            <span className="text-slate-100 font-semibold ml-2">{rr}</span>
          </div>

          <Textarea
            label="Lesson Learned"
            name="lessonLearned"
            value={form.lessonLearned}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="cursor-pointer w-full mt-4 bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold hover:bg-white transition"
            >
              Update Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
