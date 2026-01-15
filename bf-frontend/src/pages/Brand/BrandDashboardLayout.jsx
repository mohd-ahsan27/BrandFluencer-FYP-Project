import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiMessageSquare,
  FiCalendar,
  FiMenu,
  FiX,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import { FaBullhorn, FaMoneyBillWave } from "react-icons/fa";

const BRAND_USER_KEY = "brandfluencer_brand_user";
const CAMPAIGNS_KEY = "brand_dashboard_campaigns";

function toNumberSafe(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v ?? "").trim();
  if (!s) return 0;

  const cleaned = s
    .replaceAll(",", "")
    .replaceAll("$", "")
    .replace(/PKR|USD/gi, "")
    .trim();

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function normalizeCurrency(c) {
  const v = String(c || "").toUpperCase().trim();
  return v === "PKR" ? "PKR" : "USD";
}

function loadBrandName() {
  const raw = localStorage.getItem(BRAND_USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.companyName || parsed.fullName || "Brand";
  } catch {
    return null;
  }
}

function loadCampaigns() {
  const raw = localStorage.getItem(CAMPAIGNS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function BrandDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brandName, setBrandName] = useState("Brand");
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const name = loadBrandName();
    if (!name) {
      // ✅ behave like creator dashboard: if no brand profile saved, go signup
      navigate("/brand-sign-up");
      return;
    }
    setBrandName(name);
    setCampaigns(loadCampaigns());

    const onStorage = (e) => {
      if (e.key === CAMPAIGNS_KEY) setCampaigns(loadCampaigns());
      if (e.key === BRAND_USER_KEY) {
        const nextName = loadBrandName();
        if (nextName) setBrandName(nextName);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [navigate]);

  const stats = useMemo(() => {
    let activeCampaigns = 0;
    let totalReach = 0;
    let totalSpentUSD = 0;
    let totalSpentPKR = 0;

    for (const c of campaigns || []) {
      const status = String(c?.status || "").trim();
      if (status === "Active") activeCampaigns += 1;

      totalReach += toNumberSafe(c?.reach);

      const currency = normalizeCurrency(c?.currency);
      const budget = toNumberSafe(c?.budget);

      if (currency === "PKR") totalSpentPKR += budget;
      else totalSpentUSD += budget;
    }

    return { activeCampaigns, totalReach, totalSpentUSD, totalSpentPKR };
  }, [campaigns]);

  const onCampaignsChange = (nextCampaigns) => {
    const safe = Array.isArray(nextCampaigns) ? nextCampaigns : [];
    setCampaigns(safe);
    // ✅ persist
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(safe));
  };

  const pageTitle = useMemo(() => {
    if (location.pathname.endsWith("/campaigns")) return "Campaigns";
    if (location.pathname.endsWith("/messages")) return "Messages";
    if (location.pathname.endsWith("/meetings")) return "Meetings";
    if (location.pathname.endsWith("/payments")) return "Payments";
    return "Dashboard";
  }, [location.pathname]);

  const navItems = [
    { name: "Dashboard", to: "/brand-dashboard", icon: <FiHome /> },
    { name: "Campaigns", to: "/brand-dashboard/campaigns", icon: <FaBullhorn /> },
    { name: "Messages", to: "/brand-dashboard/messages", icon: <FiMessageSquare /> },
    { name: "Meetings", to: "/brand-dashboard/meetings", icon: <FiCalendar /> },
    { name: "Payments", to: "/brand-dashboard/payments", icon: <FaMoneyBillWave /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("brand_auth");
    navigate("/brand-login");
  };

  return (
    <div className="flex h-screen bg-[#fffaf5]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center justify-between px-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff6a00] to-[#e7a833] bg-clip-text text-transparent">
              BrandFluencer
            </h1>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === "/brand-dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-[#ff6a00]/10 to-[#e7a833]/10 text-[#ff6a00]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#5b2333]"
                  }`
                }
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-3">
            <button
              type="button"
              onClick={() => navigate("/brand-profile")}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors w-full"
              title="Go to Brand Profile"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#e7a833] flex items-center justify-center text-white font-bold">
                {String(brandName || "B").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gray-700 truncate">{brandName}</p>
                <p className="text-xs text-gray-500">Brand Profile</p>
              </div>
              <span className="text-xs text-[#ff6a00] font-semibold">Open</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                         border border-gray-300 bg-white text-gray-800 font-semibold
                         hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              type="button"
              aria-label="Open sidebar"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-xl font-bold text-[#5b2333]">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition"
              title="Notifications"
            >
              <FiBell size={22} />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/brand-dashboard/campaigns?new=1")}
              className="px-4 py-2 bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm font-semibold"
            >
              Create Campaign
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet context={{ brandName, stats, campaigns, onCampaignsChange }} />
        </div>
      </main>
    </div>
  );
}