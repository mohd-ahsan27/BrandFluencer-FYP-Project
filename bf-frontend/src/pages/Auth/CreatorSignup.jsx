import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Safe fallback storage to prevent compile-time crashes in sandboxes
let addCreator = (creator) => {
  try {
    const saved = localStorage.getItem("brandfluencer_creators") || "[]";
    const parsed = JSON.parse(saved);
    parsed.push(creator);
    localStorage.setItem("brandfluencer_creators", JSON.stringify(parsed));
  } catch (err) {
    console.error("Local fallback storage failed", err);
  }
};

// Dynamically import creatorsStore if available
import("../../data/creatorsStore")
  .then((module) => {
    if (module && module.addCreator) {
      addCreator = module.addCreator;
    }
  })
  .catch(() => {
    // Dynamic import fails gracefully in isolated sandbox previews
  });

const CATEGORIES = [
  "Fashion", "Beauty", "Lifestyle", "Travel", "Food", "Fitness", "Health", "Tech", "Gaming",
  "Photography", "Parenting", "Education", "Finance", "Music", "Pets", "Art", "Design",
  "Sports", "Movies", "Books", "Home Decor", "Luxury", "Marketing", "Nature", "Comedy",
];

const MAX_CATEGORIES = 5;
const DRAFT_KEY = "brandfluencer_creator_draft_v6";

localStorage.setItem("userRole", "creator");

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// Instagram Icon using official CSS linear gradient definition inside SVG
const InstagramIcon = () => (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="instagramBrandGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f9ce34" />
        <stop offset="40%" stopColor="#ee2a7b" />
        <stop offset="100%" stopColor="#6228d7" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instagramBrandGradient)"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instagramBrandGradient)"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#instagramBrandGradient)"></line>
  </svg>
);

// YouTube Icon using official YouTube Red (#FF0000)
const YoutubeIcon = () => (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="#FF0000">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.046 0 12 0 12s0 3.955.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.955 24 12 24 12s0-3.955-.502-5.837z" />
    <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="#FFFFFF" />
  </svg>
);

