
import React, { useEffect, useState } from "react";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaSnapchatGhost,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Fashion","Beauty","Lifestyle","Travel","Food","Fitness","Health","Tech","Gaming",
  "Photography","Parenting","Education","Finance","Music","Pets","Art","Design",
  "Sports","Movies","Books","Home Decor","Luxury","Marketing","Nature","Comedy",
];

const MAX_CATEGORIES = 5;
const DRAFT_KEY = "brandfluencer_creator_draft_v6";

export default function CreatorSignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    socials: {
      instagram: { handle: "" },
      youtube: { handle: "" },
      tiktok: { handle: "" },
      facebook: { handle: "" },
      // snapchat: { handle: "" }, // ✅ Added Snapchat to sign-up
    },
    categories: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  const validateStep = (s = step) => {
    const e = {};
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = "Full name required.";
      if (!form.email.trim()) e.email = "Email required.";
      else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(form.email))
        e.email = "Invalid email format.";
      if (!form.password) e.password = "Password required.";
      else if (form.password.length < 6) e.password = "Min 6 characters.";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Passwords do not match.";
    } else if (s === 2) {
      if (form.categories.length < 1) e.categories = "Select at least 1 category.";
      if (form.categories.length > MAX_CATEGORIES)
        e.categories = `Select up to ${MAX_CATEGORIES} categories.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    const ok = validateStep(step);
    if (ok) {
      const ns = Math.min(2, step + 1);
      setStep(ns);
    }
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const updateSocial = (k, val) =>
    setForm((f) => ({
      ...f,
      socials: { ...f.socials, [k]: { handle: val } },
    }));

  const toggleCat = (cat) =>
    setForm((f) => {
      const has = f.categories.includes(cat);
      let next;
      if (has) next = f.categories.filter((c) => c !== cat);
      else next = [...f.categories, cat];
      if (next.length > MAX_CATEGORIES) return f;
      return { ...f, categories: next };
    });

  const submit = () => {
    const ok = validateStep(2);
    if (!ok) {
      setStep(2);
      return;
    }
    try {
      localStorage.setItem("creator_profile", JSON.stringify(form));
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      try {
        sessionStorage.setItem("creator_profile", JSON.stringify(form));
      } catch {}
    }
    navigate("/creator-profile");
  };

  const StepTitle = ({ text }) => (
    <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3">{text}</h3>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-10 bg-gradient-to-br from-[#eef2ff] via-[#e0f7ff] to-[#ffe8ef]">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl p-6 sm:p-10">
        {/* Stepper */}
        <div className="flex flex-wrap justify-between mb-8 gap-2">
          {["Personal", "Socials", "Categories"].map((lbl, i) => {
            const active = i === step;
            const done = i < step;
            let circleClass = "bg-gray-200 text-gray-600";
            if (done) circleClass = "bg-gradient-to-r from-sky-500 to-violet-500 text-white";
            else if (active) circleClass = "bg-sky-100 text-sky-800";
            return (
              <div key={lbl} className="flex flex-col items-center flex-1 min-w-[60px]">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${circleClass}`}>
                  {i + 1}
                </div>
                <span className={`text-xs ${active ? "text-sky-700 font-semibold" : "text-gray-600"}`}>
                  {lbl}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-inner p-5 sm:p-8">
          {/* Step 0: Personal */}
          {step === 0 && (
            <>
              <StepTitle text="Personal Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="fullName"
                  label="Full Name (Required)"
                  value={form.fullName}
                  onChange={(v) => handleChange("fullName", v)}
                  error={errors.fullName}
                />
                <Input
                  id="email"
                  label="Email (Required)"
                  type="email"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                  error={errors.email}
                />
                <PasswordField
                  label="Password (Required)"
                  value={form.password}
                  onChange={(v) => handleChange("password", v)}
                  error={errors.password}
                />
                <PasswordField
                  label="Confirm Password (Required)"
                  value={form.confirmPassword}
                  onChange={(v) => handleChange("confirmPassword", v)}
                  error={errors.confirmPassword}
                />
              </div>
            </>
          )}

          {/* Step 1: Socials */}
          {step === 1 && (
            <>
              <StepTitle text="Social Media Handles (Optional)" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { k: "instagram", label: "Instagram", Icon: FaInstagram, color: "text-pink-600" },
                  { k: "youtube", label: "YouTube", Icon: FaYoutube, color: "text-red-600" },
                  { k: "tiktok", label: "TikTok", Icon: FaTiktok, color: "text-black" },
                  { k: "facebook", label: "Facebook", Icon: FaFacebook, color: "text-blue-600" },
                  // { k: "snapchat", label: "Snapchat", Icon: FaSnapchatGhost, color: "text-yellow-500" }, // ✅ Snapchat
                ].map(({ k, label, Icon, color }) => (
                  <div key={k} className="bg-sky-50 rounded-lg border border-sky-100 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`text-2xl ${color}`} />
                      <span className="font-medium text-base">{label}</span>
                    </div>
                    <input
                      value={form.socials[k].handle}
                      onChange={(e) => updateSocial(k, e.target.value)}
                      placeholder="@yourhandle"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Categories (slightly larger box) */}
          {step === 2 && (
            <>
              <StepTitle text="Categories (1 to 5)" />
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">
                  Select at least 1 and at most {MAX_CATEGORIES} categories that best describe your niche.
                </p>
                <span className="text-sm font-semibold">
                  {form.categories.length}/{MAX_CATEGORIES} selected
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 p-6 bg-slate-50">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => {
                    const selected = form.categories.includes(cat);
                    const disabled = !selected && form.categories.length >= MAX_CATEGORIES;
                    let btnClass = "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200";
                    if (selected) btnClass = "bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow scale-105";
                    if (disabled) btnClass += " opacity-60 cursor-not-allowed";
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCat(cat)}
                        disabled={disabled}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${btnClass}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
              {errors.categories && (
                <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
              )}
            </>
          )}
        </div>

        {/* Footer buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 w-full sm:w-auto"
            >
              Back
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={next}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold hover:opacity-90 w-full sm:w-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold hover:opacity-90 w-full sm:w-auto"
            >
              Complete Signup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ id, label, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function PasswordField({ label, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="At least 6 characters"
        className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}