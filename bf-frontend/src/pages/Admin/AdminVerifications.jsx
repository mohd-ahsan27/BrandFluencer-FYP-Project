import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getCreators, setCreatorVerified } from "../../data/creatorsStore";

export default function AdminVerifications() {
  const { adminSearch } = useOutletContext();
  const [refresh, setRefresh] = useState(0);

  const creators = useMemo(() => {
    const list = getCreators();
    if (Array.isArray(list)) return list;
    return [];
  }, [refresh]);

  const filtered = creators.filter((c) => {
    const q = String(adminSearch || "").toLowerCase();
    if (!q) return true;

    const name = String(c.name || "").toLowerCase();
    const email = String(c.email || "").toLowerCase();

    if (name.includes(q)) return true;
    if (email.includes(q)) return true;
    return false;
  });

  function toggle(id, verified) {
    setCreatorVerified(id, !verified);
    setRefresh((r) => r + 1);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm">
      <h2 className="text-xl font-extrabold text-slate-900 mb-6">
        Verification Queue
      </h2>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500">No creators found.</p>
        )}

        {filtered.map((c) => {
          const verified = !!c.verified;

          return (
            <div
              key={c.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50"
            >
              <div>
                <p className="font-bold text-slate-900">{c.name}</p>
                <p className="text-sm text-slate-600">{c.email}</p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={
                    verified
                      ? "text-green-600 font-semibold"
                      : "text-amber-600 font-semibold"
                  }
                >
                  {verified ? "Verified" : "Not Verified"}
                </span>

                <button
                  onClick={() => toggle(c.id, verified)}
                  className={
                    verified
                      ? "px-4 py-2 bg-amber-600 text-white rounded-lg"
                      : "px-4 py-2 bg-emerald-600 text-white rounded-lg"
                  }
                >
                  {verified ? "Unverify" : "Verify"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}