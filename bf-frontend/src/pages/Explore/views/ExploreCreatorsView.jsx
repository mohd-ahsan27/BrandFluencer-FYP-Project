import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ExploreSidebar from "../components/ExploreSidebar";
import InfluencerCard from "../components/InfluencerCard";
import { getExploreCreators, getCreatorCategories } from "../data/ExploreData";

export default function ExploreCreatorsView() {
  const { role, search } = useOutletContext();

  const [platforms, setPlatforms] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
    facebook: false,
    snapchat: false,
  });
  const [maxFollowers, setMaxFollowers] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const creators = useMemo(() => getExploreCreators(), []);
  const allCategories = useMemo(() => getCreatorCategories(creators), [creators]);

  const filtered = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    const maxF = maxFollowers ? Number(maxFollowers) : null;
    const minR = minRating ? Number(minRating) : null;
    const anyPlatform = Object.values(platforms).some(Boolean);

    return (creators || []).filter((c) => {
      const okSearch =
        !q ||
        String(c.name || "").toLowerCase().includes(q) ||
        String(c.niche || "").toLowerCase().includes(q) ||
        (c.categories || []).some((x) => String(x).toLowerCase().includes(q));

      const okFollowers = maxF === null || Number(c.followers || 0) <= maxF;

      const okCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => (c.categories || []).includes(cat));

      const okRating = minR === null || Number(c.rating || 0) >= minR;

      const okPlatforms = !anyPlatform
        ? true
        : Object.keys(platforms).some((p) => platforms[p] && c.platforms?.[p]);

      const okVerified = verifiedOnly ? !!c.verified : true;

      return okSearch && okFollowers && okCategories && okRating && okPlatforms && okVerified;
    });
  }, [creators, search, maxFollowers, selectedCategories, minRating, platforms, verifiedOnly]);

  const onReset = () => {
    setPlatforms({ instagram: false, tiktok: false, youtube: false, facebook: false, snapchat: false });
    setMaxFollowers("");
    setSelectedCategories([]);
    setMinRating("");
    setVerifiedOnly(false);
  };

  if (role === "guest") return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
      <ExploreSidebar
        role="brand"
        platforms={platforms}
        setPlatforms={setPlatforms}
        maxFollowers={maxFollowers}
        setMaxFollowers={setMaxFollowers}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        allCategories={allCategories}
        minRating={minRating}
        setMinRating={setMinRating}
        verifiedOnly={verifiedOnly}
        setVerifiedOnly={setVerifiedOnly}
        onReset={onReset}
      />

      <section className="min-w-0">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Creators</h1>
            <p className="text-slate-600 text-sm mt-1">Click a creator to open their profile.</p>
          </div>
          <p className="text-sm text-slate-500">
            Results: <span className="font-semibold text-slate-900">{filtered.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <InfluencerCard key={c.id} creator={c} />
          ))}
        </div>
      </section>
    </div>
  );
}