import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { campaigns } from "../data/ExploreData";

export default function ExploreCampaignsView() {
  const { role, search } = useOutletContext();
  if (role !== "creator") return null;

  const filtered = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    if (!q) return campaigns;

    return (campaigns || []).filter((c) =>
      [c.title, c.brandName, c.platform, ...(c.tags || [])].some((x) =>
        String(x).toLowerCase().includes(q)
      )
    );
  }, [search]);

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Campaigns</h1>
          <p className="text-slate-600 text-sm mt-1">Browse active opportunities (demo data).</p>
        </div>
        <p className="text-sm text-slate-500">
          Results: <span className="font-semibold text-slate-900">{filtered.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 truncate">{c.title}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Brand: <span className="font-semibold">{c.brandName}</span>
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                {c.platform}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(c.tags || []).map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-white text-slate-700">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 text-sm text-slate-700 flex items-center justify-between">
              <span><span className="text-slate-500">Budget:</span> USD {c.budgetUSD.toLocaleString()}</span>
              <span><span className="text-slate-500">Deadline:</span> {c.deadline}</span>
            </div>

            <button
              type="button"
              className="mt-5 w-full px-4 py-2.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 transition"
              onClick={() => alert("Apply flow (future backend)")}
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}