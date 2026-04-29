import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiLogIn, FiAlertCircle } from "react-icons/fi";

const ADMIN_AUTH_KEY = "admin_auth";
const ADMIN_PROFILE_KEY = "admin_profile";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (!form.email.trim()) return false;
    if (!form.password.trim()) return false;
    return true;
  }, [form.email, form.password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const email = String(form.email || "").trim().toLowerCase();
    const pass = String(form.password || "").trim();

    const okEmail = email === "admin@brandfluencer.com";
    const okPass = pass === "admin123";

    if (!okEmail || !okPass) {
      setError("Invalid admin credentials.");
      return;
    }

    localStorage.setItem(
      ADMIN_AUTH_KEY,
      JSON.stringify({ loggedIn: true, at: Date.now() })
    );

    const existingProfile = localStorage.getItem(ADMIN_PROFILE_KEY);
    if (!existingProfile) {
      localStorage.setItem(
        ADMIN_PROFILE_KEY,
        JSON.stringify({
          name: "Admin",
          email: "admin@brandfluencer.com",
          updatedAt: Date.now(),
        })
      );
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-6">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600" />
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Use demo credentials to access the admin panel.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2">
            <FiAlertCircle className="text-red-600 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email" icon={<FiMail />}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-transparent outline-none text-sm text-slate-900"
              placeholder="admin@brandfluencer.com"
            />
          </Field>

          <Field label="Password" icon={<FiLock />}>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full bg-transparent outline-none text-sm text-slate-900"
              placeholder="admin123"
            />
          </Field>

          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold transition",
              canSubmit
                ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:brightness-110"
                : "bg-slate-100 text-slate-400 cursor-not-allowed",
            ].join(" ")}
          >
            <FiLogIn />
            Login
          </button>

          <div className="text-xs text-slate-500">
            Demo: admin@brandfluencer.com / admin123
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-800">{label}</label>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-sky-200 transition">
        <span className="text-slate-500">{icon}</span>
        {children}
      </div>
    </div>
  );
}