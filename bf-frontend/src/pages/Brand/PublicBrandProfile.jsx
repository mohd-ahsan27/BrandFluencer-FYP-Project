import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { brands } from "../Explore/data/ExploreData";

function normalizeUrl(url) {
  const v = String(url || "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export default function PublicBrandProfile() {
  const { id } = useParams();

  const brand = useMemo(() => {
    return (brands || []).find((b) => String(b.id) === String(id)) || null;
  }, [id]);

  if (!brand) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Brand Not Found</h2>
          <p className="mt-2 text-slate-600">This brand profile does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
            </div>

            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold text-slate-900">{brand.name}</h1>
              <p className="text-slate-600 mt-1">
                {brand.category} • {brand.location}
              </p>

              {brand.website ? (
                <a
                  className="inline-block mt-3 text-sky-700 font-semibold hover:underline break-all"
                  href={normalizeUrl(brand.website)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {brand.website}
                </a>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-extrabold text-slate-900">About</h2>
            <p className="mt-2 text-slate-700 leading-relaxed">
              {brand.about || "No description provided."}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-extrabold text-slate-900">Tags</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {(brand.tags || []).map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full text-xs border border-slate-200 bg-white text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}