// TikTok Icon using true high-contrast black outline style
const TiktokIcon = () => (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#010101" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// Facebook Icon using official Facebook Blue (#1877F2)
const FacebookIcon = () => (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

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
    },
    categories: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch (e) {
      console.error(e);
    }
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
      let nextCats;
      if (has) nextCats = f.categories.filter((c) => c !== cat);
      else nextCats = [...f.categories, cat];
      if (nextCats.length > MAX_CATEGORIES) return f;
      return { ...f, categories: nextCats };
    });

  const submit = () => {
    const ok = validateStep(2);
    if (!ok) {
      setStep(2);
      return;
    }

    const id = makeId();
    const newCreator = {
      id,
      name: form.fullName,
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      aboutMe: form.aboutMe || "",
      categories: form.categories || [],
      socials: form.socials || {},
      platforms: {
        instagram: !!form.socials?.instagram?.handle,
        youtube: !!form.socials?.youtube?.handle,
        tiktok: !!form.socials?.tiktok?.handle,
        facebook: !!form.socials?.facebook?.handle,
        snapchat: false,
      },
      followers: 50000,
      engagementRate: 4.2,
      rating: 4.6,
      reviewsCount: 12,
      verified: false,
      trending: false,
      profileImageDataUrl: form.profileImageDataUrl || "",
    };

    addCreator(newCreator);

    localStorage.setItem("creator_profile", JSON.stringify(newCreator));
    localStorage.removeItem(DRAFT_KEY);

    localStorage.setItem(
      "creator_auth",
      JSON.stringify({ loggedIn: true, at: Date.now() })
    );

    localStorage.setItem("userRole", "creator");

    navigate("/creator-dashboard");
  };

  const StepTitle = ({ text, subtitle }) => (
    <div className="mb-6">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
        <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
        {text}
      </h3>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0f2fe]">
      {/* Decorative Brand Patterns (Light Blue Atmosphere) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full filter blur-[120px] pointer-events-none opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-100 rounded-full filter blur-[120px] pointer-events-none opacity-60"></div>

      <div className="relative w-full max-w-4xl bg-white border border-slate-200/80 rounded-3xl shadow-[0_20px_50px_rgba(30,41,59,0.06)] p-6 sm:p-10 z-10">
        
        {/* Top Header Panel */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold tracking-wide text-xs uppercase px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            Creator Space Registration
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Join Brandfluencer
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto font-medium">
            Setup your credentials, list your networks, and get instantly visible to key campaign managers.
          </p>
        </div>

        {/* Progress Timeline Header */}
        <div className="flex justify-between items-center mb-10 relative max-w-2xl mx-auto px-4">
          <div className="absolute top-[18px] left-10 right-10 h-[2px] bg-slate-100 -z-10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${step === 0 ? 0 : step === 1 ? 50 : 100}%` }}
            />
          </div>

          {["Personal Info", "Social Channels", "Niches"].map((lbl, i) => {
            const active = i === step;
            const done = i < step;
            
            return (
              <div key={lbl} className="flex flex-col items-center flex-1 relative">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    done 
                      ? "bg-blue-600 text-white scale-105 shadow-[0_4px_10px_rgba(37,99,235,0.2)]" 
                      : active 
                        ? "bg-white text-blue-600 border-2 border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.15)] scale-110" 
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-[11px] sm:text-xs mt-2.5 font-semibold transition-colors tracking-wide text-center whitespace-nowrap ${
                  active ? "text-blue-600" : done ? "text-slate-600" : "text-slate-400"
                }`}>
                  {lbl}
                </span>
              </div>
            );
          })}
        </div>

        {/* Interactive Step Containers */}
        <div className="bg-[#f8fafc] border border-slate-200/60 rounded-2xl p-5 sm:p-8">
          
          {/* STEP 0: Personal Profiles */}
          {step === 0 && (
            <div className="space-y-6">
              <StepTitle 
                text="Personal Profile" 
                subtitle="Provide your primary contact data and establish a strong, secure password."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="fullName"
                  label="Full Name"
                  placeholder="e.g. Jenkins Sarah"
                  value={form.fullName}
                  onChange={(v) => handleChange("fullName", v)}
                  error={errors.fullName}
                />
                <Input
                  id="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  type="email"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                  error={errors.email}
                />
                <PasswordField
                  label="Secure Password"
                  value={form.password}
                  onChange={(v) => handleChange("password", v)}
                  error={errors.password}
                />
                <PasswordField
                  label="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(v) => handleChange("confirmPassword", v)}
                  error={errors.confirmPassword}
                />
              </div>
            </div>
          )}

          {/* STEP 1: Social Platform Links */}
          {step === 1 && (
            <div className="space-y-6">
              <StepTitle 
                text="Social Channels" 
                subtitle="Connect your handles. This enables campaign analytics parsing to match you with brands."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {}
                {[
                  { 
                    k: "instagram", 
                    label: "Instagram", 
                    Icon: InstagramIcon, 
                    focusStyle: "focus-within:border-[#E1306C] focus-within:ring-4 focus-within:ring-[#E1306C]/10"
                  },
                  { 
                    k: "youtube", 
                    label: "YouTube", 
                    Icon: YoutubeIcon, 
                    focusStyle: "focus-within:border-[#FF0000] focus-within:ring-4 focus-within:ring-[#FF0000]/10"
                  },
                  { 
                    k: "tiktok", 
                    label: "TikTok", 
                    Icon: TiktokIcon, 
                    focusStyle: "focus-within:border-slate-800 focus-within:ring-4 focus-within:ring-slate-800/10"
                  },
                  { 
                    k: "facebook", 
                    label: "Facebook", 
                    Icon: FacebookIcon, 
                    focusStyle: "focus-within:border-[#1877F2] focus-within:ring-4 focus-within:ring-[#1877F2]/10"
                  },
                ].map(({ k, label, Icon, focusStyle }) => (
                  <div 
                    key={k} 
                    className={`bg-white border border-slate-200 rounded-2xl p-4 transition-all duration-300 hover:border-slate-300 ${focusStyle}`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {/* Only raw, transparent background icons as requested */}
                        <div className="flex items-center justify-center w-8 h-8">
                          <Icon />
                        </div>
                        {/* Consistent social media text name in clean high-contrast black */}
                        <span className="font-extrabold text-sm tracking-tight text-slate-900">{label}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        Connect
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">@</span>
                      <input
                        value={form.socials[k].handle}
                        onChange={(e) => updateSocial(k, e.target.value)}
                        placeholder="yourhandle"
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-8 pr-3 py-3 text-xs outline-none transition-all placeholder:text-slate-400 font-semibold focus:border-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Niche Categorization */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <StepTitle 
                  text="Niche & Topics" 
                  subtitle={`Select between 1 and ${MAX_CATEGORIES} core niches where you post and build authority.`}
                />
                <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full self-start sm:self-auto whitespace-nowrap shadow-sm">
                  {form.categories.length} / {MAX_CATEGORIES} Chosen
                </span>
              </div>
              
              <div className="rounded-2xl border border-slate-200 p-5 bg-white">
                <div className="flex flex-wrap gap-2 justify-center">
                  {CATEGORIES.map((cat) => {
                    const selected = form.categories.includes(cat);
                    const disabled = !selected && form.categories.length >= MAX_CATEGORIES;
                    
                    let btnStyle = "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-100";
                    if (selected) {
                      btnStyle = "bg-blue-600 text-white border-transparent shadow-[0_4px_10px_rgba(37,99,235,0.2)] scale-[1.03]";
                    }
                    if (disabled) {
                      btnStyle += " opacity-40 cursor-not-allowed";
                    }
                    
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCat(cat)}
                        disabled={disabled}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${btnStyle}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
              {errors.categories && (
                <p className="text-rose-600 text-xs font-medium bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 mt-2">
                  {errors.categories}
                </p>
              )}
            </div>
          )}
        </div>

        {}
        {/* Action Controls Footer */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="w-full sm:w-auto">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 text-xs font-bold w-full sm:w-auto"
              >
                <ArrowLeftIcon />
                Back
              </button>
            )}
          </div>
          <div className="w-full sm:w-auto">
            {step < 2 ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-all duration-200 text-xs w-full sm:w-auto"
              >
                Next Step
                <ArrowRightIcon />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-all duration-200 text-xs w-full sm:w-auto"
              >
                Complete Registration
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ id, label, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(v) => onChange(v.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border text-slate-800 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 font-medium ${
          error 
            ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
            : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
        }`}
      />
      {error && <p className="text-rose-600 text-xs font-semibold pl-1">{error}</p>}
    </div>
  );
}

function PasswordField({ label, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="At least 6 characters"
          className={`w-full bg-white border text-slate-800 rounded-xl pl-4 pr-11 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 font-medium ${
            error 
              ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && <p className="text-rose-600 text-xs font-semibold pl-1">{error}</p>}
    </div>
  );
}