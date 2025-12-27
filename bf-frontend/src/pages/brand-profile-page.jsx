// src/pages/brand-profile-page.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaUserAlt,
  FaEnvelope,
  FaCamera,
  FaTrash,
  FaGlobe,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

const STORAGE_KEY = "brandfluencer_brand_user";

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

const MAX_INDUSTRIES = 5;
const MAX_LOGO_BYTES = 3 * 1024 * 1024; // 3MB

const STORE_TYPES = ["Online", "Offline", "Both"];

export default function BrandProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [stored, setStored] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [errors, setErrors] = useState({});
  const [logoError, setLogoError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      navigate("/brand-sign-up");
      return;
    }

    try {
      const data = JSON.parse(raw);

      const hydratedDraft = {
        // account
        fullName: data?.fullName || "",
        workEmail: data?.workEmail || "",

        // company
        companyName: data?.companyName || "",
        companyWebsite: data?.companyWebsite || "",
        aboutUs: data?.aboutUs || "",
        targetAudience: data?.targetAudience || "",
        categories: Array.isArray(data?.categories) ? data.categories : [],

        // socials
        socials: {
          instagram: data?.socials?.instagram || "",
          facebook: data?.socials?.facebook || "",
          youtube: data?.socials?.youtube || "",
          tiktok: data?.socials?.tiktok || "",
        },

        // logo
        brandLogo: data?.brandLogo || "",

        // NEW: store details (optional)
        storeType: data?.storeType || "Online", // Online | Offline | Both
        storeWebsite: data?.storeWebsite || "", // required if Online/Both
        storeLocations: data?.storeLocations || "", // required if Offline/Both
      };

      setStored(data);
      setDraft(hydratedDraft);
    } catch {
      navigate("/brand-sign-up");
    }
  }, [navigate]);

  const socialsMeta = useMemo(
    () => [
      {
        key: "instagram",
        label: "Instagram",
        Icon: FaInstagram,
        iconColor: "text-pink-600",
        placeholder: "@yourbrand or link",
        hrefBuilder: (v) => toUrlOrKeep(v, (h) => `https://instagram.com/${h}`),
      },
      {
        key: "facebook",
        label: "Facebook",
        Icon: FaFacebook,
        iconColor: "text-[#1877F2]",
        placeholder: "facebook.com/yourbrand",
        hrefBuilder: (v) => toUrlOrKeep(v, (h) => `https://facebook.com/${h}`),
      },
      {
        key: "youtube",
        label: "YouTube",
        Icon: FaYoutube,
        iconColor: "text-[#FF0000]",
        placeholder: "youtube.com/@yourbrand",
        hrefBuilder: (v) => toUrlOrKeep(v, (h) => `https://youtube.com/@${h}`),
      },
      {
        key: "tiktok",
        label: "TikTok",
        Icon: FaTiktok,
        iconColor: "text-gray-900",
        placeholder: "@yourbrand or link",
        hrefBuilder: (v) => toUrlOrKeep(v, (h) => `https://tiktok.com/@${h}`),
      },
    ],
    []
  );

  if (!stored || !draft) {
    // No blank screen: show a simple fallback
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 p-6">
          <p className="text-gray-800">Loading brand profile…</p>
        </div>
      </div>
    );
  }

  const selectedCount = draft.categories?.length || 0;

  // ---------- validators ----------
  const websiteLooksValid = (value) => {
    const v = String(value || "").trim();
    if (!v) return true; // optional
    return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(v);
  };

  const hasAtLeastOneSocial = (socials) =>
    Object.values(socials || {}).some((v) => String(v || "").trim());

  const validate = () => {
    const e = {};

    if (!draft.companyName?.trim()) e.companyName = "Company name is required.";

    if (!websiteLooksValid(draft.companyWebsite)) {
      e.companyWebsite = "Enter a valid website (e.g., example.com).";
    }

    if ((draft.categories || []).length < 1) {
      e.categories = "Select at least 1 industry/category.";
    } else if ((draft.categories || []).length > MAX_INDUSTRIES) {
      e.categories = `Select max ${MAX_INDUSTRIES}.`;
    }

    if (!hasAtLeastOneSocial(draft.socials)) {
      e.socials = "Please add at least 1 social handle/link.";
    }

    // Store validation (optional but conditional)
    const storeType = String(draft.storeType || "Online");
    if ((storeType === "Online" || storeType === "Both") && !draft.storeWebsite?.trim()) {
      e.storeWebsite = "Store website is required for Online/Both.";
    }
    if (!websiteLooksValid(draft.storeWebsite)) {
      // Only validate format if user typed something
      if (String(draft.storeWebsite || "").trim()) {
        e.storeWebsite = "Enter a valid store website (e.g., shop.example.com).";
      }
    }
    if ((storeType === "Offline" || storeType === "Both") && !draft.storeLocations?.trim()) {
      e.storeLocations = "Store locations are required for Offline/Both.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------- actions ----------
  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const updateSocial = (platform, value) =>
    setDraft((d) => ({
      ...d,
      socials: { ...(d.socials || {}), [platform]: value },
    }));

  const toggleCategory = (cat) =>
    setDraft((d) => {
      const has = (d.categories || []).includes(cat);
      const next = has ? d.categories.filter((c) => c !== cat) : [...(d.categories || []), cat];
      if (next.length > MAX_INDUSTRIES) return d;
      return { ...d, categories: next };
    });

  const save = () => {
    const ok = validate();
    if (!ok) return;

    const next = {
      ...stored,
      fullName: draft.fullName,
      workEmail: stored.workEmail || draft.workEmail, // keep original
      companyName: draft.companyName,
      companyWebsite: draft.companyWebsite,
      aboutUs: draft.aboutUs,
      targetAudience: draft.targetAudience,
      categories: draft.categories,
      socials: { ...(stored.socials || {}), ...(draft.socials || {}) },
      brandLogo: draft.brandLogo,

      // NEW store fields
      storeType: draft.storeType,
      storeWebsite: draft.storeWebsite,
      storeLocations: draft.storeLocations,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}

    setStored(next);
    setEditMode(false);
    setErrors({});
    setLogoError("");
  };

  const cancel = () => {
    const s = stored || {};
    setDraft({
      fullName: s?.fullName || "",
      workEmail: s?.workEmail || "",
      companyName: s?.companyName || "",
      companyWebsite: s?.companyWebsite || "",
      aboutUs: s?.aboutUs || "",
      targetAudience: s?.targetAudience || "",
      categories: Array.isArray(s?.categories) ? s.categories : [],
      socials: {
        instagram: s?.socials?.instagram || "",
        facebook: s?.socials?.facebook || "",
        youtube: s?.socials?.youtube || "",
        tiktok: s?.socials?.tiktok || "",
      },
      brandLogo: s?.brandLogo || "",
      storeType: s?.storeType || "Online",
      storeWebsite: s?.storeWebsite || "",
      storeLocations: s?.storeLocations || "",
    });

    setEditMode(false);
    setErrors({});
    setLogoError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const pickLogo = () => fileRef.current?.click();

  const handleLogo = (e) => {
    setLogoError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      setLogoError("Please upload an image file (PNG, JPG, WEBP, etc.).");
      return;
    }

    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo is too large. Please upload under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setDraft((d) => ({ ...d, brandLogo: String(ev.target.result || "") }));
    reader.onerror = () => setLogoError("Could not read the file. Try again.");
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoError("");
    setDraft((d) => ({ ...d, brandLogo: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const storeType = String(draft.storeType || "Online");
  const showStoreWebsite = storeType === "Online" || storeType === "Both";
  const showStoreLocations = storeType === "Offline" || storeType === "Both";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* ONE simple box / card */}
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white border border-gray-200 shadow-sm p-6 md:p-8">
        {/* Top header inside same card */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                {draft.brandLogo ? (
                  <img
                    src={draft.brandLogo}
                    alt="Brand logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                    <FaBuilding />
                  </div>
                )}
              </div>

              {editMode ? (
                <button
                  type="button"
                  onClick={pickLogo}
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow hover:bg-black transition"
                  title="Upload / Change logo"
                >
                  <FaCamera />
                </button>
              ) : null}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogo}
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 truncate">
                {stored.companyName || "Brand Profile"}
              </h1>
              <p className="text-gray-600 truncate">{stored.workEmail || "—"}</p>

              {logoError ? (
                <p className="mt-2 text-sm text-red-600">{logoError}</p>
              ) : null}
            </div>
          </div>

          <div className="md:ml-auto flex flex-wrap gap-2">
            {!editMode ? (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={save}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 transition inline-flex items-center gap-2"
                >
                  <FaTrash />
                  Remove logo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Everything else inside the SAME card */}
        <div className="space-y-8">
          {/* Account */}
          <div>
            <SectionTitle>Account</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <Input
                label="Account Owner Name"
                value={draft.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                disabled={!editMode}
                leftIcon={<FaUserAlt />}
              />
              <Input
                label="Work Email"
                value={draft.workEmail}
                readOnly
                disabled
                leftIcon={<FaEnvelope />}
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <SectionTitle>Company Details</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <Input
                label="Company Name"
                value={draft.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
                disabled={!editMode}
                error={errors.companyName}
              />

              <WebsiteField
                label="Company Website (Optional)"
                value={draft.companyWebsite}
                onChange={(e) => setField("companyWebsite", e.target.value)}
                disabled={!editMode}
                error={errors.companyWebsite}
                placeholder="example.com"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-700">About Us (Optional)</label>
              {editMode ? (
                <AutoTextarea
                  value={draft.aboutUs}
                  onChange={(e) => setField("aboutUs", e.target.value)}
                  placeholder="Write about your brand..."
                />
              ) : (
                <ReadBox text={stored.aboutUs} />
              )}
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-700">Target Audience (Optional)</label>
              {editMode ? (
                <AutoTextarea
                  value={draft.targetAudience}
                  onChange={(e) => setField("targetAudience", e.target.value)}
                  placeholder="Describe your target audience..."
                />
              ) : (
                <ReadBox text={stored.targetAudience} />
              )}
            </div>
          </div>

          {/* NEW: Store */}
          <div>
            <SectionTitle>Store</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <Select
                label="Store Type"
                value={draft.storeType}
                onChange={(e) => setField("storeType", e.target.value)}
                disabled={!editMode}
                options={STORE_TYPES}
              />

              {showStoreWebsite ? (
                <WebsiteField
                  label="Store Website"
                  value={draft.storeWebsite}
                  onChange={(e) => setField("storeWebsite", e.target.value)}
                  disabled={!editMode}
                  error={errors.storeWebsite}
                  placeholder="shop.example.com"
                />
              ) : (
                <div />
              )}
            </div>

            {showStoreLocations ? (
              <div className="mt-4">
                <label className="text-sm text-gray-700">Store Locations</label>
                {editMode ? (
                  <AutoTextarea
                    value={draft.storeLocations}
                    onChange={(e) => setField("storeLocations", e.target.value)}
                    placeholder="Add locations (one per line). Example:
Lahore – MM Alam Road
Karachi – Dolmen Mall"
                    error={errors.storeLocations}
                  />
                ) : (
                  <ReadBox text={stored.storeLocations} emptyText="Not provided" />
                )}
                {errors.storeLocations ? (
                  <p className="mt-1 text-sm text-red-600">{errors.storeLocations}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Industry */}
          <div>
            <SectionTitle>Industry / Categories</SectionTitle>
            {errors.categories ? (
              <p className="mt-2 text-sm text-red-600">{errors.categories}</p>
            ) : null}

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {editMode ? "Select 1 to 5" : "Selected"}
              </p>
              <span className="text-xs text-gray-600">
                {selectedCount}/{MAX_INDUSTRIES}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {INDUSTRIES.map((cat) => {
                const selected = (draft.categories || []).includes(cat);
                const disabled = editMode && !selected && selectedCount >= MAX_INDUSTRIES;

                if (!editMode) {
                  if (!selected) return null;
                  return (
                    <span
                      key={cat}
                      className="px-3 py-1.5 rounded-full text-xs border border-gray-200 bg-gray-100 text-gray-800"
                    >
                      {cat}
                    </span>
                  );
                }

                return (
                  <button
                    key={cat}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleCategory(cat)}
                    className={[
                      "px-3 py-1.5 rounded-full text-xs border transition",
                      selected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
                      disabled ? "opacity-40 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Socials */}
          <div>
            <SectionTitle>Social Media Accounts</SectionTitle>
            {errors.socials ? (
              <p className="mt-2 text-sm text-red-600">{errors.socials}</p>
            ) : (
              <p className="mt-2 text-xs text-gray-500">
                At least 1 social handle/link is required.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {socialsMeta.map(({ key, label, Icon, iconColor, placeholder, hrefBuilder }) => (
                <SocialField
                  key={key}
                  label={label}
                  Icon={Icon}
                  iconColor={iconColor}
                  value={draft.socials?.[key] || ""}
                  disabled={!editMode}
                  placeholder={placeholder}
                  hrefBuilder={hrefBuilder}
                  onChange={(v) => updateSocial(key, v)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Small UI components ---------------- */

function SectionTitle({ children }) {
  return <h2 className="text-lg md:text-xl font-semibold text-gray-900">{children}</h2>;
}

function Input({ label, error, disabled, leftIcon, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="text-sm text-gray-700">{label}</label>
      <div
        className={[
          "mt-2 flex items-center gap-2 rounded-2xl border px-4 py-3 bg-gray-50 transition",
          disabled ? "opacity-90" : "focus-within:ring-2 focus-within:ring-gray-200",
          error ? "border-red-300" : "border-gray-200",
        ].join(" ")}
      >
        {leftIcon ? <span className="text-gray-400">{leftIcon}</span> : null}
        <input
          {...props}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-sm text-gray-900"
        />
      </div>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function Select({ label, value, onChange, disabled, options }) {
  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <div
        className={[
          "mt-2 rounded-2xl border px-4 py-3 bg-gray-50 transition",
          disabled ? "opacity-90" : "focus-within:ring-2 focus-within:ring-gray-200",
          "border-gray-200",
        ].join(" ")}
      >
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-sm text-gray-900"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function WebsiteField({ label, value, onChange, disabled, error, placeholder }) {
  const raw = String(value || "").trim();
  const href = raw ? normalizeUrl(raw) : "";

  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <div
        className={[
          "mt-2 flex items-center rounded-2xl border bg-gray-50 px-4 py-3 transition",
          disabled ? "opacity-90" : "focus-within:ring-2 focus-within:ring-gray-200",
          error ? "border-red-300" : "border-gray-200",
        ].join(" ")}
      >
        <input
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-gray-900"
        />

        <div className="ml-2">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title="Open website"
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition"
            >
              <FaGlobe />
            </a>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-300">
              <FaGlobe />
            </div>
          )}
        </div>
      </div>

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function AutoTextarea({ value, onChange, placeholder, error }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <>
      <div
        className={[
          "mt-2 rounded-2xl border bg-gray-50 px-4 py-3 transition focus-within:ring-2 focus-within:ring-gray-200",
          error ? "border-red-300" : "border-gray-200",
        ].join(" ")}
      >
        <textarea
          ref={ref}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent outline-none text-sm text-gray-900 resize-none overflow-hidden"
        />
      </div>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </>
  );
}

function ReadBox({ text, emptyText = "Not provided" }) {
  const t = String(text || "").trim();
  return (
    <div className="mt-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
        {t ? t : emptyText}
      </p>
    </div>
  );
}

function SocialField({
  label,
  Icon,
  iconColor,
  value,
  onChange,
  disabled,
  placeholder,
  hrefBuilder,
}) {
  const raw = String(value || "").trim();
  const href = raw ? hrefBuilder?.(raw) : "";
  const canOpen = Boolean(href);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-2">
        {canOpen ? (
          <a href={href} target="_blank" rel="noreferrer" title={`Open ${label}`}>
            <Icon className={`text-lg ${iconColor}`} />
          </a>
        ) : (
          <Icon className={`text-lg ${iconColor} opacity-80`} />
        )}
        <p className="text-sm text-gray-900">{label}</p>
        {canOpen ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-xs text-gray-600 underline underline-offset-2"
          >
            Open
          </a>
        ) : null}
      </div>

      <div className="mt-2">
        {disabled ? (
          <p className="text-sm text-gray-700 break-words">{raw || "Not added"}</p>
        ) : (
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- Utilities ---------------- */

function stripAt(s) {
  const v = String(s || "").trim();
  return v.startsWith("@") ? v.slice(1) : v;
}

function normalizeUrl(url) {
  const v = String(url || "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function toUrlOrKeep(input, handleToUrl) {
  const v = String(input || "").trim();
  if (!v) return "";

  if (/^https?:\/\//i.test(v)) return v;

  // domain/path without scheme
  if (v.startsWith("www.") || v.includes(".") || v.includes("/")) {
    return normalizeUrl(v);
  }

  return handleToUrl(stripAt(v));
}