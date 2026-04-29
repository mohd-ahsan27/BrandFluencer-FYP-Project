import React, { useMemo } from "react";
import { getReports } from "../../data/reportStore";
import { getCreators } from "../../data/creatorsStore";

const CAMPAIGNS_KEY = "brand_dashboard_campaigns";

export default function AdminAnalytics() {
  const creators = useMemo(() => getCreators(), []);
  const reports = useMemo(() => getReports(), []);
  const campaigns = useMemo(() => {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [];
  }, []);

  const verifiedCount = creators.filter((c) => c.verified).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm">
      <h2 className="text-xl font-extrabold text-slate-900 mb-6">
        Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Creators" value={creators.length} />
        <Card title="Verified Creators" value={verifiedCount} />
        <Card title="Campaigns" value={campaigns.length} />
        <Card title="Reports" value={reports.length} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <p className="text-3xl font-extrabold text-slate-900 mt-2">{value}</p>
    </div>
  );
}