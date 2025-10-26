import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const INDUSTRIES = [
  "Fashion",
  "Beauty",
  "Technology",
  "Gaming",
  "Food & Beverage",
  "Automotive",
  "Health & Wellness",
  "Travel & Tourism",
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
  "Non-Profit / NGO",
  "Retail",
  "Hospitality",
  "Home & Garden",
  "Jewelry",
  "Pets",
  "Art & Design",
];

export default function BrandSignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyWebsite: "",
    categories: [],
    companyLogo: "",
    brandDescription: "",
    targetAudience: "",
    socials: {
      instagram: "",
      facebook: "",
      youtube: "",
      tiktok: "",
      twitter: "",
      linkedin: "",
      pinterest: "",
    },
    agree: false,
  });
  const [errors, setErrors] = useState({});

  // --- validation ---
  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.fullName.trim()) e.fullName = "Full name is required.";
      if (!form.workEmail.trim()) e.workEmail = "Work email is required.";
      else if (!/^\S+@\S+\.\S+$/.test(form.workEmail))
        e.workEmail = "Enter a valid email.";
      if (!form.password) e.password = "Password required.";
      else if (form.password.length < 6) e.password = "At least 6 characters.";
      if (form.confirmPassword !== form.password)
        e.confirmPassword = "Passwords do not match.";
    } else if (step === 1) {
      if (!form.companyName.trim()) e.companyName = "Company name required.";
      if (!form.categories.length)
        e.categories = "Select at least one industry.";
    } else if (step === 3) {
      if (!form.agree) e.agree = "You must agree before continuing.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => validate() && setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // NOTE: Using localStorage here, but for a real app, you should use an API call
    // to a backend service like Firebase or your custom server.
    localStorage.setItem("brandfluencer_brand_user", JSON.stringify(form)); 
    console.log("Brand Signup Data:", form);
    navigate("/brand-dashboard");
  };

  const toggleCategory = (cat) => {
    setForm((f) => {
      const has = f.categories.includes(cat);
      const next = has
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat];

      // Limit categories to 3
      if (!has && next.length > 3) {
        // Optionally show a visual alert for max limit here,
        // but for now, we just cap it.
        return { ...f, categories: next.slice(0, 3) };
      }
      return { ...f, categories: next.slice(0, 3) };
    });
  };

  const StepTitle = ({ children }) => (
    <h2 className="text-xl font-semibold text-[#5b2333] mb-4">{children}</h2>
  );
  
  // Inline SVG Icons for password visibility (View & ViewOff from lucide)
  const EyeIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  );
  const EyeOffIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6 18a5.53 5.53 0 0 1-1.3-1.67C2 12 5 5 12 5c.42 0 .84.05 1.25.13"/><path d="M10 14l2 2"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
  );


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#fffaf5] via-[#ffece1] to-[#fde4cf]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-3xl border border-[#e7a833]/40 shadow-2xl p-8 text-gray-800"
      >
        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {["Account", "Company", "Campaign", "Legal"].map((n, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold text-sm ${
                  i <= step
                    ? "bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs mt-1 ${
                  i === step ? "font-semibold text-[#ff6a00]" : "text-gray-600"
                }`}
              >
                {n}
              </span>
            </div>
          ))}
        </div>

        {/* Step 0: Account Info */}
        {step === 0 && (
          <>
            <StepTitle>Account Information</StepTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm text-[#5b2333] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6a00] ${
                    errors.fullName ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-sm text-[#5b2333] mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={form.workEmail}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, workEmail: e.target.value }))
                  }
                  className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6a00] ${
                    errors.workEmail ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.workEmail && (
                  <p className="text-red-500 text-sm">{errors.workEmail}</p>
                )}
              </div>

              {/* Password (with eye icon) */}
              <div className="relative">
                <label className="block text-sm text-[#5b2333] mb-1">
                  Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="At least 6 characters"
                  className={`w-full border rounded-lg px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#ff6a00] ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
                >
                  {showPass ? <EyeIcon /> : <EyeOffIcon />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (with eye icon) */}
              <div className="relative">
                <label className="block text-sm text-[#5b2333] mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConf ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Re-enter password"
                  className={`w-full border rounded-lg px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#ff6a00] ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConf((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
                >
                  {showConf ? <EyeIcon /> : <EyeOffIcon />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Step 1: Company Profile (Company Name, Website, Categories, Logo) */}
        {step === 1 && (
          <>
            <StepTitle>Company Profile</StepTitle>
            <div className="space-y-6">
              {/* Name & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#5b2333] mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, companyName: e.target.value }))
                    }
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6a00] ${
                      errors.companyName ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm">{errors.companyName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#5b2333] mb-1">
                    Company Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={form.companyWebsite}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, companyWebsite: e.target.value }))
                    }
                    placeholder="https://example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff6a00]"
                  />
                </div>
              </div>

              {/* Industry / Category Selection */}
              <div>
                <label className="block text-sm text-[#5b2333] mb-2">
                  Industry / Category (max 3)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {INDUSTRIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm border transition duration-200 ${
                        form.categories.includes(cat)
                          ? "bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white border-none shadow-md"
                          : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.categories && (
                  <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
                )}
              </div>

              {/* Company Logo Upload */}
              <div>
                <label className="block text-sm text-[#5b2333] mb-1">
                  Company Logo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      companyLogo: e.target.files[0]?.name,
                    }))
                  }
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Campaign & Brand Details (Descriptions, Socials) */}
        {step === 2 && (
          <>
            <StepTitle>Campaign & Brand Details (Optional)</StepTitle>
            <div className="space-y-4">
              {/* Brand Description */}
              <div>
                <label className="block text-sm font-medium text-[#5b2333] mb-1">
                  Brand Description / "About Us"
                </label>
                <textarea
                  value={form.brandDescription}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, brandDescription: e.target.value }))
                  }
                  rows={4}
                  placeholder="Tell influencers about your brand's mission and voice..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#ff6a00] outline-none transition"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-[#5b2333] mb-1">
                  Target Audience
                </label>
                <textarea
                  value={form.targetAudience}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, targetAudience: e.target.value }))
                  }
                  rows={3}
                  placeholder="Example: Gen Z students in the US interested in sustainability."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#ff6a00] outline-none transition"
                />
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block text-sm font-medium text-[#5b2333] mb-1">
                  Social Media Links (Optional)
                </label>
                {Object.keys(form.socials).map((key) => (
                  <input
                    key={key}
                    type="url"
                    placeholder={`${
                      key.charAt(0).toUpperCase() + key.slice(1)
                    } URL`}
                    value={form.socials[key]}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        socials: { ...f.socials, [key]: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-[#ff6a00] outline-none transition"
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 3: Legal Agreement */}
        {step === 3 && (
          <>
            <StepTitle>Legal Agreement</StepTitle>
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Please review and accept the terms to complete your brand registration.
              </p>
              <div className="flex items-start">
                <input
                  id="agree"
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, agree: e.target.checked }))
                  }
                  className="mr-3 h-5 w-5 border-gray-300 text-[#ff6a00] focus:ring-[#e7a833] rounded mt-0.5"
                />
                <label htmlFor="agree" className="text-sm text-gray-700 leading-snug">
                  I agree to the
                  <a href="#" className="underline text-[#5b2333] hover:text-[#ff6a00] mx-1">
                    Terms of Service
                  </a>
                  and
                  <a href="#" className="underline text-[#5b2333] hover:text-[#ff6a00] mx-1">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-sm mt-2">{errors.agree}</p>
              )}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white font-semibold hover:opacity-90 shadow-lg transition-opacity"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white font-semibold hover:opacity-90 shadow-lg transition-opacity"
            >
              Complete Signup
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
