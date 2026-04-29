import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

const CAMPAIGNS_KEY = "brand_dashboard_campaigns";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveCampaigns(list) {
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(list));
}

function statusBadgeClass(status) {
  const s = String(status || "").trim().toLowerCase();
  if (s === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "completed") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function AdminCampaigns() {
  const { adminSearch } = useOutletContext();
  const [tick, setTick] = useState(0);

  const campaigns = useMemo(() => {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    const list = safeParse(raw, []);
    if (Array.isArray(list)) return list;
    return [];
  }, [tick]);

  const filtered = useMemo(() => {
    const q = String(adminSearch || "").trim().toLowerCase();
    if (!q) return campaigns;

    return campaigns.filter((c) => {
      const name = String(c?.name || "").toLowerCase();
      const type = String(c?.campaignType || "").toLowerCase();
      const status = String(c?.status || "").toLowerCase();
      const platform = String(c?.platform || "").toLowerCase();
      let platforms = "";
      if (Array.isArray(c?.platforms)) platforms = c.platforms.join(" ").toLowerCase();

      if (name.includes(q)) return true;
      if (type.includes(q)) return true;
      if (status.includes(q)) return true;
      if (platform.includes(q)) return true;
      if (platforms.includes(q)) return true;

      return false;
    });
  }, [campaigns, adminSearch]);

  const setStatus = (id, nextStatus) => {
    const list = Array.isArray(campaigns) ? [...campaigns] : [];
    const updated = list.map((c) => {
      if (String(c.id) !== String(id)) return c;
      return { ...c, status: nextStatus };
    });
    saveCampaigns(updated);
    setTick((t) => t + 1);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Campaigns</h2>
          <p className="text-sm text-slate-600 mt-1">
            Moderate campaigns saved in localStorage (demo).
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-b from-white to-cyan-50 px-4 py-3">
          <p className="text-xs font-bold text-cyan-800">Tip</p>
          <p className="text-xs text-slate-700 mt-1">
            Use the buttons to update campaign status instantly (demo).
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="min-w-[1000px] w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-bold text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Platforms</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-sm text-slate-600">
                    No campaigns found.
                  </td>
                </tr>
              ) : null}

              {filtered.map((c) => {
                const name = c?.name || "—";
                const type = c?.campaignType || "—";
                const currency = c?.currency || "USD";
                const budget = c?.budget || "—";

                let platformsText = "—";
                if (Array.isArray(c?.platforms) && c.platforms.length > 0) {
                  platformsText = c.platforms.join(", ");
                } else if (c?.platform) {
                  platformsText = String(c.platform);
                }

                const status = c?.status || "Draft";

                return (
                  <tr key={String(c.id)} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">{name}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{type}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      {currency} {budget}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{platformsText}</td>
                    <td className="px-4 py-4">
                      <span
                        className={
                          "inline-flex px-3 py-1.5 rounded-full text-xs font-bold border " +
                          statusBadgeClass(status)
                        }
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatus(c.id, "Active")}
                          className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Active
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(c.id, "Completed")}
                          className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                        >
                          Completed
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(c.id, "Draft")}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                        >
                          Draft
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}