import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getReports, updateReportStatus, removeReport } from "../../data/reportStore";

function formatDate(ms) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "—";
  }
}

function badgeClass(status) {
  const s = String(status || "open").toLowerCase();
  if (s === "resolved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function AdminReports() {
  const { adminSearch } = useOutletContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tick, setTick] = useState(0);

  const reports = useMemo(() => getReports(), [tick]);

  const filtered = useMemo(() => {
    const q = String(adminSearch || "").trim().toLowerCase();
    const list = Array.isArray(reports) ? reports : [];

    return list.filter((r) => {
      let okSearch = true;
      if (q) {
        const a = String(r.type || "").toLowerCase();
        const b = String(r.targetId || "").toLowerCase();
        const c = String(r.targetName || "").toLowerCase();
        const d = String(r.reason || "").toLowerCase();
        okSearch = a.includes(q) || b.includes(q) || c.includes(q) || d.includes(q);
      }

      let okStatus = true;
      if (statusFilter !== "all") okStatus = String(r.status || "open") === statusFilter;

      let okType = true;
      if (typeFilter !== "all") okType = String(r.type || "") === typeFilter;

      return okSearch && okStatus && okType;
    });
  }, [reports, adminSearch, statusFilter, typeFilter]);

  const resolve = (id) => {
    updateReportStatus(id, "resolved");
    setTick((x) => x + 1);
  };

  const reopen = (id) => {
    updateReportStatus(id, "open");
    setTick((x) => x + 1);
  };

  const del = (id) => {
    const ok = window.confirm("Delete this report?");
    if (!ok) return;
    removeReport(id);
    setTick((x) => x + 1);
  };

  let emptyRow = null;
  if (filtered.length === 0) {
    emptyRow = (
      <tr>
        <td colSpan={7} className="px-3 py-6 text-sm text-slate-600">
          No reports found.
        </td>
      </tr>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Reports</h2>
          <p className="text-sm text-slate-600 mt-1">
            Review and resolve reports submitted from Explore.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-2 h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none
                         focus:ring-2 focus:ring-cyan-200 focus:border-cyan-300 transition"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-2 h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none
                         focus:ring-2 focus:ring-cyan-200 focus:border-cyan-300 transition"
            >
              <option value="all">All</option>
              <option value="creator">Creator</option>
              <option value="brand">Brand</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="min-w-[900px] w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-bold text-slate-500">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {emptyRow}

              {filtered.map((r) => {
                let actionNode = null;

                if (String(r.status || "open") === "open") {
                  actionNode = (
                    <button
                      type="button"
                      onClick={() => resolve(r.id)}
                      className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      Resolve
                    </button>
                  );
                } else {
                  actionNode = (
                    <button
                      type="button"
                      onClick={() => reopen(r.id)}
                      className="px-3 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition"
                    >
                      Reopen
                    </button>
                  );
                }

                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      {r.type}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">
                        {r.targetName || "—"}
                      </div>
                      <div className="text-xs text-slate-500">{r.targetId}</div>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {r.reason}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      <div className="text-xs text-slate-500">
                        {r.reporterRole || "—"}
                      </div>
                      <div className="font-semibold text-slate-900">
                        {r.reporterName || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {formatDate(r.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          "inline-flex px-3 py-1.5 rounded-full text-xs font-bold border " +
                          badgeClass(r.status)
                        }
                      >
                        {r.status || "open"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {actionNode}
                        <button
                          type="button"
                          onClick={() => del(r.id)}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800
                                     hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition"
                        >
                          Delete
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