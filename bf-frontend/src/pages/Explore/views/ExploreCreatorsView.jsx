import React, { useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import ExploreSidebar from "../components/ExploreSidebar";
import { creatorsNormalized } from "../data/ExploreData";

function buildCategories(list) {
  const set = new Set();
  list.forEach((c) => set.add(c.category));
  return Array.from(set).sort();
}

function formatFollowers(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

export default function ExploreCreatorsView() {
  const { role, search } = useOutletContext();
  const [params, setParams] = useSearchParams();

  // If someone not brand opens this view, they’ll be redirected by ExploreLayout.
  // This is just an extra guard for clarity.
  if (role !== "brand" && role !== "guest") return null;

  const [platforms, setPlatforms] = useState({
    instagram: params.get("ig") === "1",
    tiktok: params.get("tt") === "1",
    youtube: params.get("yt") === "1",
    facebook: params.get("fb") === "1",
    snapchat: params.get("sn") === "1",
  });

  const [maxFollowers, setMaxFollowers] = useState(params.get("maxF") || "");
  const [selectedCategories, setSelectedCategories] = useState(
    (params.get("cats") || "").split(",").filter(Boolean)
  );
  const [minRating, setMinRating] = useState(params.get("minR") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(params.get("ver") === "1");

  const allCategories = useMemo(() => buildCategories(creatorsNormalized), []);

  // Keep URL in sync (shareable filters)
  const syncUrl = (next) => {
    const sp = new URLSearchParams(params);

    sp.set("ig", next.platforms.instagram ? "1" : "0");
    sp.set("tt", next.platforms.tiktok ? "1" : "0");
    sp.set("yt", next.platforms.youtube ? "1" : "0");
    sp.set("fb", next.platforms.facebook ? "1" : "0");
    sp.set("sn", next.platforms.snapchat ? "1" : "0");

    if (next.maxFollowers) sp.set("maxF", next.maxFollowers);
    else sp.delete("maxF");

    if (next.selectedCategories.length) sp.set("cats", next.selectedCategories.join(","));
    else sp.delete("cats");

    if (next.minRating) sp.set("minR", next.minRating);
    else sp.delete("minR");

    sp.set("ver", next.verifiedOnly ? "1" : "0");

    setParams(sp, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const maxF = maxFollowers ? Number(maxFollowers) : null;
    const minR = minRating ? Number(minRating) : null;

    return creatorsNormalized.filter((c) => {
      const okSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);

      const okMaxFollowers = maxF === null || c.followers <= maxF;

      const okCategory =
        selectedCategories.length === 0 || selectedCategories.includes(c.category);

      const okRating = minR === null || (c.rating || 0) >= minR;

      // Platforms: since your creatorSampleData doesn't store per-platform booleans,
      // treat it as "not filtering" unless at least one platform is selected.
      const anyPlatformSelected = Object.values(platforms).some(Boolean);
      const okPlatforms = !anyPlatformSelected ? true : true; // placeholder for future real platform data

      const okVerified = verifiedOnly ? false : true; // placeholder until you store verification

      return okSearch && okMaxFollowers && okCategory && okRating && okPlatforms && okVerified;
    });
  }, [search, maxFollowers, selectedCategories, minRating, platforms, verifiedOnly]);

  const onReset = () => {
    const next = {
      platforms: { instagram: false, tiktok: false, youtube: false, facebook: false, snapchat: false },
      maxFollowers: "",
      selectedCategories: [],
      minRating: "",
      verifiedOnly: false,
    };
    setPlatforms(next.platforms);
    setMaxFollowers(next.maxFollowers);
    setSelectedCategories(next.selectedCategories);
    setMinRating(next.minRating);
    setVerifiedOnly(next.verifiedOnly);
    syncUrl(next);
  };

  // Sync when local UI changes
  React.useEffect(() => {
    syncUrl({ platforms, maxFollowers, selectedCategories, minRating, verifiedOnly });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platforms, maxFollowers, selectedCategories, minRating, verifiedOnly]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
      <ExploreSidebar
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
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Discover Creators</h1>
            <p className="text-slate-600 text-sm mt-1">
              Filter by category and follower ranges to find the right match.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Results: <span className="font-semibold text-slate-900">{filtered.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              </div>

              <div className="mt-4">
                <h3 className="font-extrabold text-slate-900">{c.name}</h3>
                <p className="text-sm text-slate-600">{c.category}</p>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{c.location}</span>
                  <span className="font-semibold text-slate-900">
                    {formatFollowers(c.followers)} followers
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full px-4 py-2.5 rounded-2xl font-semibold text-white
                             bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 transition"
                  onClick={() => alert("Open creator profile (route /creator/:id) if you have it")}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}