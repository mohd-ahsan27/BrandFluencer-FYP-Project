import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { brands } from "../data/ExploreData";

export default function ExploreBrandsView() {
  const { role, search } = useOutletContext();
  if (role !== "creator") return null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) =>
      [b.name, b.industry, b.location, b.website].some((x) =>
        String(x).toLowerCase().includes(q)
      )
    );
  }, [search]);

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Explore Brands</h1>
          <p className="text-slate-600 text-sm mt-1">
            Find brands looking for creators like you.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Results: <span className="font-semibold text-slate-900">{filtered.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={b.logo} alt={b.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-slate-900 truncate">{b.name}</p>
                <p className="text-sm text-slate-600">{b.industry}</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-700 space-y-1">
              <p><span className="text-slate-500">Location:</span> {b.location}</p>
              <p><span className="text-slate-500">Website:</span> {b.website}</p>
              <p><span className="text-slate-500">Avg Budget:</span> USD {b.budgetUSD.toLocaleString()}</p>
            </div>

            <button
              type="button"
              className="mt-4 w-full px-4 py-2.5 rounded-2xl font-semibold text-white
                         bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 transition"
              onClick={() => alert("Open brand details page (optional route)")}
            >
              View Brand
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}