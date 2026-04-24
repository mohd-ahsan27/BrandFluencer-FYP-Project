import React from "react";
import { useNavigate } from "react-router-dom";
import { FiFlag, FiExternalLink } from "react-icons/fi";
import { addReport } from "../../../data/reportStore";

function normalizeUrl(url) {
  const v = String(url || "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export default function BrandCard({ brand }) {
  const navigate = useNavigate();

  const onReport = () => {
    addReport({ type: "brand", id: brand.id, reason: "Reported from Explore" });
    alert("Report submitted (demo).");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold text-slate-900 truncate">{brand.name}</h3>
          <p className="text-sm text-slate-600">{brand.category} • {brand.location}</p>

          {brand.website ? (
            <a
              href={normalizeUrl(brand.website)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm text-sky-700 font-semibold hover:underline"
            >
              Website <FiExternalLink className="text-xs" />
            </a>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onReport}
          className="h-10 w-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 grid place-items-center"
          title="Report brand"
          aria-label="Report brand"
        >
          <FiFlag className="text-slate-700" />
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-700 leading-relaxed">
        {brand.about || "No description provided."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(brand.tags || []).slice(0, 4).map((t) => (
          <span
            key={t}
            className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-white text-slate-700"
          >
            {t}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate(`/brand/${brand.id}`)}
        className="mt-5 w-full px-4 py-2.5 rounded-2xl font-semibold text-white
                   bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 transition"
      >
        View Profile
      </button>
    </div>
  );
}