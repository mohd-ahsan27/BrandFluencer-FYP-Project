import React, { useMemo, useState } from "react";
import ExploreHeader from "./components/ExploreHeader";
import ExploreSidebar from "./components/ExploreSidebar";
import ExploreTabs from "./components/ExploreTabs";
import InfluencerCard from "./components/InfluencerCard";
import { creators as sampleCreators } from "./ExploreSampleData";
import { getCreators } from "../../data/creatorsStore";
import { MdRefresh } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function ExplorePage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole") || "brand";

  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(6);

  const [platforms, setPlatforms] = useState({
    instagram: true,
    tiktok: true,
    youtube: false,
    facebook: false,
    snapchat: false,
  });
  const [followerMin, setFollowerMin] = useState(0);
  const [followerMax, setFollowerMax] = useState(5_000_000);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const storedCreators = useMemo(() => getCreators(), []);
  const combinedCreators = useMemo(() => {
    const ids = new Set();
    storedCreators.forEach((c) => ids.add(c.id));

    const safeSample = [];
    for (let i = 0; i < sampleCreators.length; i += 1) {
      if (!ids.has(sampleCreators[i].id)) safeSample.push(sampleCreators[i]);
    }

    return [...storedCreators, ...safeSample];
  }, [storedCreators]);

  const allCategories = useMemo(() => {
    const s = new Set();
    combinedCreators.forEach((c) => {
      const cats = c.categories || [];
      cats.forEach((x) => s.add(x));
    });
    return Array.from(s).sort();
  }, [combinedCreators]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const anyPlatformSelected = Object.values(platforms).some(Boolean);

    return combinedCreators.filter((c) => {
      let okSearch = true;
      if (q) {
        const nameMatch = (c.name || "").toLowerCase().includes(q);
        const nicheMatch = (c.niche || "").toLowerCase().includes(q);
        const catMatch = (c.categories || []).some((x) => x.toLowerCase().includes(q));
        okSearch = nameMatch || nicheMatch || catMatch;
      }

      let okPlatforms = true;
      if (anyPlatformSelected) {
        okPlatforms = Object.keys(platforms).some((p) => platforms[p] && c.platforms?.[p]);
      }

      const followers = c.followers || 0;
      const okFollowers = followers >= followerMin && followers <= followerMax;

      let okCategories = true;
      if (selectedCategories.length > 0) {
        okCategories = selectedCategories.some((cat) => (c.categories || []).includes(cat));
      }

      return okSearch && okPlatforms && okFollowers && okCategories;
    });
  }, [combinedCreators, search, platforms, followerMin, followerMax, selectedCategories]);

  const onReset = () => {
    setSearch("");
    setPlatforms({
      instagram: false,
      tiktok: false,
      youtube: false,
      facebook: false,
      snapchat: false,
    });
    setFollowerMin(0);
    setFollowerMax(5_000_000);
    setSelectedCategories([]);
  };

  if (role !== "brand") {
    return (
      <div className="min-h-screen bg-[#f6f8f8] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow p-6 text-center">
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            ExploreHub is for Brands
          </h2>
          <p className="text-slate-600 mb-5">
            Please login as a Brand to discover creators.
          </p>
          <button
            className="w-full py-3 rounded-xl bg-[#13daec] text-slate-900 font-extrabold"
            onClick={() => navigate("/brand-login")}
            type="button"
          >
            Go to Brand Login
          </button>
        </div>
      </div>
    );
  }

  const shown = filtered.slice(0, visible);

  return (
    <div className="bg-[#f6f8f8] min-h-screen">
      <ExploreHeader search={search} setSearch={setSearch} />

      <main className="max-w-[1440px] mx-auto flex gap-8 px-4 lg:px-10 py-8">
        <ExploreSidebar
          platforms={platforms}
          setPlatforms={setPlatforms}
          followerMin={followerMin}
          followerMax={followerMax}
          setFollowerMin={setFollowerMin}
          setFollowerMax={setFollowerMax}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          allCategories={allCategories}
          onReset={onReset}
        />

        <section className="flex-1">
          <ExploreTabs />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {shown.map((c) => (
              <InfluencerCard key={c.id} creator={c} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="px-8 py-3 bg-slate-100 text-slate-900 font-extrabold rounded-xl hover:bg-[#13daec]/20 transition-all flex items-center gap-2"
            >
              <MdRefresh className="text-xl" />
              Load More Creators
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}