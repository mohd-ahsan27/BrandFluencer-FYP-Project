
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaCheck,
  FaUserAlt,
  FaBuilding,
  FaShareAlt,
  FaGlobe,
  FaInfoCircle,
  FaBullseye,
} from "react-icons/fa";

/* ---------------- CONSTANTS ---------------- */
const INDUSTRIES = [
  "Fashion",
  "Beauty",
  "Technology",
  "Gaming",
  "Food & Beverage",
  "Health & Wellness",
  "Travel",
  "Finance",
  "Education",
  "Sports",
  "Marketing",
  "E-Commerce",
  "Real Estate",
  "Entertainment",
  "Media",
  "Software & AI",
  "Lifestyle",
  "Retail",
];

const STEPS = [
  { label: "Account", icon: <FaUserAlt /> },
  { label: "Company", icon: <FaBuilding /> },
  { label: "Socials", icon: <FaShareAlt /> },
];

export default function BrandSignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    password: "",
    confirmPassword: "",

    companyName: "",
    companyWebsite: "",
    aboutUs: "",
    targetAudience: "",
    categories: [],

    socials: {
      instagram: "",
      facebook: "",
      youtube: "",
      tiktok: "",
    },
  });

  const selectedCount = form.categories.length;

  const websiteLooksValid = (value) => {
    if (!value.trim()) return true; // optional
    return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(
      value.trim()
    );
  };

  const hasAtLeastOneSocial = () => {
    const vals = Object.values(form.socials || {});
    return vals.some((v) => String(v || "").trim().length > 0);
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};

    if (step === 0) {
      if (!form.fullName.trim()) e.fullName = "Full name required";

      if (!form.workEmail.trim()) e.workEmail = "Email required";
      else if (!/^\S+@\S+\.\S+$/.test(form.workEmail))
        e.workEmail = "Invalid email address";

      if (!/^\d{6}$/.test(form.password))
        e.password = "Password must be exactly 6 digits";

      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }

    if (step === 1) {
      // Company name required
      if (!form.companyName.trim()) e.companyName = "Company name required";

      // Website optional, but if provided must be valid
      if (!websiteLooksValid(form.companyWebsite))
        e.companyWebsite = "Enter a valid website (e.g., example.com)";

      // Industry: at least 1, max 5 (max is enforced by UI too)
      if (form.categories.length === 0)
        e.categories = "Select at least one industry";
      if (form.categories.length > 5)
        e.categories = "You can select a maximum of 5 industries";
      // About Us + Target Audience are OPTIONAL now (no validation)
    }

    if (step === 2) {
      // Require at least one social handle
      if (!hasAtLeastOneSocial())
        e.socials = "Please add at least 1 social media handle.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleNext = () => {
    const isValid = validate();
    if (!isValid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const toggleCategory = (cat) => {
    setForm((prev) => {
      const exists = prev.categories.includes(cat);
      if (!exists && prev.categories.length >= 5) return prev;

      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ok = validate();
    if (!ok) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    localStorage.setItem("brandfluencer_brand_user", JSON.stringify(form));
    navigate("/brand-profile");
  };

  const headerSubtitle = useMemo(() => {
    if (step === 0) return "Create your account to get started.";
    if (step === 1) return "Company name is required. Choose at least 1 industry.";
    return "Add at least 1 social media handle to continue.";
  }, [step]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-3xl bg-white/80 backdrop-blur border border-white shadow-[0_20px_60px_-30px_rgba(79,70,229,0.45)] p-6 md:p-8"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Brand Sign Up
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {headerSubtitle}
          </p>
        </div>

        {/* Stepper */}
        <Stepper step={step} />

        {/* Content Shell */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
          {/* STEP 0 */}
          {step === 0 && (
            <div>
              <StepTitle
                title="Account Information"
                subtitle="Use your work email. Password is a 6-digit PIN."
              />

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Full Name"
                  placeholder="e.g., Sarah Khan"
                  error={errors.fullName}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />

                <Input
                  label="Work Email"
                  placeholder="e.g., sarah@company.com"
                  error={errors.workEmail}
                  value={form.workEmail}
                  onChange={(e) =>
                    setForm({ ...form, workEmail: e.target.value })
                  }
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="6-digit password"
                  inputMode="numeric"
                  error={errors.password}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  inputMode="numeric"
                  error={errors.confirmPassword}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <StepTitle
                title="Company Profile"
                subtitle="Company name is required. Website, About Us and Target Audience are optional."
              />

              <div className="mt-4 max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    placeholder="e.g., Brandfluencer"
                    error={errors.companyName}
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({ ...form, companyName: e.target.value })
                    }
                    size="sm"
                  />

                  <Input
                    label="Website (Optional)"
                    placeholder="e.g., brandfluencer.com"
                    leftIcon={<FaGlobe />}
                    error={errors.companyWebsite}
                    value={form.companyWebsite}
                    onChange={(e) =>
                      setForm({ ...form, companyWebsite: e.target.value })
                    }
                    size="sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Textarea
                    label="About Us (Optional)"
                    placeholder="Tell creators what you do, your products, and what makes your brand unique..."
                    leftIcon={<FaInfoCircle />}
                    error={errors.aboutUs}
                    value={form.aboutUs}
                    onChange={(e) =>
                      setForm({ ...form, aboutUs: e.target.value })
                    }
                    rows={4}
                  />

                  <Textarea
                    label="Target Audience (Optional)"
                    placeholder="e.g., Women 18–30 interested in skincare, beauty routines, and self-care..."
                    leftIcon={<FaBullseye />}
                    error={errors.targetAudience}
                    value={form.targetAudience}
                    onChange={(e) =>
                      setForm({ ...form, targetAudience: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-800">
                      Industry
                      <span className="ml-2 text-xs font-medium text-gray-500">
                        (Select 1 to 5)
                      </span>
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                        selectedCount >= 5
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {selectedCount}/5 selected
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {INDUSTRIES.map((cat) => {
                      const active = form.categories.includes(cat);
                      const disabled = !active && selectedCount >= 5;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          disabled={disabled}
                          className={[
                            "px-3 py-1.5 rounded-full text-sm border transition",
                            active
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200",
                            disabled ? "opacity-40 cursor-not-allowed" : "",
                          ].join(" ")}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {errors.categories && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.categories}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <StepTitle
                title="Social Media Handles"
                subtitle="Add at least 1 social media handle to continue."
              />

              {errors.socials ? (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-700">
                    {errors.socials}
                  </p>
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <SocialCard
                  icon={<FaInstagram />}
                  title="Instagram"
                  hint="Handle or profile link"
                  accentClass="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                  ringClass="focus-within:ring-pink-200 focus-within:border-pink-300"
                >
                  <Input
                    label="Instagram"
                    placeholder="@yourbrand"
                    value={form.socials.instagram}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socials: { ...form.socials, instagram: e.target.value },
                      })
                    }
                    size="sm"
                    ringClass="focus-within:ring-pink-200 focus-within:border-pink-300"
                  />
                </SocialCard>

                <SocialCard
                  icon={<FaFacebook />}
                  title="Facebook"
                  hint="Page name or link"
                  accentClass="bg-[#1877F2]"
                  ringClass="focus-within:ring-blue-200 focus-within:border-blue-300"
                >
                  <Input
                    label="Facebook"
                    placeholder="facebook.com/yourbrand"
                    value={form.socials.facebook}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socials: { ...form.socials, facebook: e.target.value },
                      })
                    }
                    size="sm"
                    ringClass="focus-within:ring-blue-200 focus-within:border-blue-300"
                  />
                </SocialCard>

                <SocialCard
                  icon={<FaYoutube />}
                  title="YouTube"
                  hint="Channel name or link"
                  accentClass="bg-[#FF0000]"
                  ringClass="focus-within:ring-red-200 focus-within:border-red-300"
                >
                  <Input
                    label="YouTube"
                    placeholder="youtube.com/@yourbrand"
                    value={form.socials.youtube}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socials: { ...form.socials, youtube: e.target.value },
                      })
                    }
                    size="sm"
                    ringClass="focus-within:ring-red-200 focus-within:border-red-300"
                  />
                </SocialCard>

                <SocialCard
                  icon={<FaTiktok />}
                  title="TikTok"
                  hint="Handle or link"
                  accentClass="bg-black"
                  ringClass="focus-within:ring-gray-300 focus-within:border-gray-400"
                >
                  <Input
                    label="TikTok"
                    placeholder="@yourbrand"
                    value={form.socials.tiktok}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socials: { ...form.socials, tiktok: e.target.value },
                      })
                    }
                    size="sm"
                    ringClass="focus-within:ring-gray-300 focus-within:border-gray-400"
                  />
                </SocialCard>
              </div>

              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                <p className="text-sm text-indigo-900 font-semibold">
                  Tip
                  <span className="ml-2 font-normal text-indigo-800/90">
                    Add the handle or link (at least one is required).
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm"
            >
              Create Brand Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Stepper({ step }) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-2 items-center">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;

          return (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className={[
                  "relative flex items-center justify-center w-10 h-10 rounded-full border transition",
                  done
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : active
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-gray-50 border-gray-200 text-gray-500",
                ].join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? <FaCheck /> : s.icon}
              </div>

              <div className="min-w-0">
                <p
                  className={[
                    "text-sm font-bold leading-tight truncate",
                    active || done ? "text-gray-900" : "text-gray-500",
                  ].join(" ")}
                >
                  {s.label}
                </p>
                <div className="h-1 w-full mt-1 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={[
                      "h-full rounded-full transition-all",
                      done
                        ? "w-full bg-indigo-600"
                        : active
                        ? "w-2/3 bg-indigo-300"
                        : "w-1/3 bg-gray-200",
                    ].join(" ")}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      ) : null}
    </div>
  );
}

