// src/pages/creator-profile-page.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaGlobe,
  FaMapMarkerAlt,
  FaUserFriends,
} from "react-icons/fa";

const CATEGORIES = [
  "Fashion","Beauty","Lifestyle","Travel","Food","Fitness","Health","Tech","Gaming",
  "Photography","Parenting","Education","Finance","Music","Pets","Art","Design",
  "Sports","Movies","Books","Home Decor","Luxury","Marketing","Nature","Comedy",
];
const MAX_CATEGORIES = 5;

const DEFAULT_PRICING = {
  currency: "USD",
  instagram: { story: "", post: "", reel: "" },
  youtube: { short: "", video: "" },
  tiktok: { video: "" },
  facebook: { story: "", post: "", video: "" },
};

export default function CreatorProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const raw = localStorage.getItem("creator_profile");
    if (!raw) {
      navigate("/creator-sign-up");
      return;
    }
    const data = JSON.parse(raw);
    const image =
      data.profileImageDataUrl ||
      localStorage.getItem("creator_profile_image") ||
      "";

    const hydrated = {
      fullName: data.fullName || "",
      email: data.email || "",
      aboutMe: data.aboutMe || "",
      website: data.website || "",
      location: data.location || "",
      profileImageDataUrl: image,
      socials: {
        instagram: {
          handle: data?.socials?.instagram?.handle || "",
          followers: data?.socials?.instagram?.followers || "15.2k",
        },
        youtube: {
          handle: data?.socials?.youtube?.handle || "",
          followers: data?.socials?.youtube?.followers || "50k",
        },
        tiktok: {
          handle: data?.socials?.tiktok?.handle || "",
          followers: data?.socials?.tiktok?.followers || "120k",
        },
        facebook: {
          handle: data?.socials?.facebook?.handle || "",
          followers: data?.socials?.facebook?.followers || "8.5k",
        },
      },
      categories: Array.isArray(data.categories) ? data.categories : [],
      pricing: { ...(data.pricing || DEFAULT_PRICING) },
    };

    hydrated.pricing = {
      currency: hydrated.pricing.currency || "USD",
      instagram: { story: "", post: "", reel: "", ...(hydrated.pricing.instagram || {}) },
      youtube: { short: "", video: "", ...(hydrated.pricing.youtube || {}) },
      tiktok: { video: "", ...(hydrated.pricing.tiktok || {}) },
      facebook: { story: "", post: "", video: "", ...(hydrated.pricing.facebook || {}) },
    };

    setProfile(hydrated);
    setDraft(hydrated);
  }, [navigate]);

  if (!profile) return null;

  // helpers
  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const updateSocial = (platform, value) =>
    setDraft((d) => ({
      ...d,
      socials: { ...d.socials, [platform]: { ...d.socials[platform], handle: value } },
    }));
  const toggleCategory = (cat) =>
    setDraft((d) => {
      const has = d.categories?.includes(cat);
      const next = has ? d.categories.filter((c) => c !== cat) : [...(d.categories || []), cat];
      if (next.length > MAX_CATEGORIES) return d;
      return { ...d, categories: next };
    });
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setDraft((d) => ({ ...d, profileImageDataUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };
  const updatePrice = (platform, type, value) =>
    setDraft((d) => ({
      ...d,
      pricing: {
        ...d.pricing,
        [platform]: { ...(d.pricing?.[platform] || {}), [type]: value },
      },
    }));
  const setCurrency = (value) =>
    setDraft((d) => ({
      ...d,
      pricing: { ...(d.pricing || {}), currency: value },
    }));
  const validate = () => {
    const e = {};
    if (!draft.fullName?.trim()) e.fullName = "Full name is required.";
    if (!draft.aboutMe?.trim()) e.aboutMe = "About Me is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const save = () => {
    const ok = validate();
    if (!ok) return;

    const { profileImageDataUrl, ...textOnly } = draft;
    try {
      localStorage.setItem("creator_profile", JSON.stringify(textOnly));
    } catch {}
    try {
      if (profileImageDataUrl && profileImageDataUrl.length < 1_000_000) {
        localStorage.setItem("creator_profile_image", profileImageDataUrl);
      } else if (profileImageDataUrl === "") {
        localStorage.removeItem("creator_profile_image");
      }
    } catch {}
    setProfile(draft);
    setEditMode(false);
  };
  const cancel = () => {
    setDraft(profile);
    setEditMode(false);
    setErrors({});
  };

  // Socials config
  const socialsMeta = [
    { key: "instagram", label: "Instagram", Icon: FaInstagram, color: "text-pink-600" },
    { key: "youtube", label: "YouTube", Icon: FaYoutube, color: "text-red-600" },
    { key: "tiktok", label: "TikTok", Icon: FaTiktok, color: "text-black" },
    { key: "facebook", label: "Facebook", Icon: FaFacebook, color: "text-blue-600" },
  ];

  // prebuilt sections using if/else instead of ternaries
  function renderAvatar() {
    if (draft.profileImageDataUrl) {
      return (
        <img
          src={draft.profileImageDataUrl}
          alt="Creator profile"
          className="w-full h-full object-cover"
        />
      );
    } else {
      return <span className="text-gray-400">No Image</span>;
    }
  }

  function renderNameEmail() {
    if (editMode) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</label>
            <input
              value={draft.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              className={`w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-sky-400 outline-none ${
                errors.fullName ? "border-red-400" : "border-slate-300"
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email (Read Only)</label>
            <input
              value={draft.email || ""}
              readOnly
              className="w-full border rounded-lg px-4 py-2 mt-1 bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
            {profile.fullName}
          </h1>
          <p className="text-slate-500 font-medium">{profile.email}</p>
        </div>
      );
    }
  }

  function renderActionButtons() {
    if (!editMode) {
      return (
        <button
          onClick={() => setEditMode(true)}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 transition shadow-sm font-medium"
        >
          <FaEdit /> Edit Profile
        </button>
      );
    } else {
      return (
        <>
          <button
            onClick={save}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 transition shadow-sm font-medium"
          >
            <FaSave /> Save Changes
          </button>
          <button
            onClick={cancel}
            className="px-6 py-2.5 rounded-xl bg-gray-100 text-slate-700 hover:bg-gray-200 flex items-center gap-2 transition font-medium"
          >
            <FaTimes /> Cancel
          </button>
        </>
      );
    }
  }

  function renderWebsite() {
    if (editMode) {
      return (
        <input
          type="url"
          value={draft.website}
          onChange={(e) => setField("website", e.target.value)}
          placeholder="https://yourwebsite.com"
          className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
        />
      );
    } else {
      if (profile.website) {
        return (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:underline font-medium break-all"
          >
            {profile.website}
          </a>
        );
      } else {
        return <span className="text-slate-500">No website added</span>;
      }
    }
  }

  function renderLocation() {
    if (editMode) {
      return (
        <input
          type="text"
          value={draft.location}
          onChange={(e) => setField("location", e.target.value)}
          placeholder="City, Province, Country (e.g. Lahore, Punjab, Pakistan)"
          className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
        />
      );
    } else {
      if (profile.location) {
        return <p className="text-slate-700 font-medium">{profile.location}</p>;
      } else {
        return <p className="text-slate-700 font-medium">Location not specified</p>;
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500" />
      <div className="max-w-6xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header block */}
          <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
            {/* Avatar */}
            <div className="relative mx-auto md:mx-0 flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                {renderAvatar()}
              </div>
              {editMode && (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-full shadow-lg transition"
                    type="button"
                    title="Change photo"
                  >
                    <FaCamera />
                  </button>
                  <input
                    ref={fileRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </>
              )}
            </div>

            {/* Name / Email / Actions */}
            <div className="flex-1 w-full pt-2">
              {renderNameEmail()}
              <div className="mt-6 flex justify-center md:justify-start gap-3">
                {renderActionButtons()}
              </div>
            </div>
          </div>

          {/* About + Categories (make right-side slightly wider by balancing columns) */}
          <section className="mb-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About Me</h2>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                {editMode ? (
                  <>
                    <textarea
                      rows={6}
                      value={draft.aboutMe}
                      onChange={(e) => setField("aboutMe", e.target.value)}
                      className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 outline-none ${
                        errors.aboutMe ? "border-red-400" : "border-slate-300"
                      }`}
                      placeholder="Share your story..."
                    />
                    {errors.aboutMe && <p className="text-red-500 text-sm mt-1">{errors.aboutMe}</p>}
                  </>
                ) : (
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {profile.aboutMe}
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <FaGlobe className="text-slate-400" /> Website
                </h3>
                {renderWebsite()}
              </div>

              {/* Location */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-slate-400" /> Location
                </h3>
                {renderLocation()}
              </div>
            </div>

            {/* Right (categories) — slightly larger box with more padding */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Categories</h2>
              <div className="bg-indigo-150 border border-indigo-20 rounded-xl p-6 md:p-7 min-h-[180px]">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const selected = (draft.categories || []).includes(cat);

                    if (!editMode) {
                      if (!selected) {
                        return null;
                      } else {
                        return (
                          <span
                            key={cat}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 shadow-sm"
                          >
                            {cat}
                          </span>
                        );
                      }
                    } else {
                      let cls = "px-3 py-1.5 rounded-full text-xs font-semibold transition border ";
                      if (selected) {
                        cls += "bg-indigo-600 text-white border-indigo-600 shadow-sm";
                      } else {
                        cls += "bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100";
                      }
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={cls}
                        >
                          {cat}
                        </button>
                      );
                    }
                  })}
                </div>
                {editMode && (
                  <p className="text-xs text-indigo-400 mt-3">
                    Select up to {MAX_CATEGORIES} categories.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Social Accounts — bigger, two per row; larger label and follower font */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FaUserFriends className="text-slate-400" /> Social Accounts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {socialsMeta.map(({ key, label, Icon, color }) => {
                let topRow;
                let bottomRow;

                // header row
                topRow = (
                  <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-4">
                    <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>
                      <Icon className="text-3xl" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 text-lg">{label}</span>
                      <span className="block text-sm md:text-base text-slate-500 font-medium">
                        {draft.socials[key]?.followers} Followers
                      </span>
                    </div>
                  </div>
                );

                // body row
                if (editMode) {
                  bottomRow = (
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                        Handle
                      </label>
                      <input
                        value={draft.socials[key]?.handle || ""}
                        onChange={(e) => updateSocial(key, e.target.value)}
                        placeholder="@handle"
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                      />
                    </div>
                  );
                } else {
                  if (profile.socials[key]?.handle) {
                    bottomRow = (
                      <div className="text-sm font-medium text-slate-700 truncate">
                        @{profile.socials[key].handle}
                      </div>
                    );
                  } else {
                    bottomRow = (
                      <div className="text-sm font-medium text-slate-400 italic">
                        Not connected
                      </div>
                    );
                  }
                }

                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    {topRow}
                    {bottomRow}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pricing */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Services & Pricing</h2>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg">
                <label className="text-xs font-bold text-slate-500 uppercase">Currency:</label>
                {editMode ? (
                  <select
                    value={draft.pricing?.currency || "USD"}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option>USD</option>
                
                    <option>PKR</option>
                  
                  </select>
                ) : (
                  <span className="text-sm font-bold text-slate-800">
                    {profile.pricing?.currency || "USD"}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PricingCard
                  title="Instagram"
                  Icon={FaInstagram}
                  iconClass="text-pink-600"
                  data={(editMode ? draft : profile).pricing.instagram}
                  currency={(editMode ? draft : profile).pricing.currency}
                  editMode={editMode}
                  fields={[
                    { key: "story", label: "Story" },
                    { key: "post", label: "Photo Post" },
                    { key: "reel", label: "Reel" },
                  ]}
                  onChange={(k, v) => updatePrice("instagram", k, v)}
                />
                <PricingCard
                  title="Facebook"
                  Icon={FaFacebook}
                  iconClass="text-blue-600"
                  data={(editMode ? draft : profile).pricing.facebook}
                  currency={(editMode ? draft : profile).pricing.currency}
                  editMode={editMode}
                  fields={[
                    { key: "story", label: "Story" },
                    { key: "post", label: "Photo Post" },
                    { key: "video", label: "Video / Reel" },
                  ]}
                  onChange={(k, v) => updatePrice("facebook", k, v)}
                />
                <PricingCard
                  title="YouTube"
                  Icon={FaYoutube}
                  iconClass="text-red-600"
                  data={(editMode ? draft : profile).pricing.youtube}
                  currency={(editMode ? draft : profile).pricing.currency}
                  editMode={editMode}
                  fields={[
                    { key: "short", label: "YouTube Short" },
                    { key: "video", label: "Dedicated Video" },
                  ]}
                  onChange={(k, v) => updatePrice("youtube", k, v)}
                />
                <PricingCard
                  title="TikTok"
                  Icon={FaTiktok}
                  iconClass="text-black"
                  data={(editMode ? draft : profile).pricing.tiktok}
                  currency={(editMode ? draft : profile).pricing.currency}
                  editMode={editMode}
                  fields={[{ key: "video", label: "Video" }]}
                  onChange={(k, v) => updatePrice("tiktok", k, v)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  title,
  Icon,
  iconClass = "",
  data = {},
  currency = "USD",
  editMode,
  fields,
  onChange,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
        <Icon className={`${iconClass} text-xl`} /> {title}
      </h4>
      <div className="space-y-3">
        {fields.map(({ key, label }) => {
          let content;
          if (editMode) {
            content = (
              <div className="flex items-center relative">
                <span className="absolute left-3 text-slate-400 text-xs font-bold">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={data?.[key] ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder="0"
                  className="w-28 border border-slate-300 rounded-lg pl-10 pr-2 py-1.5 text-right text-sm focus:ring-2 focus:ring-sky-400 outline-none transition"
                />
              </div>
            );
          } else {
            if (data?.[key]) {
              content = (
                <div className="text-slate-900 font-bold bg-slate-50 px-3 py-1 rounded-md border border-slate-100 text-sm">
                  {currency} {data[key]}
                </div>
              );
            } else {
              content = (
                <div className="text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-md border border-slate-100 text-sm">
                  —
                </div>
              );
            }
          }

          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <label className="text-sm font-medium text-slate-600">{label}</label>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}