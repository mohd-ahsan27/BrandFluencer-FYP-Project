import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiAlertCircle,
} from "react-icons/fi";

const CREATOR_PROFILE_KEY = "creator_profile";

localStorage.setItem("userRole", "creator");

export default function CreatorLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return form.email.trim().length > 0 && form.password.trim().length > 0;
  }, [form.email, form.password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const raw = localStorage.getItem(CREATOR_PROFILE_KEY);
    if (!raw) {
      setError("No creator account found. Please sign up first.");
      return;
    }

    let saved;
    try {
      saved = JSON.parse(raw);
    } catch {
      setError("Stored creator data is corrupted. Please sign up again.");
      return;
    }

    const savedEmail = String(saved?.email || saved?.email || "").trim().toLowerCase();
    const savedPass = String(saved?.password || "").trim();
    const enteredEmail = String(form.email || "").trim().toLowerCase();
    const enteredPass = String(form.password || "").trim();

    if (!savedEmail) {
      setError("Creator profile is missing email. Please sign up again.");
      return;
    }

    if (!savedPass) {
      setError("Password is not saved in creator profile. Please sign up again.");
      return;
    }

    if (enteredEmail !== savedEmail) {
      setError("Email not found. Please check your email.");
      return;
    }

    if (enteredPass !== savedPass) {
      setError("Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem(
      "creator_auth",
      JSON.stringify({ loggedIn: true, at: Date.now() })
    );

    localStorage.setItem("userRole", "creator");
    // localStorage.setItem("userName", saved.fullName || saved.name || "Creator");

    navigate("/creator-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-indigo-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="hidden lg:block rounded-3xl bg-gradient-to-br from-sky-600 via-indigo-600 to-fuchsia-600 p-10 text-white shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)]">
          <h1 className="text-4xl font-extrabold leading-tight">
            Welcome back, Creator.
          </h1>
          <p className="mt-4 text-white/85 text-lg">
            Log in to manage your profile, opportunities, campaigns, messages, and earnings.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Creator Login
            </h2>
            <p className="mt-1 text-slate-600">
              Enter your credentials to continue.
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2">
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
                placeholder="creator@email.com"
                className="w-full bg-transparent outline-none text-sm text-slate-900"
                autoComplete="email"
              />
            </Field>

            <Field label="Password" icon={<FiLock />}>
              <div className="flex items-center gap-2 w-full">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Your password"
                  className="flex-1 bg-transparent outline-none text-sm text-slate-900"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition"
                  title={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold transition shadow-sm",
                canSubmit
                  ? "bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 text-white hover:opacity-95"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed",
              ].join(" ")}
            >
              <FiLogIn />
              Login
            </button>

            <p className="text-sm text-slate-600 text-center">
              Don’t have a creator account?{" "}
              <Link to="/creator-sign-up" className="font-semibold text-indigo-700 hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-800">{label}</label>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-200 transition">
        <span className="text-slate-500">{icon}</span>
        {children}
      </div>
    </div>
  );
}