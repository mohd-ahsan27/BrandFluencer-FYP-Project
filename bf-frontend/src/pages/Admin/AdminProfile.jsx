import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiShield, FiClock, FiSave, FiLogOut } from "react-icons/fi";

const ADMIN_AUTH_KEY = "admin_auth";
const ADMIN_PROFILE_KEY = "admin_profile";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function formatDate(ms) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "—";
  }
}

export default function AdminProfile() {
  const navigate = useNavigate();

  const auth = useMemo(() => safeParse(localStorage.getItem(ADMIN_AUTH_KEY), null), []);
  const storedProfile = useMemo(() => safeParse(localStorage.getItem(ADMIN_PROFILE_KEY), null), []);

  const [form, setForm] = useState(() => {
    const base = storedProfile || {};
    const name = base.name || "Admin";
    const email = base.email || "admin@brandfluencer.com";
    return { name, email };
  });

  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (!auth || auth.loggedIn !== true) {
      navigate("/admin-login");
    }
  }, [auth, navigate]);

  const roleLabel = "Administrator";

  let lastLogin = "—";
  if (auth && auth.at) lastLogin = formatDate(auth.at);

  const onSave = (e) => {
    e.preventDefault();
    setSavedMsg("");

    const name = String(form.name || "").trim();
    const email = String(form.email || "").trim();

    if (!name) {
      alert("Name is required.");
      return;
    }

    if (!email) {
      alert("Email is required.");
      return;
    }

    const looksValid = /^\S+@\S+\.\S+$/.test(email);
    if (!looksValid) {
      alert("Please enter a valid email.");
      return;
    }

    const payload = { name, email, updatedAt: Date.now() };
    localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(payload));

    setSavedMsg("Profile saved.");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const onLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    navigate("/admin-login");
  };

  let savedNode = null;
  if (savedMsg) {
    savedNode = <p className="text-sm font-semibold text-emerald-600">{savedMsg}</p>;
  }

  return (
    <div className="min-h-[calc(100vh-0px)]">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Admin Profile</h1>
        <p className="mt-1 text-white/80 text-sm">
          Update admin identity and review login details.
        </p>

        <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900">Details</h2>

          <form onSubmit={onSave} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Name</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-200 focus-within:border-cyan-300 transition">
                <FiUser className="text-slate-500" />
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full outline-none bg-transparent text-sm text-slate-900"
                  placeholder="Admin name"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-200 focus-within:border-cyan-300 transition">
                <FiMail className="text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full outline-none bg-transparent text-sm text-slate-900"
                  placeholder="admin@brandfluencer.com"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-white
                           bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 transition shadow-sm"
              >
                <FiSave />
                Save
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold
                           border border-slate-200 bg-white text-slate-800 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition"
              >
                <FiLogOut />
                Logout
              </button>
            </div>

            {savedNode}
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900">Account</h2>

          <div className="mt-5 space-y-3">
            <InfoRow icon={<FiShield />} label="Role" value={roleLabel} />
            <InfoRow icon={<FiClock />} label="Last login" value={lastLogin} />
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-100 bg-gradient-to-b from-white to-cyan-50 p-4">
            <p className="text-xs font-bold text-cyan-800">Tip</p>
            <p className="mt-1 text-xs text-slate-700">
              Admin controls are available from the sidebar: reports, users, campaigns, verifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mt-0.5 text-slate-500">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}