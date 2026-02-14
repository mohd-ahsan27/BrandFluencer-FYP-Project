import React from "react";
import { useNavigate } from "react-router-dom";
import { MdFavoriteBorder, MdArrowForward, MdVerified, MdTrendingUp } from "react-icons/md";

function clampStyle(lines) {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

function formatFollowers(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}k`;
  return `${n}`;
}

export default function InfluencerCard({ creator }) {
  const navigate = useNavigate();

  const cover = creator.profileImageDataUrl || creator.image || "";

  return (
    <div className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all group border border-transparent hover:border-[#13daec]/20">
      <div className="relative mb-4">
        <div className="aspect-[4/3] rounded-xl overflow-hidden">
          <img
            alt={creator.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={cover}
          />
        </div>

        {creator.verified && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur rounded-full flex items-center gap-1 shadow-sm">
            <MdVerified className="text-[#13daec] text-base" />
            <span className="text-[10px] font-bold text-slate-900">Verified</span>
          </div>
        )}

        {creator.trending && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#F76F5F] text-white rounded-full flex items-center gap-1 shadow-sm">
            <MdTrendingUp className="text-sm" />
            <span className="text-[10px] font-bold">Trending</span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">{creator.name}</h3>
          <p className="text-xs text-slate-500">{creator.niche || "Creator"}</p>
        </div>
        <button className="text-slate-700 hover:text-[#F76F5F] transition-colors" type="button">
          <MdFavoriteBorder className="text-2xl" />
        </button>
      </div>

      <p className="text-sm text-slate-700/80 mb-4" style={clampStyle(2)}>
        {creator.bio || creator.aboutMe || ""}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(creator.tags || []).slice(0, 3).map((t) => (
          <span
            key={t}
            className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 border-t border-slate-100 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Followers
          </p>
          <p className="text-sm font-extrabold">{formatFollowers(creator.followers || 0)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Engagement
          </p>
          <p className="text-sm font-extrabold text-[#13daec]">
            {(creator.engagementRate || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/creator/${creator.id}`)}
        className="w-full py-3 bg-[#13daec] text-slate-900 font-extrabold rounded-xl hover:bg-[#13daec]/90 transition-colors flex items-center justify-center gap-2"
        type="button"
      >
        View Profile
        <MdArrowForward className="text-lg" />
      </button>
    </div>
  );
}