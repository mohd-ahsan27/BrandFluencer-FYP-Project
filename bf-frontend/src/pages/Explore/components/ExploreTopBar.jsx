// src/pages/Explore/components/ExploreTopBar.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function ExploreTopBar({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = useMemo(() => localStorage.getItem("userRole") || "brand", []);

  const goProfile = () => {
    setOpen(false);
    if (role === "creator") navigate("/creator-profile");
    else navigate("/brand-profile");
  };

  return (
    <div className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            ExploreHub
          </h1>
          <span className="hidden sm:inline text-sm text-slate-500">
            Find creators for your next campaign
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-[340px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators, categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"
            title="Notifications"
          >
            <FaBell className="text-slate-700" />
            <span className="absolute -top-1 -right-1 text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.5">
              3
            </span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"
              title="Profile"
            >
              <FaUserCircle className="text-2xl text-slate-700" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                <button
                  type="button"
                  onClick={goProfile}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm"
                >
                  Go to Profile
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-500"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}