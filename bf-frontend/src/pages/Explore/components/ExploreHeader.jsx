import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBell, FiSearch, FiUser, FiChevronDown } from "react-icons/fi";

export default function ExploreHeader({ role, search, setSearch, onPrimaryAction }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useMemo(() => {
    const name = localStorage.getItem("userName") || (role === "creator" ? "Creator" : "Brand");
    return { name };
  }, [role]);

  const navItems = role === "creator"
    ? [
        { to: "/explore/brands", label: "Brands" },
        { to: "/explore/campaigns", label: "Campaigns" },
      ]
    : [{ to: "/explore/creators", label: "Creators" }];

  const goProfile = () => {
    setMenuOpen(false);
    if (role === "creator") navigate("/creator-profile");
    else navigate("/brand-profile");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Brand + Nav */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-extrabold text-slate-900"
            aria-label="Go to home"
          >
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600" />
            <span className="text-lg">BrandFluencer</span>
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

        {/* Search */}
        <div className="flex-1 md:max-w-md">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm
                         focus:ring-2 focus:ring-sky-200 focus:border-sky-300 outline-none"
              placeholder={role === "creator" ? "Search brands or campaigns..." : "Search creators, categories, location..."}
              type="text"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl font-semibold text-white
                       bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 transition shadow-sm"
          >
            {role === "brand" ? "Create Campaign" : role === "creator" ? "Go to Dashboard" : "Login as Brand"}
          </button>

          <button
            type="button"
            className="h-11 w-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition grid place-items-center"
            aria-label="Notifications"
          >
            <FiBell className="text-slate-700" />
          </button>

          {/* Profile menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-11 px-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition inline-flex items-center gap-2"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <FiUser className="text-slate-700" />
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                {user.name}
              </span>
              <FiChevronDown className="text-slate-500" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden"
                role="menu"
              >
                <button
                  type="button"
                  onClick={goProfile}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
                  role="menuitem"
                >
                  Go to Profile
                </button>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm text-slate-500 hover:bg-slate-50"
                  role="menuitem"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
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