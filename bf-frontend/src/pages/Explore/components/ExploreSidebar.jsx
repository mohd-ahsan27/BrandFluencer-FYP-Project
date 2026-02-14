import React from "react";
import { MdTune, MdExpandMore } from "react-icons/md";

export default function ExploreSidebar({
  platforms,
  setPlatforms,
  followerMin,
  followerMax,
  setFollowerMin,
  setFollowerMax,
  selectedCategories,
  setSelectedCategories,
  allCategories,
  onReset,
}) {
  const togglePlatform = (key) => {
    setPlatforms((p) => ({ ...p, [key]: !p[key] }));
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const has = prev.includes(cat);
      if (has) return prev.filter((c) => c !== cat);
      return [...prev, cat];
    });
  };

  const chipClass = (selected) => {
    if (selected) {
      return "px-2 py-1.5 bg-[#13daec]/10 text-[#13daec] rounded-lg text-xs font-bold text-center";
    }
    return "px-2 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-center hover:bg-slate-200 transition";
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MdTune className="text-[#13daec] text-xl" />
            Filters
          </h3>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-[#13daec] hover:underline"
          >
            Reset
          </button>
        </div>

        <details className="group open" open>
          <summary className="flex items-center justify-between cursor-pointer list-none py-2 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-800">Platforms</span>
            <MdExpandMore className="text-xl group-open:rotate-180 transition-transform" />
          </summary>
          <div className="pt-4 space-y-3">
            {[
              ["instagram", "Instagram"],
              ["tiktok", "TikTok"],
              ["youtube", "YouTube"],
              ["facebook", "Facebook"],
              ["snapchat", "Snapchat"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  checked={!!platforms[key]}
                  onChange={() => togglePlatform(key)}
                  className="rounded text-[#13daec] focus:ring-[#13daec] border-slate-200 bg-slate-100 size-4"
                  type="checkbox"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </details>

        <div className="py-2 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Follower Range</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 font-bold">Min</label>
              <input
                type="number"
                value={followerMin}
                onChange={(e) => setFollowerMin(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#13daec]/40 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-bold">Max</label>
              <input
                type="number"
                value={followerMax}
                onChange={(e) => setFollowerMax(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#13daec]/40 outline-none"
              />
            </div>
          </div>
        </div>

        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none py-2 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-800">Categories</span>
            <MdExpandMore className="text-xl group-open:rotate-180 transition-transform" />
          </summary>
          <div className="pt-4 grid grid-cols-2 gap-2">
            {allCategories.slice(0, 12).map((cat) => {
              const selected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={chipClass(selected)}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </details>

        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none py-2 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-800">Engagement Rate</span>
            <MdExpandMore className="text-xl group-open:rotate-180 transition-transform" />
          </summary>
          <div className="pt-4">
            <p className="text-xs text-slate-500">Select min engagement...</p>
          </div>
        </details>

        <div className="pt-2">
          <div className="p-4 rounded-xl bg-[#F76F5F]/10 border border-[#F76F5F]/20">
            <p className="text-xs font-bold text-[#F76F5F] mb-1">PRO Feature</p>
            <p className="text-[11px] leading-tight text-[#F76F5F]/80">
              Unlock advanced AI-driven brand affinity filters.
            </p>
            <button
              type="button"
              className="mt-3 w-full py-2 bg-[#F76F5F] text-white text-xs font-bold rounded-lg"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}