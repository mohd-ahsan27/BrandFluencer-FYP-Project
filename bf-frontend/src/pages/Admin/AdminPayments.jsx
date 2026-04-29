import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPayments, updatePaymentStatus } from "../../data/paymentsStore";

export default function AdminPayments() {
  const { adminSearch } = useOutletContext();
  const [refresh, setRefresh] = useState(0);

  const payments = useMemo(() => getPayments(), [refresh]);

  const filtered = payments.filter((p) => {
    const q = String(adminSearch || "").toLowerCase();
    if (!q) return true;

    const id = String(p.id || "").toLowerCase();
    const status = String(p.status || "").toLowerCase();

    if (id.includes(q)) return true;
    if (status.includes(q)) return true;
    return false;
  });

  function setStatus(id, status) {
    updatePaymentStatus(id, status);
    setRefresh((r) => r + 1);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm">
      <h2 className="text-xl font-extrabold text-slate-900 mb-6">
        Payments
      </h2>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500">No payments found.</p>
        )}

        {filtered.map((p) => (
          <div
            key={p.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50"
          >
            <div>
              <p className="font-bold text-slate-900">
                {p.currency} {p.amount}
              </p>
              <p className="text-sm text-slate-600">
                Status: {p.status}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStatus(p.id, "paid")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Paid
              </button>

              <button
                onClick={() => setStatus(p.id, "failed")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Failed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}