function Input({
  label,
  error,
  leftIcon,
  size = "md",
  className = "",
  ringClass = "",
  ...props
}) {
  const sizing =
    size === "sm"
      ? "h-10 px-3 text-sm"
      : "h-11 px-4 text-sm md:text-base";

  return (
    <div className={className}>
      <label className="text-sm font-semibold text-gray-800">{label}</label>

      <div
        className={[
          "mt-1 flex items-center gap-2 rounded-xl border bg-white transition focus-within:ring-2",
          ringClass
            ? ringClass
            : error
            ? "border-red-300 focus-within:ring-red-200"
            : "border-gray-200 focus-within:ring-indigo-200 focus-within:border-indigo-300",
          error ? "border-red-300" : "",
        ].join(" ")}
      >
        {leftIcon ? (
          <span className="pl-3 text-gray-400 text-sm">{leftIcon}</span>
        ) : null}

        <input
          {...props}
          className={[
            "w-full outline-none bg-transparent",
            sizing,
            leftIcon ? "pr-3" : "",
          ].join(" ")}
        />
      </div>

      {error ? <p className="text-red-500 text-sm mt-1">{error}</p> : null}
    </div>
  );
}

function Textarea({
  label,
  error,
  leftIcon,
  rows = 4,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold text-gray-800">{label}</label>

      <div
        className={[
          "mt-1 rounded-xl border bg-white transition focus-within:ring-2",
          error
            ? "border-red-300 focus-within:ring-red-200"
            : "border-gray-200 focus-within:ring-indigo-200 focus-within:border-indigo-300",
        ].join(" ")}
      >
        <div className="flex items-start gap-2">
          {leftIcon ? (
            <span className="pl-3 pt-3 text-gray-400 text-sm">{leftIcon}</span>
          ) : null}

          <textarea
            rows={rows}
            {...props}
            className={[
              "w-full outline-none bg-transparent px-3 py-2.5 text-sm resize-none",
              leftIcon ? "pr-3" : "px-4",
            ].join(" ")}
          />
        </div>
      </div>

      {error ? <p className="text-red-500 text-sm mt-1">{error}</p> : null}
    </div>
  );
}

function SocialCard({
  icon,
  title,
  hint,
  children,
  accentClass = "bg-indigo-600",
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={[
              "w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-sm",
              accentClass,
            ].join(" ")}
          >
            <span className="text-lg">{icon}</span>
          </div>
          <div>
            <p className="font-extrabold text-gray-900 leading-tight">{title}</p>
            <p className="text-xs text-gray-600">{hint}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
