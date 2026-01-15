// src/pages/CreatorMaterials/components/CreatorEarnings.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiDollarSign, FiTrendingUp, FiDownload, FiCreditCard } from "react-icons/fi";

const STORAGE_KEY = "creator_dashboard_earnings_v1";

/**
 * This is a simple, clean Earnings page for the Creator Dashboard.
 * - Reads creator pricing currency from creator_profile (via Outlet context)
 * - Stores earnings items locally (localStorage) so it persists after refresh
 * - Shows: Total Earned, Pending, Paid, Recent Transactions
 */
export default function CreatorEarnings() {
  const outlet = useOutletContext?.() || {};
  const creator = outlet.creator || {};

  const currency = creator?.pricing?.currency || "USD";

  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All"); // All | Pending | Paid

  // Load (or seed)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setItems(Array.isArray(parsed) ? parsed : []);
        return;
      } catch {}
    }

    // Seed demo data
    const seed = [
      {
        id: 1,
        brand: "GlowCare",
        title: "Skincare Product Launch",
        amount: 250,
        currency: "USD",
        status: "Paid",
        date: "2026-01-01",
      },
      {
        id: 2,
        brand: "FitFuel",
        title: "Fitness Awareness",
        amount: 45000,
        currency: "PKR",
        status: "Pending",
        date: "2026-01-03",
      },
      {
        id: 3,
        brand: "TechNova",
        title: "Gadget Review",
        amount: 400,
        currency: "USD",
        status: "Paid",
        date: "2026-01-04",
      },
    ];

    setItems(seed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const filtered = useMemo(() => {
    if (statusFilter === "All") return items;
    return items.filter((x) => x.status === statusFilter);
  }, [items, statusFilter]);

  // Totals (separate by currency)
  const totals = useMemo(() => {
    let usdPaid = 0;
    let usdPending = 0;
    let pkrPaid = 0;
    let pkrPending = 0;

    for (const it of items) {
      const c = String(it.currency || "USD").toUpperCase();
      const amt = Number(it.amount || 0);
      const isPaid = it.status === "Paid";

      if (c === "PKR") {
        if (isPaid) pkrPaid += amt;
        else pkrPending += amt;
      } else {
        if (isPaid) usdPaid += amt;
        else usdPending += amt;
      }
    }

    return { usdPaid, usdPending, pkrPaid, pkrPending };
  }, [items]);

  const exportCSV = () => {
    // basic CSV export (client-side)
    const headers = ["Date", "Brand", "Title", "Currency", "Amount", "Status"];
    const rows = items.map((x) => [
      x.date || "",
      x.brand || "",
      x.title || "",
      String(x.currency || ""),
      String(x.amount || ""),
      x.status || "",
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "creator-earnings.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Earnings</h1>
            <p className="mt-1 text-slate-600">
              Track your payments and pending payouts. (Local demo storage)
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Profile currency: <span className="font-semibold">{currency}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition font-semibold"
          >
            <FiDownload />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <SummaryCard
          title="Paid (USD)"
          value={`USD ${totals.usdPaid.toLocaleString()}`}
          icon={<FiDollarSign />}
        />
        <SummaryCard
          title="Pending (USD)"
          value={`USD ${totals.usdPending.toLocaleString()}`}
          icon={<FiTrendingUp />}
        />
        <SummaryCard
          title="Paid (PKR)"
          value={`PKR ${totals.pkrPaid.toLocaleString()}`}
          icon={<FiCreditCard />}
        />
        <SummaryCard
          title="Pending (PKR)"
          value={`PKR ${totals.pkrPending.toLocaleString()}`}
          icon={<FiTrendingUp />}
        />
      </div>

      {/* Filters + Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Transactions</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6 text-slate-600">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((x) => (
                  <tr key={x.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-slate-700">{x.date || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {x.brand || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{x.title || "—"}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">
                      {String(x.currency || "USD").toUpperCase()}{" "}
                      {Number(x.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={[
                          "px-2.5 py-1 rounded-full text-xs font-semibold border",
                          x.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200",
                        ].join(" ")}
                      >
                        {x.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 font-semibold">{title}</p>
        <span className="text-slate-500">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function escapeCSV(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}