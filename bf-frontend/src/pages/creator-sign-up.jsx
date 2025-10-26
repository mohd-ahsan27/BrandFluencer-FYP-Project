import React, { useEffect, useState, useRef } from "react";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Fashion","Beauty","Lifestyle","Travel","Food","Fitness","Health","Tech","Gaming",
  "Photography","Parenting","Education","Finance","Music","Pets","Art","Design",
  "Sports","Movies","Books","Home Decor","Luxury","Marketing","Nature","Comedy",
];
const MAX_CATEGORIES = 5;
const LOCAL_KEY = "brandfluencer_creator_draft_v4";

export default function CreatorSignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    aboutMe: "",
    profileImageDataUrl: "",
    socials: {
      instagram: { handle: "", followers: "" },
      youtube: { handle: "", followers: "" },
      tiktok: { handle: "", followers: "" },
      facebook: { handle: "", followers: "" },
    },
    categories: [],
  });
  const [errors, setErrors] = useState({});

  // ------- load draft and autosave -------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch {}
  }, []);
  useEffect(() => {
    const { profileImageDataUrl, ...light } = form;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(light));
  }, [form]);

  // ------- validation --------------------------
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
    } else if (s === 1) {
      if (!form.bio.trim()) e.bio = "Bio required.";
      if (!form.aboutMe.trim()) e.aboutMe = "About Me required.";
    } else if (s === 2) {
      const filled = Object.values(form.socials).some(
        (sci) => sci.handle.trim() || sci.followers.trim()
      );
      if (!filled) e.socials = "Add at least one social account.";
    } else if (s === 3) {
      if (!form.categories.length) e.categories = "Select at least one category.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validateStep(step) && setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const updateSocial = (k, fld, val) =>
    setForm((f) => ({
      ...f,
      socials: { ...f.socials, [k]: { ...f.socials[k], [fld]: val } },
    }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm((f) => ({ ...f, profileImageDataUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const toggleCat = (cat) =>
    setForm((f) => {
      const has = f.categories.includes(cat);
      const next = has ? f.categories.filter((c) => c !== cat) : [...f.categories, cat];
      if (next.length > MAX_CATEGORIES) return f;
      return { ...f, categories: next };
    });

  const submit = (e) => {
    e.preventDefault();
    const ok = [0, 1, 2, 3].every((i) => validateStep(i));
    if (!ok) return;
    const { profileImageDataUrl, ...lite } = form;
    localStorage.setItem("brandfluencer_creator_user", JSON.stringify(lite));
    localStorage.removeItem(LOCAL_KEY);
    navigate("/creator-welcome-page");
  };

  const StepTitle = ({ text }) => (
    <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3">
      {text}
    </h3>
  );

  // ---------------- UI -----------------
  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-10 bg-gradient-to-br from-[#eef2ff] via-[#e0f7ff] to-[#ffe8ef]">
      <form
        onSubmit={submit}
        className="w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl p-6 sm:p-10"
      >
        {/* Stepper */}
        <div className="flex flex-wrap justify-between mb-8 gap-2">
          {["Personal", "Profile", "Socials", "Categories"].map((lbl, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div key={lbl} className="flex flex-col items-center flex-1 min-w-[60px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                  ${
                    done
                      ? "bg-gradient-to-r from-sky-500 to-violet-500 text-white"
                      : active
                      ? "bg-sky-100 text-sky-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs ${
                    active ? "text-sky-700 font-semibold" : "text-gray-600"
                  }`}
                >
                  {lbl}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-inner p-5 sm:p-8">
          {/* ---------- Step 0 ---------- */}
          {step === 0 && (
            <>
              <StepTitle text="Personal Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="fullName"
                  label="Full Name (Required)"
                  value={form.fullName}
                  onChange={(v) => handleChange("fullName", v)}
                  error={errors.fullName}
                />
                <Input
                  id="email"
                  label="Email (Required)"
                  type="email"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                  error={errors.email}
                />

                {/* Password + Confirm */}
                <PasswordField
                  label="Password (Required)"
                  value={form.password}
                  onChange={(v) => handleChange("password", v)}
                  error={errors.password}
                  show={showPass}
                  toggleShow={() => setShowPass((p) => !p)}
                />
                <PasswordField
                  label="Confirm Password (Required)"
                  value={form.confirmPassword}
                  onChange={(v) => handleChange("confirmPassword", v)}
                  error={errors.confirmPassword}
                  show={showConf}
                  toggleShow={() => setShowConf((p) => !p)}
                />
              </div>
            </>
          )}

          {/* ---------- Step 1 ---------- */}
          {step === 1 && (
            <>
              <StepTitle text="Profile Setup" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-36 h-36 rounded-xl bg-gray-100 border border-gray-300 flex justify-center items-center overflow-hidden mb-3">
                    {form.profileImageDataUrl ? (
                      <img
                        src={form.profileImageDataUrl}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    type="button"
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-sky-500 to-violet-500 text-white font-medium"
                  >
                    Upload
                  </button>
                </div>

                <div className="lg:col-span-2">
                  <label className="text-sm text-gray-700 mb-1 block">
                    Short Bio (Required) – Give a brief introduction about yourself.
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 resize-none"
                  />
                  <label className="text-sm text-gray-700 mt-4 block">
                    About Me (Required) – Share more about what you do and why you create content.
                  </label>
                  <textarea
                    value={form.aboutMe}
                    onChange={(e) => handleChange("aboutMe", e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 resize-none"
                  />
                  {(errors.bio || errors.aboutMe) && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bio || errors.aboutMe}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ---------- Step 2 ---------- */}
          {step === 2 && (
            <>
              <StepTitle text="Social Media (Optional)" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { k: "instagram", icon: FaInstagram },
                  { k: "youtube", icon: FaYoutube },
                  { k: "tiktok", icon: FaTiktok },
                  { k: "facebook", icon: FaFacebook },
                ].map(({ k, icon: Icon }) => (
                  <div
                    key={k}
                    className="bg-sky-50 rounded-lg border border-sky-100 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="text-2xl text-sky-600" />
                      <span className="capitalize font-medium">{k}</span>
                    </div>
                    <input
                      value={form.socials[k].handle}
                      onChange={(e) => updateSocial(k, "handle", e.target.value)}
                      placeholder="@yourhandle"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-sky-400"
                    />
                    <input
                      value={form.socials[k].followers}
                      onChange={(e) => updateSocial(k, "followers", e.target.value)}
                      placeholder="Followers"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ---------- Step 3 ---------- */}
          {step === 3 && (
            <>
              <StepTitle text="Categories (Required)" />
              <p className="text-sm text-gray-600 mb-4">
                Choose up to {MAX_CATEGORIES} categories that best describe your niche.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const sel = form.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCat(cat)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all 
                        ${
                          sel
                            ? "bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow scale-105"
                            : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              {errors.categories && (
                <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
              )}
            </>
          )}
        </div>

        {/* ---------- Buttons ---------- */}
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
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold hover:opacity-90 w-full sm:w-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold hover:opacity-90 w-full sm:w-auto"
            >
              Complete Signup
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ------- Reusable components --------
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

function PasswordField({ label, value, onChange, error, show, toggleShow }) {
  return (
    <div className="relative">
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="At least 6 characters"
        className={`w-full border rounded-lg px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-sky-400 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-8 text-gray-500"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}