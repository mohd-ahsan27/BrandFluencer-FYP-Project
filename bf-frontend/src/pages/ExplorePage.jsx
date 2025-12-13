import React, { useEffect, useState } from "react";

const PLATFORMS = ["All", "Instagram", "YouTube", "TikTok", "Facebook"];
const CATEGORIES = [
  "All",
  "Fashion",
  "Beauty",
  "Tech",
  "Gaming",
  "Food",
  "Fitness",
  "Travel",
  "Marketing",
];

export default function ExplorePage() {
  const [profiles, setProfiles] = useState([]);
  const [platform, setPlatform] = useState("All");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const creator = JSON.parse(
      localStorage.getItem("brandfluencer_creator_user")
    );
    const brand = JSON.parse(
      localStorage.getItem("brandfluencer_brand_user")
    );

    const list = [];

    if (creator) {
      list.push({
        type: "creator",
        name: creator.fullName,
        category: creator.categories?.[0] || "General",
        image:
          creator.profileImageDataUrl ||
          "https://via.placeholder.com/150",
        platforms: Object.keys(creator.socials || {}),
      });
    }

    if (brand) {
      list.push({
        type: "brand",
        name: brand.companyName,
        category: brand.categories?.[0] || "Business",
        image:
          brand.companyLogo
            ? "https://via.placeholder.com/150"
            : "https://via.placeholder.com/150",
        platforms: ["Brand"],
      });
    }

    setProfiles(list);
  }, []);

  const filteredProfiles = profiles.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (platform !== "All" && !p.platforms.includes(platform.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r p-6">
        <h3 className="font-semibold text-lg mb-4">Filters</h3>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Category</p>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm mb-1 ${
                category === c
                  ? "bg-sky-100 text-sky-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6">
        {/* Top Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {PLATFORMS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
              <h3 className="text-center mt-4 font-semibold text-lg">
                {p.name}
              </h3>
              <p className="text-center text-sm text-gray-500">
                {p.category}
              </p>
              <p className="text-center text-xs mt-2 text-sky-600">
                {p.type === "creator" ? "Creator" : "Brand"}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
