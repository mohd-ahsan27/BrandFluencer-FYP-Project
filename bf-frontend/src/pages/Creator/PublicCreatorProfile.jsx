import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { creators as sampleCreators } from "../Explore/ExploreSampleData";
import { getCreatorById } from "../../data/creatorsStore";

export default function PublicCreatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const creator = useMemo(() => {
    const stored = getCreatorById(id);
    if (stored) return stored;

    for (let i = 0; i < sampleCreators.length; i += 1) {
      if (sampleCreators[i].id === id) return sampleCreators[i];
    }
    return null;
  }, [id]);

  if (!creator) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow p-6 text-center">
          <p className="font-bold text-slate-900">Creator not found</p>
          <button
            className="mt-4 w-full py-3 rounded-xl bg-slate-900 text-white font-bold"
            onClick={() => navigate("/explore")}
            type="button"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const image = creator.profileImageDataUrl || creator.image || "";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
        <div className="h-56 bg-slate-100">
          {image && (
            <img src={image} alt={creator.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {creator.name}
          </h1>
          <p className="text-slate-600 mt-1">
            {(creator.categories || []).join(", ")}
          </p>

          <div className="mt-5">
            <h2 className="font-bold text-slate-900 mb-2">About</h2>
            <p className="text-slate-700 whitespace-pre-line">
              {creator.aboutMe || creator.bio || "No description provided."}
            </p>
          </div>

          <button
            className="mt-6 px-6 py-3 rounded-xl bg-[#13daec] text-slate-900 font-extrabold"
            onClick={() => navigate("/explore")}
            type="button"
          >
            Back to Explore
          </button>
        </div>
      </div>
    </div>
  );
}