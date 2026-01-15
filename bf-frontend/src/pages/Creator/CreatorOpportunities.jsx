import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const STORAGE_KEY = "creator_dashboard_opportunities_v1";

const SEED = [
  { id: 1, brand: "GlowCare", title: "Skincare Product Launch", budget: "USD 400", status: "Open" },
  { id: 2, brand: "TechNova", title: "Gadget Review", budget: "USD 600", status: "Open" },
  { id: 3, brand: "FitFuel", title: "Fitness Awareness", budget: "PKR 45000", status: "Open" },
];

export default function CreatorOpportunities() {
  const { creator } = useOutletContext();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setItems(Array.isArray(parsed) ? parsed : SEED);
        return;
      } catch {}
    }
    setItems(SEED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Opportunities</h1>
        <p className="mt-2 text-slate-600">
          Recommended for: <span className="font-semibold">{creator.fullName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((o) => (
          <div key={o.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500">{o.brand}</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{o.title}</h2>
            <p className="mt-2 text-sm text-slate-700">Budget: {o.budget}</p>
            <p className="mt-2 text-xs text-slate-500">Status: {o.status}</p>

            <button className="mt-4 px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold">
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}