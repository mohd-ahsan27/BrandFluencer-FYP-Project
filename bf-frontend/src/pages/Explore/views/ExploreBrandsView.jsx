import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ExploreSidebar from "../components/ExploreSidebar";
import BrandCard from "../components/BrandCard";
import { brands, getBrandCategories } from "../data/ExploreData";

export default function ExploreBrandsView() {
  const { role, search } = useOutletContext();

  const [selectedCategories, setSelectedCategories] = useState([]);

  const allCategories = useMemo(() => getBrandCategories(), []);

  const filtered = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();

    return (brands || []).filter((b) => {
      const okSearch =
        !q ||
        String(b.name || "").toLowerCase().includes(q) ||
        String(b.category || "").toLowerCase().includes(q) ||
        String(b.location || "").toLowerCase().includes(q);

      const okCategory =
        selectedCategories.length === 0 || selectedCategories.includes(b.category);

      return okSearch && okCategory;
    });
  }, [search, selectedCategories]);

  const onReset = () => setSelectedCategories([]);

  // if (role !== "creator") return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
      <ExploreSidebar
        role="creator"
        platforms={{}}
        setPlatforms={() => {}}
        maxFollowers=""
        setMaxFollowers={() => {}}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        allCategories={allCategories}
        minRating=""
        setMinRating={() => {}}
        verifiedOnly={false}
        setVerifiedOnly={() => {}}
        onReset={onReset}
      />

      <section className="min-w-0">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Brands</h1>
            <p className="text-slate-600 text-sm mt-1">Click a brand to open their profile.</p>
          </div>
          <p className="text-sm text-slate-500">
            Results: <span className="font-semibold text-slate-900">{filtered.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </section>
    </div>
  );
}