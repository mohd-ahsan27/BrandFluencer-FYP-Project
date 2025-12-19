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
        fullName: data?.fullName || "",
        workEmail: data?.workEmail || "",

        companyName: data?.companyName || "",
        companyWebsite: data?.companyWebsite || "",
        aboutUs: data?.aboutUs || "",
        targetAudience: data?.targetAudience || "",
        categories: Array.isArray(data?.categories) ? data.categories : [],

        socials: {
          instagram: data?.socials?.instagram || "",
          facebook: data?.socials?.facebook || "",
          youtube: data?.socials?.youtube || "",
          tiktok: data?.socials?.tiktok || "",
        },

        brandLogo: data?.brandLogo || "",
      };

      setStored(data);
      setDraft(hydratedDraft);
    } catch {
      navigate("/brand-sign-up");
    }
  }, [navigate]);

  const selectedCount = draft?.categories?.length || 0;

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

  if (!stored || !draft) return null;

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

    if (!websiteLooksValid(draft.companyWebsite))
      e.companyWebsite = "Enter a valid website (e.g., example.com).";

    if ((draft.categories || []).length < 1)
      e.categories = "Select at least 1 industry/category.";
    else if ((draft.categories || []).length > MAX_INDUSTRIES)
      e.categories = `Select max ${MAX_INDUSTRIES}.`;

    if (!hasAtLeastOneSocial(draft.socials))
      e.socials = "Please add at least 1 social media handle/link.";

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
      const next = has
        ? d.categories.filter((c) => c !== cat)
        : [...(d.categories || []), cat];

      if (next.length > MAX_INDUSTRIES) return d;
      return { ...d, categories: next };
    });

  const save = () => {
    const ok = validate();
    if (!ok) return;

    const next = {
      ...stored,
      fullName: draft.fullName,
      workEmail: stored.workEmail || draft.workEmail,
      companyName: draft.companyName,
      companyWebsite: draft.companyWebsite,
      aboutUs: draft.aboutUs,
      targetAudience: draft.targetAudience,
      categories: draft.categories,
      socials: { ...(stored.socials || {}), ...(draft.socials || {}) },
      brandLogo: draft.brandLogo,
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
    setDraft({
      fullName: stored?.fullName || "",
      workEmail: stored?.workEmail || "",
      companyName: stored?.companyName || "",
      companyWebsite: stored?.companyWebsite || "",
      aboutUs: stored?.aboutUs || "",
      targetAudience: stored?.targetAudience || "",
      categories: Array.isArray(stored?.categories) ? stored.categories : [],
      socials: {
        instagram: stored?.socials?.instagram || "",
        facebook: stored?.socials?.facebook || "",
        youtube: stored?.socials?.youtube || "",
        tiktok: stored?.socials?.tiktok || "",
      },
      brandLogo: stored?.brandLogo || "",
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

    const maxBytes = 2.5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setLogoError("Image is too large. Please upload under 2.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft((d) => ({ ...d, brandLogo: String(ev.target.result || "") }));
    };
    reader.onerror = () => setLogoError("Could not read the file. Try again.");
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoError("");
    setDraft((d) => ({ ...d, brandLogo: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 pb-12">
      <div className="relative h-44 sm:h-52 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />

      <div className="max-w-6xl mx-auto px-4 -mt-14 sm:-mt-16 relative z-10">
        {/* Header */}
        <div className="rounded-3xl bg-white border border-gray-200 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-5 min-w-0">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm flex items-center justify-center">
                  {draft.brandLogo ? (
                    <img
                      src={draft.brandLogo}
                      alt="Brand logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center px-3">
                      <div className="mx-auto w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                        <FaBuilding />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Upload logo</p>
                    </div>
                  )}
                </div>

                {editMode ? (
                  <button
                    type="button"
                    onClick={pickLogo}
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-md hover:bg-black transition"
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
                <h1 className="text-2xl md:text-3xl font-medium text-gray-900 truncate">
                  {stored.companyName || "Brand Profile"}
                </h1>
                <p className="text-base text-gray-600 truncate">
                  {stored.workEmail || "—"}
                </p>
                {logoError ? (
                  <p className="mt-2 text-sm text-red-600">{logoError}</p>
                ) : null}
              </div>
            </div>

            <div className="md:ml-auto flex flex-wrap gap-3">
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="px-6 py-3 rounded-2xl bg-gray-900 text-white hover:bg-black transition shadow-sm text-base"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={save}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm text-base"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancel}
                    className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-900 hover:bg-gray-200 transition text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-900 hover:bg-gray-200 transition inline-flex items-center gap-2 text-base"
                    title="Remove logo"
                  >
                    <FaTrash />
                    Remove logo
                  </button>
                </>
              )}
            </div>
          </div>

          {editMode ? (
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Account Owner Name"
                value={draft.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
              />
              <Input label="Work Email (read only)" value={draft.workEmail} readOnly />
            </div>
          ) : null}
        </div>

        {/* CONTENT */}
        <div className="mt-6 grid grid-cols-1 gap-6">
          {/* Company Details wide */}
          <SectionCard title="Company Details" subtitle="Update your brand information.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Company Name"
                value={editMode ? draft.companyName : stored.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
                disabled={!editMode}
                error={errors.companyName}
              />

              {/* Website: icon INSIDE field, clickable to open website */}
              <WebsiteField
                label="Website (Optional)"
                value={editMode ? draft.companyWebsite : stored.companyWebsite}
                onChange={(e) => setField("companyWebsite", e.target.value)}
                disabled={!editMode}
                error={errors.companyWebsite}
                placeholder="example.com"
              />
            </div>

            {/* About Us: heading + text field, then Target Audience below it */}
            <div className="mt-7">
              <TextSectionTitle>About Us</TextSectionTitle>

              {editMode ? (
                <Textarea
                  value={draft.aboutUs}
                  onChange={(e) => setField("aboutUs", e.target.value)}
                  placeholder="Write about your brand..."
                  autoResize
                />
              ) : (
                <ReadArea>
                  <ExpandableText text={stored.aboutUs} emptyText="Not provided" lines={20} />
                </ReadArea>
              )}
            </div>

            <div className="mt-7">
              <TextSectionTitle>Target Audience</TextSectionTitle>

              {editMode ? (
                <Textarea
                  value={draft.targetAudience}
                  onChange={(e) => setField("targetAudience", e.target.value)}
                  placeholder="Describe your target audience..."
                  autoResize
                />
              ) : (
                <ReadArea>
                  <ExpandableText
                    text={stored.targetAudience}
                    emptyText="Not provided"
                    lines={20}
                  />
                </ReadArea>
              )}
            </div>
          </SectionCard>

          {/* Social Media Accounts */}
          <SectionCard
            title="Social Media Accounts"
            subtitle="Add a handle or link. Click the icon to open your profile."
          >
            {errors.socials ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <p className="text-base text-red-700">{errors.socials}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {socialsMeta.map(({ key, label, Icon, iconColor, placeholder, hrefBuilder }) => (
                <SocialRow
                  key={key}
                  label={label}
                  Icon={Icon}
                  iconColor={iconColor}
                  value={editMode ? draft.socials?.[key] : stored.socials?.[key]}
                  onChange={(v) => updateSocial(key, v)}
                  disabled={!editMode}
                  placeholder={placeholder}
                  hrefBuilder={hrefBuilder}
                />
              ))}
            </div>

            <p className="mt-5 text-sm text-gray-600">
              Note: At least 1 social handle/link is required to save.
            </p>
          </SectionCard>

          {/* Industry + Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Industry/Categories" subtitle="Choose 1 to 5 categories.">
              {errors.categories ? (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                  <p className="text-base text-red-700">{errors.categories}</p>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <p className="text-base text-gray-700">
                  {editMode ? "Choose (1–5)" : "Selected"}
                </p>
                <span className="text-sm text-gray-600">
                  {selectedCount}/{MAX_INDUSTRIES}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {INDUSTRIES.map((cat) => {
                  const selected = (draft.categories || []).includes(cat);
                  const disabled =
                    editMode && !selected && selectedCount >= MAX_INDUSTRIES;

                  if (!editMode) {
                    if (!selected) return null;
                    return (
                      <span
                        key={cat}
                        className="px-4 py-2 rounded-full text-sm border border-gray-200 bg-gray-100 text-gray-900"
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
                        "px-4 py-2 rounded-full text-sm border transition",
                        selected
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-900 hover:bg-gray-100",
                        disabled ? "opacity-40 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Account" subtitle="Basic account information.">
              <InfoRow icon={<FaUserAlt />} label="Owner Name" value={stored.fullName || "—"} />
              <InfoRow icon={<FaEnvelope />} label="Work Email" value={stored.workEmail || "—"} />
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-7 md:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900">{title}</h2>
        {subtitle ? <p className="text-base text-gray-600">{subtitle}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function TextSectionTitle({ children }) {
  return (
    <h3 className="text-lg md:text-xl font-medium text-gray-900">
      {children}
    </h3>
  );
}

function Input({ label, error, disabled, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="text-base text-gray-800">{label}</label>

      <div
        className={[
          "mt-2 rounded-2xl border transition",
          disabled ? "bg-gray-100 border-gray-200" : "bg-gray-50 border-gray-300",
          error ? "border-red-300" : "",
          !disabled ? "focus-within:ring-2 focus-within:ring-gray-200" : "",
        ].join(" ")}
      >
        <input
          {...props}
          disabled={disabled}
          className={[
            "w-full bg-transparent px-5 py-3 text-base outline-none",
            disabled ? "cursor-not-allowed text-gray-600" : "text-gray-900",
          ].join(" ")}
        />
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

/**
 * Website field:
 * - Icon is INSIDE the field (right side).
 * - Clicking icon opens the website (if value is valid/non-empty).
 */
function WebsiteField({ label, value, onChange, disabled, error, placeholder }) {
  const raw = String(value || "").trim();
  const href = raw ? normalizeUrl(raw) : "";

  return (
    <div>
      <label className="text-base text-gray-800">{label}</label>

      <div
        className={[
          "mt-2 flex items-center rounded-2xl border transition",
          disabled ? "bg-gray-100 border-gray-200" : "bg-gray-50 border-gray-300",
          error ? "border-red-300" : "",
          !disabled ? "focus-within:ring-2 focus-within:ring-gray-200" : "",
        ].join(" ")}
      >
        <input
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={[
            "w-full bg-transparent px-5 py-3 text-base outline-none",
            disabled ? "cursor-not-allowed text-gray-600" : "text-gray-900",
          ].join(" ")}
        />

        <div className="pr-3">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title="Open website"
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition"
            >
              <FaGlobe />
            </a>
          ) : (
            <div
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-300"
              title="Add a website to enable"
            >
              <FaGlobe />
            </div>
          )}
        </div>
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function Textarea({ error, disabled, autoResize = false, className = "", ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!autoResize) return;
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [autoResize, props.value]);

  const onInput = (e) => {
    if (autoResize) {
      e.currentTarget.style.height = "auto";
      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    }
    props.onInput?.(e);
  };

  return (
    <div className={className}>
      <div
        className={[
          "mt-3 rounded-2xl border transition",
          disabled ? "bg-gray-100 border-gray-200" : "bg-gray-50 border-gray-300",
          error ? "border-red-300" : "",
          !disabled ? "focus-within:ring-2 focus-within:ring-gray-200" : "",
        ].join(" ")}
      >
        <textarea
          {...props}
          ref={ref}
          disabled={disabled}
          rows={autoResize ? 1 : 6}
          onInput={onInput}
          className={[
            "w-full bg-transparent px-5 py-3 text-base outline-none resize-none overflow-hidden",
            disabled ? "cursor-not-allowed text-gray-600" : "text-gray-900",
          ].join(" ")}
        />
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function ReadArea({ children }) {
  return (
    <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
      {children}
    </div>
  );
}

/** Truncate after N lines and show Read More when needed */
function ExpandableText({ text, emptyText = "—", lines = 20 }) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const ref = useRef(null);

  const value = String(text || "").trim();
  const display = value ? value : emptyText;

  const clampStyle = useMemo(
    () => ({
      display: "-webkit-box",
      WebkitLineClamp: lines,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }),
    [lines]
  );

  useEffect(() => {
    if (!ref.current) return;

    const id = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;

      if (expanded) {
        setCanExpand(true);
        return;
      }
      const overflowing = el.scrollHeight > el.clientHeight + 1;
      setCanExpand(overflowing);
    });

    return () => cancelAnimationFrame(id);
  }, [display, expanded, lines]);

  return (
    <div>
      <p
        ref={ref}
        className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed"
        style={!expanded ? clampStyle : undefined}
      >
        {display}
      </p>

      {value && canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((s) => !s)}
          className="mt-3 text-base text-gray-700 underline underline-offset-4 hover:text-gray-900 transition"
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      ) : null}
    </div>
  );
}

/** Social row: platform icon becomes clickable if value exists */
function SocialRow({ label, Icon, iconColor, value, onChange, disabled, placeholder, hrefBuilder }) {
  const raw = String(value || "").trim();
  const href = raw ? hrefBuilder?.(raw) : "";
  const canOpen = Boolean(href);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        {canOpen ? (
          <a href={href} target="_blank" rel="noreferrer" title={`Open ${label}`}>
            <Icon className={`text-2xl ${iconColor}`} />
          </a>
        ) : (
          <Icon className={`text-2xl ${iconColor} opacity-80`} />
        )}

        <div className="min-w-0">
          <p className="text-base text-gray-900">{label}</p>
          {canOpen ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-600 underline underline-offset-4"
            >
              Open profile
            </a>
          ) : (
            <p className="text-sm text-gray-500">Add handle or link</p>
          )}
        </div>
      </div>

      {!disabled ? (
        <div className="mt-4 rounded-2xl border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-gray-200 transition">
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent px-5 py-3 text-base outline-none"
          />
        </div>
      ) : (
        <p className="mt-4 text-base text-gray-800 break-words">
          {raw ? raw : "Not added"}
        </p>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className="w-10 h-10 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-base text-gray-900 break-words">{value}</p>
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

  if (v.startsWith("www.") || v.includes(".") || v.includes("/")) {
    return normalizeUrl(v);
  }

  return handleToUrl(stripAt(v));
}