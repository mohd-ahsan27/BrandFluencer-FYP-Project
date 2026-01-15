import React, { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import { FaBullhorn, FaMoneyBillWave } from "react-icons/fa";

function normalizeCurrency(c) {
  const v = String(c || "").toUpperCase().trim();
  return v === "PKR" ? "PKR" : "USD";
}

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

function statusBadge(status) {
  const s = String(status || "").trim();
  switch (s) {
    case "Draft":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "Completed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default function DashboardHome() {
  const navigate = useNavigate();

  // IMPORTANT: campaigns comes from BrandDashboard <Outlet context={{ ... }} />
  const { brandName, stats, campaigns } = useOutletContext();

  // Show latest 5 campaigns (newest first)
  const recentCampaigns = useMemo(() => {
    const arr = Array.isArray(campaigns) ? [...campaigns] : [];
    arr.sort((a, b) => (b?.createdAt || 0) - (a?.createdAt || 0));
    return arr.slice(0, 5);
  }, [campaigns]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#5b2333] to-[#8a344c] rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {brandName}!</h1>
          <p className="text-white/80 max-w-xl">
            You have{" "}
            <span className="font-semibold text-[#ffb366]">
              {stats.activeCampaigns}
            </span>{" "}
            active campaigns running.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/brand-dashboard/campaigns")}
              className="inline-flex px-4 py-2 rounded-lg bg-white/15 hover:bg-white/20 transition text-sm font-semibold"
            >
              View Campaigns
            </button>

            <button
              onClick={() => navigate("/brand-dashboard/campaigns?new=1")}
              className="inline-flex px-4 py-2 rounded-lg bg-[#ffb366]/20 hover:bg-[#ffb366]/25 transition text-sm font-semibold"
            >
              Create Campaign
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon={<FaBullhorn className="text-white" />}
          color="from-orange-400 to-pink-500"
        />

        <StatCard
          title="Total Spent"
          value={
            <div className="leading-tight">
              <div className="text-2xl font-bold text-gray-800">
                USD {Number(stats.totalSpentUSD || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                PKR {Number(stats.totalSpentPKR || 0).toLocaleString()}
              </div>
            </div>
          }
          icon={<FaMoneyBillWave className="text-white" />}
          color="from-green-400 to-emerald-500"
        />

        <StatCard
          title="Total Reach"
          value={Number(stats.totalReach || 0).toLocaleString()}
          icon={<FiTrendingUp className="text-white" />}
          color="from-blue-400 to-indigo-500"
        />
      </div>

      {/* ✅ Recent Campaigns Preview (NEW) */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#5b2333]">Recent Campaigns</h3>
          <button
            onClick={() => navigate("/brand-dashboard/campaigns")}
            className="text-sm text-[#ff6a00] font-medium hover:underline"
          >
            View All
          </button>
        </div>

        {recentCampaigns.length === 0 ? (
          <div className="p-6 text-gray-500">
            No campaigns yet. Create your first campaign from the Campaigns tab.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentCampaigns.map((c) => {
              // Backward compatible: old campaigns might have "platform" not "platforms"
              const platforms =
                Array.isArray(c?.platforms) && c.platforms.length > 0
                  ? c.platforms
                  : c?.platform
                  ? [c.platform]
                  : [];

              const currency = normalizeCurrency(c?.currency);
              const budget = toNumberSafe(c?.budget);

              return (
                <div key={c.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {c.name}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-2 items-center">
                        {platforms.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-1 rounded-full text-xs border border-gray-200 bg-white text-gray-700"
                          >
                            {p}
                          </span>
                        ))}

                        <span
                          className={`px-2 py-1 rounded-full text-xs border ${statusBadge(
                            c.status
                          )}`}
                        >
                          {c.status || "—"}
                        </span>
                      </div>

                      {c.campaignType ? (
                        <p className="mt-2 text-xs text-gray-500">
                          Type: {c.campaignType}
                        </p>
                      ) : null}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {currency} {Number(budget).toLocaleString()}
                      </p>
                      {c.date ? (
                        <p className="text-xs text-gray-500 mt-1">{c.date}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        {typeof value === "string" || typeof value === "number" ? (
          <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
        ) : (
          value
        )}
      </div>
    </div>
  );
}