import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getCreators } from "../../data/creatorsStore";
import {
  isCreatorBlocked,
  setCreatorBlocked,
  isBrandBlocked,
  setBrandBlocked,
} from "../../data/adminFlagsStore";

const BRAND_USER_KEY = "brandfluencer_brand_user";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function Badge({ text, variant }) {
  let cls = "inline-flex px-3 py-1.5 rounded-full text-xs font-bold border ";
  if (variant === "blocked") {
    cls += "bg-rose-50 text-rose-700 border-rose-200";
  } else {
    cls += "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  return <span className={cls}>{text}</span>;
}

export default function AdminUsers() {
  const { adminSearch } = useOutletContext();
  const [tab, setTab] = useState("creators");
  const [tick, setTick] = useState(0);

  const creators = useMemo(() => {
    try {
      const list = getCreators();
      if (Array.isArray(list)) return list;
      return [];
    } catch {
      return [];
    }
  }, []);

  const brandUser = useMemo(() => {
    const raw = localStorage.getItem(BRAND_USER_KEY);
    return safeParse(raw, null);
  }, []);

  const creatorsFiltered = useMemo(() => {
    const q = String(adminSearch || "").trim().toLowerCase();
    const list = Array.isArray(creators) ? creators : [];
    if (!q) return list;

    return list.filter((c) => {
      const name = String(c.name || c.fullName || "").toLowerCase();
      const email = String(c.email || "").toLowerCase();
      const cats = Array.isArray(c.categories)
        ? c.categories.join(" ").toLowerCase()
        : "";
      if (name.includes(q)) return true;
      if (email.includes(q)) return true;
      if (cats.includes(q)) return true;
      return false;
    });
  }, [creators, adminSearch, tick]);

  const brandFiltered = useMemo(() => {
    if (!brandUser) return null;

    const q = String(adminSearch || "").trim().toLowerCase();
    if (!q) return brandUser;

    const company = String(
      brandUser.companyName || brandUser.fullName || ""
    ).toLowerCase();
    const email = String(brandUser.workEmail || "").toLowerCase();
    const cats = Array.isArray(brandUser.categories)
      ? brandUser.categories.join(" ").toLowerCase()
      : "";

    if (company.includes(q)) return brandUser;
    if (email.includes(q)) return brandUser;
    if (cats.includes(q)) return brandUser;

    return null;
  }, [brandUser, adminSearch, tick]);

  const toggleCreator = (id) => {
    const blocked = isCreatorBlocked(id);
    if (blocked) setCreatorBlocked(id, false);
    else setCreatorBlocked(id, true);
    setTick((t) => t + 1);
  };

  const toggleBrand = (key) => {
    const blocked = isBrandBlocked(key);
    if (blocked) setBrandBlocked(key, false);
    else setBrandBlocked(key, true);
    setTick((t) => t + 1);
  };

  let creatorsBtnCls =
    "px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition";
  let brandsBtnCls =
    "px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition";

  if (tab === "creators") {
    creatorsBtnCls =
      "px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-sm hover:brightness-110 transition";
  } else {
    brandsBtnCls =
      "px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-sm hover:brightness-110 transition";
  }

  let creatorsTable = null;
  if (tab === "creators") {
    creatorsTable = (
      <div className="overflow-x-auto">
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="min-w-[900px] w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-bold text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Categories</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {creatorsFiltered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm text-slate-600">
                    No creators found.
                  </td>
                </tr>
              ) : null}

              {creatorsFiltered.map((c) => {
                const id = c.id;
                const name = c.name || c.fullName || "—";
                const email = c.email || "—";
                const cats = Array.isArray(c.categories)
                  ? c.categories.slice(0, 4).join(", ")
                  : "—";

                const blocked = isCreatorBlocked(id);

                let statusNode = <Badge text="Active" variant="active" />;
                if (blocked) statusNode = <Badge text="Blocked" variant="blocked" />;

                let actionCls =
                  "px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition";
                let actionText = "Block";
                if (blocked) {
                  actionCls =
                    "px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition";
                  actionText = "Unblock";
                }

                return (
                  <tr key={String(id)} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      {name}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{email}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{cats}</td>
                    <td className="px-4 py-4">{statusNode}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleCreator(id)}
                        className={actionCls}
                      >
                        {actionText}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  let brandsTable = null;
  if (tab === "brands") {
    brandsTable = (
      <div className="overflow-x-auto">
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <table className="min-w-[900px] w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-bold text-slate-500">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Work Email</th>
                <th className="px-4 py-3">Industries</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {brandFiltered ? (
                (() => {
                  const company =
                    brandFiltered.companyName || brandFiltered.fullName || "—";
                  const email = brandFiltered.workEmail || "—";
                  const cats = Array.isArray(brandFiltered.categories)
                    ? brandFiltered.categories.slice(0, 5).join(", ")
                    : "—";

                  const key = String(email || company);
                  const blocked = isBrandBlocked(key);

                  let statusNode = <Badge text="Active" variant="active" />;
                  if (blocked) statusNode = <Badge text="Blocked" variant="blocked" />;

                  let actionCls =
                    "px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition";
                  let actionText = "Block";
                  if (blocked) {
                    actionCls =
                      "px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition";
                    actionText = "Unblock";
                  }

                  return (
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                        {company}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{email}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{cats}</td>
                      <td className="px-4 py-4">{statusNode}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => toggleBrand(key)}
                          className={actionCls}
                        >
                          {actionText}
                        </button>
                      </td>
                    </tr>
                  );
                })()
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm text-slate-600">
                    No brands found (demo uses single stored brand profile).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-100 bg-gradient-to-b from-white to-cyan-50 p-4">
          <p className="text-xs font-bold text-cyan-800">Note</p>
          <p className="mt-1 text-xs text-slate-700">
            Brand list is currently demo (single stored brand user). In backend version, this will be a full database list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Users</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage creators and brands (block/unblock demo).
          </p>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setTab("creators")} className={creatorsBtnCls}>
            Creators
          </button>
          <button type="button" onClick={() => setTab("brands")} className={brandsBtnCls}>
            Brands
          </button>
        </div>
      </div>

      <div className="mt-6">
        {creatorsTable}
        {brandsTable}
      </div>
    </div>
  );
}