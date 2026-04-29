import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getMeetings, updateMeetingStatus } from "../../data/meetingsStore";

export default function AdminMeetings() {
  const { adminSearch } = useOutletContext();
  const [refresh, setRefresh] = useState(0);

  const meetings = useMemo(() => getMeetings(), [refresh]);

  const filtered = meetings.filter((m) => {
    const q = String(adminSearch || "").toLowerCase();
    if (!q) return true;

    const id = String(m.id || "").toLowerCase();
    const title = String(m.title || "").toLowerCase();

    if (id.includes(q)) return true;
    if (title.includes(q)) return true;
    return false;
  });

  function setStatus(id, status) {
    updateMeetingStatus(id, status);
    setRefresh((r) => r + 1);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm">
      <h2 className="text-xl font-extrabold text-slate-900 mb-6">
        Meetings
      </h2>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500">No meetings found.</p>
        )}

        {filtered.map((m) => (
          <div
            key={m.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50"
          >
            <div>
              <p className="font-bold text-slate-900">{m.title}</p>
              <p className="text-sm text-slate-600">Status: {m.status}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStatus(m.id, "approved")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Approve
              </button>

              <button
                onClick={() => setStatus(m.id, "rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}