import React from "react";
import { FiFilter, FiRefreshCw } from "react-icons/fi";

const DEFAULT_CREATOR_CATEGORIES = [
  "Fashion","Beauty","Lifestyle","Travel","Food","Fitness","Health","Tech","Gaming",
  "Photography","Parenting","Education","Finance","Music","Pets","Art","Design",
  "Sports","Movies","Books","Home Decor","Luxury","Marketing","Nature","Comedy",
];

const MAX_CATEGORIES = 5;

const FOLLOWER_PRESETS = [
  { label: "Any", value: "" },
  { label: "Up to 10K", value: "10000" },
  { label: "Up to 100K", value: "100000" },
  { label: "Up to 500K", value: "500000" },
  { label: "Up to 1M", value: "1000000" },
  { label: "Up to 5M", value: "5000000" },
];

export default function ExploreSidebar({
  role,
  platforms,
  setPlatforms,
  maxFollowers,
  setMaxFollowers,
  selectedCategories,
  setSelectedCategories,
  allCategories,
  minRating,
  setMinRating,
  verifiedOnly,
  setVerifiedOnly,
  onReset,
}) {
  const togglePlatform = (key) => setPlatforms((p) => ({ ...p, [key]: !p[key] }));

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const has = prev.includes(cat);
      if (has) return prev.filter((x) => x !== cat);
      if (prev.length >= MAX_CATEGORIES) return prev;
      return [...prev, cat];
    });
  };

  const categoriesToShow =
    Array.isArray(allCategories) && allCategories.length
      ? Array.from(new Set([...allCategories, ...DEFAULT_CREATOR_CATEGORIES]))
      : DEFAULT_CREATOR_CATEGORIES;

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 inline-flex items-center gap-2">
            <FiFilter className="text-sky-700" />
            Filters
          </h3>
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-sky-700 hover:underline inline-flex items-center gap-2"
          >
            <FiRefreshCw />
            Reset
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-600">
              {role === "creator" ? "Brand Categories" : "Creator Categories"}
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              {selectedCategories.length}/{MAX_CATEGORIES}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {categoriesToShow.map((cat) => {
              const selected = selectedCategories.includes(cat);
              const disabled = !selected && selectedCategories.length >= MAX_CATEGORIES;

              return (
                <button
                  key={cat}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleCategory(cat)}
                  className={[
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                    selected
                      ? "bg-sky-600 text-white border-sky-600"
                      : disabled
                      ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {role === "brand" ? (
          <>
            <div className="mt-6">
              <label className="text-xs font-bold text-slate-600">Max Followers</label>
              <select
                value={maxFollowers}
                onChange={(e) => setMaxFollowers(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              >
                {FOLLOWER_PRESETS.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold text-slate-600">Platforms</p>
              <div className="mt-3 space-y-2">
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
                      className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                      type="checkbox"
                    />
                    <span className="text-sm text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                  type="checkbox"
                />
                <span className="text-sm font-semibold text-slate-700">Verified only</span>
              </label>
            </div>

            <div className="mt-6">
              <label className="text-xs font-bold text-slate-600">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Any</option>
                <option value="3">3.0+</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}