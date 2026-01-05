import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBriefcase,
  FiMessageSquare,
  FiCalendar,
  FiDollarSign,
  FiMenu,
  FiX,
  FiBell,
  FiUser,
} from "react-icons/fi";

const CREATOR_PROFILE_KEY = "creator_profile";
const CREATOR_IMAGE_KEY = "creator_profile_image";

function loadCreatorFromStorage() {
  const raw = localStorage.getItem(CREATOR_PROFILE_KEY);
  if (!raw) return null;

  let data = null;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  const image = localStorage.getItem(CREATOR_IMAGE_KEY) || data.profileImageDataUrl || "";

  return {
    fullName: data.fullName || "",
    email: data.email || "",
    aboutMe: data.aboutMe || "",
    website: data.website || "",
    location: data.location || "",
    profileImageDataUrl: image,
    socials: data.socials || {},
    categories: Array.isArray(data.categories) ? data.categories : [],
    pricing: data.pricing || {},
  };
}

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [creator, setCreator] = useState(null);

  // Load creator profile on mount + keep in sync with localStorage changes
  useEffect(() => {
    const loaded = loadCreatorFromStorage();
    if (!loaded) {
      navigate("/creator-sign-up");
      return;
    }
    setCreator(loaded);

    const onStorage = (e) => {
      if (e.key === CREATOR_PROFILE_KEY || e.key === CREATOR_IMAGE_KEY) {
        const next = loadCreatorFromStorage();
        if (next) setCreator(next);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [navigate]);

  const pageTitle = useMemo(() => {
    if (location.pathname.endsWith("/opportunities")) return "Opportunities";
    if (location.pathname.endsWith("/messages")) return "Messages";
    if (location.pathname.endsWith("/meetings")) return "Meetings";
    if (location.pathname.endsWith("/earnings")) return "Earnings";
    return "Dashboard";
  }, [location.pathname]);

  const navItems = [
    { name: "Dashboard", to: "/creator-dashboard", icon: <FiHome /> },
    { name: "Opportunities", to: "/creator-dashboard/opportunities", icon: <FiBriefcase /> },
    { name: "Messages", to: "/creator-dashboard/messages", icon: <FiMessageSquare /> },
    { name: "Meetings", to: "/creator-dashboard/meetings", icon: <FiCalendar /> },
    { name: "Earnings", to: "/creator-dashboard/earnings", icon: <FiDollarSign /> },
  ];

  if (!creator) return null;

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
            <div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                Creator Studio
              </h1>
              <p className="text-xs text-slate-500">Manage your profile & deals</p>
            </div>

            <button
              type="button"
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === "/creator-dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center w-full px-4 py-3 rounded-2xl transition font-semibold ${
                    isActive
                      ? "bg-gradient-to-r from-sky-50 to-indigo-50 text-indigo-700 border border-indigo-100"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Profile link (go to your existing creator-profile page) */}
          <div className="p-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/creator-profile")}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition"
              title="Open Creator Profile"
            >
              <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                {creator.profileImageDataUrl ? (
                  <img
                    src={creator.profileImageDataUrl}
                    alt="Creator"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-slate-600" />
                )}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {creator.fullName || "Creator"}
                </p>
                <p className="text-xs text-slate-500 truncate">{creator.email}</p>
              </div>
              <span className="ml-auto text-xs font-bold text-indigo-700">Profile</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              type="button"
              aria-label="Open sidebar"
            >
              <FiMenu size={22} />
            </button>
            <h2 className="text-xl font-extrabold text-slate-900">{pageTitle}</h2>
          </div>

          <button
            type="button"
            className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition"
            title="Notifications"
          >
            <FiBell size={20} />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-fuchsia-500" />
          </button>
        </header>

        {/* Routed pages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet
            context={{
              creator,
              refreshCreator: () => setCreator(loadCreatorFromStorage()),
            }}
          />
        </div>
      </main>
    </div>
  );
}