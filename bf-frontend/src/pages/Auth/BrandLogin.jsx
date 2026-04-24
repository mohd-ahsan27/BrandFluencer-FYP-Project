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

const BRAND_STORAGE_KEY = "brandfluencer_brand_user";

localStorage.setItem("userRole", "brand");

export default function BrandLogin() {
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

    const raw = localStorage.getItem(BRAND_STORAGE_KEY);
    if (!raw) {
      setError("No brand account found. Please sign up first.");
      return;
    }

    let saved;
    try {
      saved = JSON.parse(raw);
    } catch {
      setError("Stored brand data is corrupted. Please sign up again.");
      return;
    }

    const savedEmail = String(saved?.workEmail || "").trim().toLowerCase();
    const savedPass = String(saved?.password || "").trim();
    const enteredEmail = String(form.email || "").trim().toLowerCase();
    const enteredPass = String(form.password || "").trim();

    if (enteredEmail !== savedEmail) {
      setError("Email not found. Please check your email.");
      return;
    }

    if (enteredPass !== savedPass) {
      setError("Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem(
      "brand_auth",
      JSON.stringify({ loggedIn: true, at: Date.now() })
    );

    localStorage.setItem("userRole", "brand");
    // localStorage.setItem("userName", saved.companyName || saved.fullName || "Brand");

    navigate("/brand-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="hidden lg:block rounded-3xl bg-gradient-to-br from-[#5b2333] via-[#7a2d43] to-[#ff6a00] p-10 text-white shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)]">
          <h1 className="text-4xl font-extrabold leading-tight">
            Welcome back, Brand.
          </h1>
          <p className="mt-4 text-white/85 text-lg">
            Log in to manage campaigns, messages, meetings, and payments in one place.
          </p>

          <div className="mt-10 rounded-2xl bg-white/10 border border-white/15 p-6">
            <p className="text-sm font-semibold text-white/90">
              Tip for demo login
            </p>
            <p className="mt-2 text-sm text-white/80">
              Use the <span className="font-semibold">Work Email</span> and
              <span className="font-semibold"> 6-digit password</span> you entered
              during Brand Sign Up.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Brand Login</h2>
            <p className="mt-1 text-gray-600">Enter your credentials to continue.</p>
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
                placeholder="brand@company.com"
                className="w-full bg-transparent outline-none text-sm text-gray-900"
                autoComplete="email"
              />
            </Field>

            <Field label="Password" icon={<FiLock />}>
              <div className="flex items-center gap-2 w-full">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="6-digit password"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-900"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
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
                  ? "bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white hover:opacity-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              ].join(" ")}
            >
              <FiLogIn />
              Login
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don’t have a brand account?{" "}
              <Link to="/brand-sign-up" className="font-semibold text-indigo-700 hover:underline">
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
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:ring-2 focus-within:ring-orange-200 transition">
        <span className="text-gray-500">{icon}</span>
        {children}
      </div>
    </div>
  );
}