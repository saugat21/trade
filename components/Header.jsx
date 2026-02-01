"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  

  return (
    <header className="bg-slate-800 border-b border-gray-700 text-gray-300 text-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wide text-gray-200">
          Trade<span className="text-gray-400">Journal</span>
        </Link>


        <nav className="hidden md:flex gap-10 font-medium">
          <Link href="/trade" className="hover:text-white transition">
            Trade
          </Link>
          <Link href="/history" className="hover:text-white transition">
            History
          </Link>
          <Link href="/analytic" className="hover:text-white transition">
            Analytics
          </Link>
          <Link href="/profitandloss" className="hover:text-white transition">
            Profit & Loss
          </Link>
        </nav>

        
        <button
          className="md:hidden text-gray-300"
          onClick={() => setOpenMenu(!openMenu)}
        >
          ☰
        </button>
      </div>

      
      {openMenu && (
        <div className="md:hidden bg-slate-800 border-t border-gray-700 px-4 pb-4 flex flex-col gap-4">
          <Link href="/trade" onClick={() => setOpenMenu(false)}>
            Trade
          </Link>
          <Link href="/history" onClick={() => setOpenMenu(false)}>
            History
          </Link>
          <Link href="/analytic" onClick={() => setOpenMenu(false)}>
            Analytics
          </Link>
          <Link href="/profitandloss" onClick={() => setOpenMenu(false)}>
            Profit & Loss
          </Link>
        </div>
      )}
    </header>
  );
}
