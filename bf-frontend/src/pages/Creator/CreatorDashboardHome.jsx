import React, { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FiExternalLink, FiMapPin, FiGlobe, FiTag } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaFacebook, FaTiktok } from "react-icons/fa";

function normalizeUrl(url) {
  const v = String(url || "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function stripAt(s) {
  const v = String(s || "").trim();
  return v.startsWith("@") ? v.slice(1) : v;
}

function toUrlOrKeep(input, handleToUrl) {
  const v = String(input || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("www.") || v.includes(".") || v.includes("/")) return normalizeUrl(v);
  return handleToUrl(stripAt(v));
}

export default function CreatorDashboardHome() {
  const navigate = useNavigate();
  const { creator } = useOutletContext();

  const categories = creator.categories || [];

  const socials = useMemo(() => {
    const s = creator.socials || {};
    // In your profile storage, socials are nested (instagram.handle, etc.)
    const ig = s.instagram?.handle || "";
    const yt = s.youtube?.handle || "";
    const tt = s.tiktok?.handle || "";
    const fb = s.facebook?.handle || "";

    return [
      {
        name: "Instagram",
        icon: <FaInstagram className="text-pink-600" />,
        value: ig,
        href: ig ? toUrlOrKeep(ig, (h) => `https://instagram.com/${h}`) : "",
      },
      {
        name: "YouTube",
        icon: <FaYoutube className="text-red-600" />,
        value: yt,
        href: yt ? toUrlOrKeep(yt, (h) => `https://youtube.com/@${h}`) : "",
      },
      {
        name: "TikTok",
        icon: <FaTiktok className="text-slate-900" />,
        value: tt,
        href: tt ? toUrlOrKeep(tt, (h) => `https://tiktok.com/@${h}`) : "",
      },
      {
        name: "Facebook",
        icon: <FaFacebook className="text-blue-600" />,
        value: fb,
        href: fb ? toUrlOrKeep(fb, (h) => `https://facebook.com/${h}`) : "",
      },
    ];
  }, [creator.socials]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top profile summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-20 h-20 rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
              {creator.profileImageDataUrl ? (
                <img
                  src={creator.profileImageDataUrl}
                  alt="Creator"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-500 text-sm">No Photo</div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 truncate">
                {creator.fullName || "Creator"}
              </h1>
              <p className="text-slate-600 truncate">{creator.email}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {creator.location ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-slate-50 text-slate-700">
                    <FiMapPin />
                    {creator.location}
                  </span>
                ) : null}

                {creator.website ? (
                  <a
                    href={normalizeUrl(creator.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                  >
                    <FiGlobe />
                    Website
                    <FiExternalLink className="text-[10px]" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="md:ml-auto flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/creator-profile")}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition font-semibold"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/creator-dashboard/opportunities")}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
            >
              View Opportunities
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-900">About</p>
            <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {creator.aboutMe?.trim() ? creator.aboutMe : "Add your bio in profile settings."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-900 inline-flex items-center gap-2">
              <FiTag />
              Categories
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.length ? (
                categories.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-full text-xs border border-indigo-200 bg-white text-indigo-700"
                  >
                    {c}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-600">No categories selected.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-900">Social Accounts</p>
            <div className="mt-3 space-y-2">
              {socials.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-sm text-slate-800">{s.name}</span>
                    <span className="text-sm text-slate-500 truncate">
                      {s.value ? s.value : "Not set"}
                    </span>
                  </div>
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-700 underline underline-offset-2"
                    >
                      Open
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats (simple, aesthetic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Categories" value={String(categories.length)} />
        <StatCard title="Website" value={creator.website?.trim() ? "Added" : "Not set"} />
        <StatCard title="Profile Status" value={creator.aboutMe?.trim() ? "Complete" : "Incomplete"} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <p className="text-sm text-slate-600 font-semibold">{title}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}