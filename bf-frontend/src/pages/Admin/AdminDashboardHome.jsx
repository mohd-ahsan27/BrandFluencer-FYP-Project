import React, { useMemo } from "react";
import { getReports } from "../../data/reportStore";
import { getCreators } from "../../data/creatorsStore";

const BRAND_USER_KEY = "brandfluencer_brand_user";
const CAMPAIGNS_KEY = "brand_dashboard_campaigns";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export default function AdminDashboardHome() {
  const creatorsCount = useMemo(() => {
    try {
      const list = getCreators();
      if (Array.isArray(list)) return list.length;
      return 0;
    } catch {
      return 0;
    }
  }, []);

  const brandsCount = useMemo(() => {
    const raw = localStorage.getItem(BRAND_USER_KEY);
    if (!raw) return 0;
    const obj = safeParse(raw, null);
    if (!obj) return 0;
    return 1;
  }, []);

  const campaignsCount = useMemo(() => {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    const arr = safeParse(raw, []);
    if (Array.isArray(arr)) return arr.length;
    return 0;
  }, []);

  const openReportsCount = useMemo(() => {
    const list = getReports();
    let count = 0;
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].status === "open") count += 1;
    }
    return count;
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <Kpi title="Creators" value={creatorsCount} tone="normal" />
      <Kpi title="Brands" value={brandsCount} tone="normal" />
      <Kpi title="Campaigns" value={campaignsCount} tone="normal" />
      <Kpi title="Open Reports" value={openReportsCount} tone="accent" />
    </div>
  );
}

function Kpi({ title, value, tone }) {
  let box = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";
  let topBar = "h-1.5 w-full rounded-full bg-slate-200";
  let titleCls = "text-sm font-semibold text-slate-600";
  let valueCls = "mt-2 text-3xl font-extrabold text-slate-900";

  if (tone === "accent") {
    box = "rounded-3xl border border-cyan-100 bg-gradient-to-b from-white to-cyan-50 p-6 shadow-sm";
    topBar = "h-1.5 w-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500";
    titleCls = "text-sm font-semibold text-slate-700";
    valueCls = "mt-2 text-3xl font-extrabold text-slate-900";
  }

  return (
    <div className={box}>
      <div className={topBar} />
      <p className={"mt-4 " + titleCls}>{title}</p>
      <p className={valueCls}>{String(value)}</p>
      <p className="mt-2 text-xs text-slate-500">
        Updated from localStorage (demo)
      </p>
    </div>
  );
}