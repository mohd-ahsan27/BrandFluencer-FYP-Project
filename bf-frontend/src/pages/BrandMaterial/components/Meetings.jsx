import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiVideo,
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiExternalLink,
  FiSearch,
} from "react-icons/fi";

const STORAGE_KEY = "brand_dashboard_meetings_v1";

const MEETING_TYPES = ["Online", "In-Person"];
const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];

function safeId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return String(Date.now() + Math.random());
}

function normalizeUrl(url) {
  const v = String(url || "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function formatPrettyDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

function statusBadge(status) {
  switch (status) {
    case "Scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function Meetings() {
  const outlet = useOutletContext() || {};
  const brandName = outlet.brandName || "Brand";

  const [meetings, setMeetings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    influencerName: "",
    campaignName: "",
    meetingType: "Online",
    date: "",
    time: "",
    durationMinutes: "30",
    meetingLink: "",
    location: "",
    notes: "",
    status: "Scheduled",
  });

  // Load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setMeetings([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setMeetings(Array.isArray(parsed) ? parsed : []);
    } catch {
      setMeetings([]);
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch {
      // ignore storage errors
    }
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = [...(meetings || [])].sort((a, b) => {
      const ad = `${a.date || ""} ${a.time || ""}`.trim();
      const bd = `${b.date || ""} ${b.time || ""}`.trim();
      return bd.localeCompare(ad);
    });

    if (!q) return list;

    return list.filter((m) => {
      return (
        String(m.influencerName || "").toLowerCase().includes(q) ||
        String(m.campaignName || "").toLowerCase().includes(q) ||
        String(m.meetingType || "").toLowerCase().includes(q) ||
        String(m.status || "").toLowerCase().includes(q)
      );
    });
  }, [meetings, query]);

  const isOnline = form.meetingType === "Online";
  const isInPerson = form.meetingType === "In-Person";

  const resetForm = () => {
    setEditingId(null);
    setError("");
    setForm({
      influencerName: "",
      campaignName: "",
      meetingType: "Online",
      date: "",
      time: "",
      durationMinutes: "30",
      meetingLink: "",
      location: "",
      notes: "",
      status: "Scheduled",
    });
  };

  const validate = () => {
    setError("");

    if (!form.influencerName.trim()) return "Influencer name is required.";
    if (!form.date) return "Date is required.";
    if (!form.time) return "Time is required.";

    const dur = Number(form.durationMinutes);
    if (!Number.isFinite(dur) || dur <= 0) return "Duration must be greater than 0 minutes.";

    if (isOnline) {
      if (!form.meetingLink.trim()) return "Meeting link is required for Online meetings.";
      const href = normalizeUrl(form.meetingLink);
      if (!/^https?:\/\//i.test(href)) return "Please enter a valid meeting link.";
    }

    if (isInPerson) {
      if (!form.location.trim()) return "Location is required for In-Person meetings.";
    }

    return "";
  };

  const submit = (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const existing = editingId ? meetings.find((m) => m.id === editingId) : null;

    const payload = {
      id: editingId || safeId(),
      influencerName: form.influencerName.trim(),
      campaignName: form.campaignName.trim(),
      meetingType: form.meetingType,
      date: form.date,
      time: form.time,
      durationMinutes: Number(form.durationMinutes),
      meetingLink: form.meetingType === "Online" ? form.meetingLink.trim() : "",
      location: form.meetingType === "In-Person" ? form.location.trim() : "",
      notes: form.notes.trim(),
      status: form.status,
      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    if (editingId) {
      setMeetings((prev) => prev.map((m) => (m.id === editingId ? payload : m)));
    } else {
      setMeetings((prev) => [payload, ...prev]);
    }

    resetForm();
  };

  const startEdit = (id) => {
    const m = meetings.find((x) => x.id === id);
    if (!m) return;

    setEditingId(id);
    setError("");
    setForm({
      influencerName: m.influencerName || "",
      campaignName: m.campaignName || "",
      meetingType: m.meetingType || "Online",
      date: m.date || "",
      time: m.time || "",
      durationMinutes: String(m.durationMinutes ?? "30"),
      meetingLink: m.meetingLink || "",
      location: m.location || "",
      notes: m.notes || "",
      status: m.status || "Scheduled",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeMeeting = (id) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    if (editingId === id) resetForm();
  };

  const markCompleted = (id) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Completed", updatedAt: Date.now() } : m))
    );
  };

  const cancelMeeting = (id) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Cancelled", updatedAt: Date.now() } : m))
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-[#5b2333]">Meetings</h1>
        <p className="mt-1 text-gray-600">
          Schedule calls with influencers, track status, and keep links/locations in one place.
        </p>
        <p className="mt-1 text-xs text-gray-500">Brand: {brandName}</p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId ? "Edit Meeting" : "Schedule Meeting"}
          </h2>

          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-sm"
            >
              Cancel Edit
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs text-gray-500">
              <FiPlus />
              New meeting
            </div>
          )}
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Influencer Name">
            <input
              value={form.influencerName}
              onChange={(e) => setForm((p) => ({ ...p, influencerName: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="e.g., Sarah Jenkins"
            />
          </Field>

          <Field label="Campaign (optional)">
            <input
              value={form.campaignName}
              onChange={(e) => setForm((p) => ({ ...p, campaignName: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="e.g., Product Launch"
            />
          </Field>

          <Field label="Meeting Type">
            <select
              value={form.meetingType}
              onChange={(e) => setForm((p) => ({ ...p, meetingType: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
            >
              {MEETING_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Date">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </Field>

          <Field label="Time">
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </Field>

          <Field label="Duration (minutes)">
            <input
              type="number"
              min="1"
              value={form.durationMinutes}
              onChange={(e) => setForm((p) => ({ ...p, durationMinutes: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="30"
            />
          </Field>

          {isOnline ? (
            <Field label="Meeting Link">
              <div className="relative">
                <FiVideo className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.meetingLink}
                  onChange={(e) => setForm((p) => ({ ...p, meetingLink: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Zoom/Google Meet link"
                />
              </div>
            </Field>
          ) : (
            <Field label="Location">
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Address or place name"
                />
              </div>
            </Field>
          )}

          <div className="md:col-span-2">
            <Field label="Notes (optional)">
              <textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                rows={3}
                placeholder="Agenda, deliverables, approvals, etc."
              />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white font-semibold hover:opacity-95 transition"
        >
          <FiPlus />
          {editingId ? "Update Meeting" : "Create Meeting"}
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#5b2333]">All Meetings</h3>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 w-72 max-w-full">
            <FiSearch className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meetings..."
              className="w-full bg-transparent outline-none text-sm text-gray-700"
            />
          </div>
        </div>

        {filteredMeetings.length === 0 ? (
          <div className="p-6 text-gray-500">No meetings yet. Schedule one above.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMeetings.map((m) => {
              const onlineHref =
                m.meetingType === "Online" ? normalizeUrl(m.meetingLink) : "";

              return (
                <div key={m.id} className="px-6 py-5 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900">{m.influencerName}</p>

                        <span
                          className={`px-2 py-1 rounded-full text-xs border ${statusBadge(
                            m.status
                          )}`}
                        >
                          {m.status}
                        </span>

                        {m.campaignName ? (
                          <span className="text-xs text-gray-500">
                            • Campaign: {m.campaignName}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-700">
                        <span className="inline-flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {formatPrettyDate(m.date)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <FiClock className="text-gray-400" />
                          {m.time || "—"} • {m.durationMinutes} min
                        </span>

                        {m.meetingType === "Online" ? (
                          <span className="inline-flex items-center gap-2">
                            <FiVideo className="text-gray-400" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <FiMapPin className="text-gray-400" />
                            In-Person
                          </span>
                        )}
                      </div>

                      {m.meetingType === "Online" ? (
                        <div className="mt-3">
                          {onlineHref ? (
                            <a
                              href={onlineHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-[#ff6a00] hover:underline"
                            >
                              <FiExternalLink />
                              Open meeting link
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500">No meeting link.</p>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3">
                          <p className="text-sm text-gray-700">
                            <span className="text-gray-500">Location:</span>{" "}
                            {m.location || "—"}
                          </p>
                        </div>
                      )}

                      {m.notes ? (
                        <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">
                          {m.notes}
                        </p>
                      ) : null}
                    </div>

                    <div className="shrink-0 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(m.id)}
                        className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-white transition text-sm inline-flex items-center gap-2"
                      >
                        <FiEdit2 />
                        Edit
                      </button>

                      {m.status !== "Completed" ? (
                        <button
                          type="button"
                          onClick={() => markCompleted(m.id)}
                          className="px-3 py-2 rounded-xl border border-green-200 bg-green-50 text-green-800 hover:bg-green-100 transition text-sm inline-flex items-center gap-2"
                        >
                          <FiCheckCircle />
                          Complete
                        </button>
                      ) : null}

                      {m.status !== "Cancelled" ? (
                        <button
                          type="button"
                          onClick={() => cancelMeeting(m.id)}
                          className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition text-sm inline-flex items-center gap-2"
                        >
                          <FiXCircle />
                          Cancel
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => removeMeeting(m.id)}
                        className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-sm inline-flex items-center gap-2 text-gray-700"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}