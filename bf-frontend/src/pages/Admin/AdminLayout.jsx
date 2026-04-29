import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFlag,
  FiUser,
  FiLogOut,
  FiSearch,
  FiUsers,
  FiLayers,
  FiCheckCircle,
  FiCreditCard,
  FiCalendar,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

const ADMIN_AUTH_KEY = "admin_auth";
const ADMIN_PROFILE_KEY = "admin_profile";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");

  const auth = useMemo(() => safeParse(localStorage.getItem(ADMIN_AUTH_KEY), null), []);
  const profile = useMemo(() => safeParse(localStorage.getItem(ADMIN_PROFILE_KEY), null), []);

  useEffect(() => {
    if (!auth || auth.loggedIn !== true) {
      navigate("/admin-login");
      return;
    }
    setReady(true);
  }, [auth, navigate]);

  const logout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    navigate("/admin-login");
  };

  const isActivePath = (to) => {
    if (to === "/admin") {
      if (location.pathname === "/admin") return true;
      return false;
    }
    if (location.pathname.startsWith(to)) return true;
    return false;
  };

  const linkClass = (to) => {
    const active = isActivePath(to);
    let cls =
      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition font-semibold ";

    if (active) {
      cls +=
        "bg-gradient-to-r from-cyan-400/20 to-indigo-400/20 text-white border-white/10 shadow-sm";
    } else {
      cls += "bg-transparent text-slate-200 border-transparent hover:bg-white/5";
    }
    return cls;
  };

  if (!ready) return null;

  let name = "Admin";
  let email = "admin@brandfluencer.com";
  if (profile && profile.name) name = profile.name;
  if (profile && profile.email) email = profile.email;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
        <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-[0_18px_70px_-40px_rgba(2,6,23,0.6)] h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500" />
            <div>
              <p className="text-xs text-slate-300 leading-none">BrandFluencer</p>
              <h2 className="text-lg font-extrabold text-white leading-tight">
                Admin Panel
              </h2>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            <NavLink to="/admin" end className={linkClass("/admin")}>
              <FiHome className="text-lg text-cyan-200" />
              Overview
            </NavLink>

            <NavLink to="/admin/reports" className={linkClass("/admin/reports")}>
              <FiFlag className="text-lg text-cyan-200" />
              Reports
            </NavLink>

            <NavLink to="/admin/users" className={linkClass("/admin/users")}>
              <FiUsers className="text-lg text-cyan-200" />
              Users
            </NavLink>

            <NavLink to="/admin/campaigns" className={linkClass("/admin/campaigns")}>
              <FiLayers className="text-lg text-cyan-200" />
              Campaigns
            </NavLink>

            <NavLink to="/admin/verifications" className={linkClass("/admin/verifications")}>
              <FiCheckCircle className="text-lg text-cyan-200" />
              Verifications
            </NavLink>

            <NavLink to="/admin/payments" className={linkClass("/admin/payments")}>
              <FiCreditCard className="text-lg text-cyan-200" />
              Payments
            </NavLink>

            <NavLink to="/admin/meetings" className={linkClass("/admin/meetings")}>
              <FiCalendar className="text-lg text-cyan-200" />
              Meetings
            </NavLink>

            <NavLink to="/admin/analytics" className={linkClass("/admin/analytics")}>
              <FiBarChart2 className="text-lg text-cyan-200" />
              Analytics
            </NavLink>

            <NavLink to="/admin/settings" className={linkClass("/admin/settings")}>
              <FiSettings className="text-lg text-cyan-200" />
              Settings
            </NavLink>

            <NavLink to="/admin/profile" className={linkClass("/admin/profile")}>
              <FiUser className="text-lg text-cyan-200" />
              Profile
            </NavLink>
          </nav>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-300">Signed in as</p>
              <p className="mt-1 text-sm font-extrabold text-white">{name}</p>
              <p className="text-xs text-slate-300 break-all">{email}</p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                         border border-white/10 bg-white/5 text-white font-semibold
                         hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-200 transition"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Admin Console
                </h1>
                <p className="text-sm text-slate-600">
                  Moderate reports, users, and platform activity.
                </p>
              </div>

              <div className="relative w-full sm:w-[360px]">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none
                             focus:ring-2 focus:ring-cyan-200 focus:border-cyan-300 transition"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          <Outlet context={{ adminSearch: search }} />
        </main>
      </div>
    </div>
  );
}