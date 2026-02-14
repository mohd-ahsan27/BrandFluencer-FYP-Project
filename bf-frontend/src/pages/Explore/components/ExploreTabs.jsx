import React from "react";

export default function ExploreTabs() {
  return (
    <div className="flex items-center gap-10 border-b border-slate-100 mb-8 overflow-x-auto">
      <button className="relative py-4 text-base font-bold text-[#13daec] whitespace-nowrap">
        Influencers
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#13daec] rounded-t-full" />
      </button>
      <button className="py-4 text-base font-bold text-slate-400 hover:text-slate-800 transition-colors whitespace-nowrap">
        Brands
      </button>
      <button className="py-4 text-base font-bold text-slate-400 hover:text-slate-800 transition-colors whitespace-nowrap">
        Creators
      </button>
      <button className="py-4 text-base font-bold text-slate-400 hover:text-slate-800 transition-colors whitespace-nowrap">
        Agencies
      </button>
    </div>
  );
}