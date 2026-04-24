import React from "react";
import { useNavigate } from "react-router-dom";
import { FiFlag } from "react-icons/fi";
import Stars from "./Stars";
import { addReport } from "../../../data/reportStore";

function clampStyle(lines) {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

function formatFollowers(n) {
  const v = Number(n || 0);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${Math.round(v / 1000)}K`;
  return `${v}`;
}

export default function InfluencerCard({ creator }) {
  const navigate = useNavigate();
  const cover = creator.profileImageDataUrl || creator.image || "";

  const onReport = () => {
    addReport({ type: "creator", id: creator.id, reason: "Reported from Explore" });
    alert("Report submitted (demo).");
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="relative mb-4">
        <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
          <img alt={creator.name} className="w-full h-full object-cover" src={cover} />
        </div>

        <button
          type="button"
          onClick={onReport}
          className="absolute top-3 right-3 h-10 w-10 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur hover:bg-white transition grid place-items-center"
          title="Report creator"
          aria-label="Report creator"
        >
          <FiFlag className="text-slate-700" />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="font-extrabold text-base text-slate-900 truncate">{creator.name}</h3>
          <p className="text-xs text-slate-500">{creator.niche || "Creator"}</p>
        </div>

        <div className="text-right">
          <Stars value={creator.rating || 0} />
          <p className="text-[11px] text-slate-500 mt-1">{Number(creator.reviewsCount || 0)} reviews</p>
        </div>
      </div>

      <p className="text-sm text-slate-700/90 mb-4" style={clampStyle(2)}>
        {creator.bio || creator.aboutMe || "No bio added yet."}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(creator.categories || creator.tags || []).slice(0, 4).map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-full text-[11px] font-bold"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 border-t border-slate-100 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Followers</p>
          <p className="text-sm font-extrabold text-slate-900">{formatFollowers(creator.followers || 0)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Engagement</p>
          <p className="text-sm font-extrabold text-sky-700">{(creator.engagementRate || 0).toFixed(1)}%</p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/creator/${creator.id}`)}
        className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-extrabold rounded-2xl hover:brightness-110 transition"
        type="button"
      >
        View Profile
      </button>
    </div>
  );
}