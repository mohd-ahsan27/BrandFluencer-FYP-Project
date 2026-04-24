import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBell, FiChevronDown, FiSearch, FiUser } from "react-icons/fi";

export default function ExploreHeader({ role, search, setSearch }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userName = useMemo(() => {
    return localStorage.getItem("userName") || (role === "creator" ? "Creator" : "Brand");
  }, [role]);

  const goProfile = () => {
    setOpen(false);
    navigate(role === "creator" ? "/creator-profile" : "/brand-profile");
  };

  const primaryAction = () => {
    navigate(role === "brand" ? "/brand-dashboard/campaigns?new=1" : "/creator-dashboard");
  };

  const navItems =
    role === "creator"
      ? [
          { to: "/explore/brands", label: "Brands" },
          { to: "/explore/campaigns", label: "Campaigns" },
        ]
      : [{ to: "/explore/creators", label: "Creators" }];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600" />
            <span className="text-lg font-extrabold text-slate-900">Explore</span>
          </button>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "px-4 py-2 rounded-xl text-sm font-semibold transition",
                    isActive
                      ? "bg-sky-50 text-sky-700 border border-sky-100"
                      : "text-slate-600 hover:bg-slate-50",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex-1 md:max-w-md">
          <label className="relative block">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              placeholder={role === "creator" ? "Search brands/campaigns..." : "Search creators..."}
              type="text"
            />
          </label>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          <button
            type="button"
            onClick={primaryAction}
            className="px-4 py-2.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 transition"
          >
            {role === "brand" ? "Create Campaign" : "My Dashboard"}
          </button>

          <button
            type="button"
            className="h-11 w-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition grid place-items-center"
            aria-label="Notifications"
          >
            <FiBell className="text-slate-700" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="h-11 px-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition inline-flex items-center gap-2"
            >
              <FiUser className="text-slate-700" />
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                {userName}
              </span>
              <FiChevronDown className="text-slate-500" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                <button
                  type="button"
                  onClick={goProfile}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
                >
                  Go to Profile
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-500"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="md:hidden flex gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex-1 text-center px-3 py-2 rounded-xl text-sm font-semibold transition",
                  isActive
                    ? "bg-sky-50 text-sky-700 border border-sky-100"
                    : "text-slate-600 hover:bg-slate-50 border border-transparent",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}