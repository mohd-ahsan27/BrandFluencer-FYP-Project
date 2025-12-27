import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { FaInstagram, FaYoutube, FaFacebook, FaTiktok } from "react-icons/fa";

const CAMPAIGNS_KEY = "brand_dashboard_campaigns";

const PLATFORM_OPTIONS = [
  { key: "Instagram", Icon: FaInstagram, color: "text-pink-600" },
  { key: "YouTube", Icon: FaYoutube, color: "text-red-600" },
  { key: "TikTok", Icon: FaTiktok, color: "text-gray-900" },
  { key: "Facebook", Icon: FaFacebook, color: "text-blue-600" },
];

const CAMPAIGN_TYPES = [
  "Product Launch",
  "Brand Awareness",
  "Promotion / Sales",
  "UGC Content",
  "Giveaway",
  "Event Coverage",
  "Other",
];

const STATUS_OPTIONS = ["Draft", "Pending", "Active", "Completed"];

function safeUUID() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return String(Date.now());
}

function normalizePlatforms(c) {
  if (Array.isArray(c?.platforms) && c.platforms.length > 0) return c.platforms;
  if (typeof c?.platform === "string" && c.platform.trim()) return [c.platform.trim()];
  return [];
}

export default function Campaigns() {
  const { campaigns, onCampaignsChange } = useOutletContext();
  const [searchParams] = useSearchParams();

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const shouldOpenNew = useMemo(
    () => searchParams.get("new") === "1",
    [searchParams]
  );

  const [form, setForm] = useState({
    name: "",
    influencer: "",

    platforms: ["Instagram"],

    currency: "USD",
    budget: "",

    // NEW: start/end dates
    startDate: "",
    endDate: "",

    status: "Draft",

    campaignType: "Product Launch",
    productName: "",
    campaignDescription: "",

    influencerRequirements: {
      niche: "",
      followerMin: "",
      engagementMin: "",
      style: "",
    },
  });

  // Load campaigns from localStorage if page refreshes
  useEffect(() => {
    if ((campaigns || []).length > 0) return;

    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) onCampaignsChange(parsed);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (next) => {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(next));
    onCampaignsChange(next);
  };

  const togglePlatform = (platform) => {
    setForm((p) => {
      const exists = p.platforms.includes(platform);

      // do not allow removing last platform
      if (exists && p.platforms.length === 1) return p;

      const next = exists
        ? p.platforms.filter((x) => x !== platform)
        : [...p.platforms, platform];

      return { ...p, platforms: next };
    });
  };

  const updateReq = (key, value) => {
    setForm((p) => ({
      ...p,
      influencerRequirements: {
        ...(p.influencerRequirements || {}),
        [key]: value,
      },
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Campaign name is required.";
    if (!form.platforms || form.platforms.length === 0)
      return "Select at least 1 platform.";

    const budgetNum = Number(form.budget);
    if (form.budget === "" || !Number.isFinite(budgetNum) || budgetNum < 0) {
      return "Budget must be a valid number (0 or more).";
    }

    if (!form.currency) return "Please select a currency.";

    // Start/end validation (optional, but if one is provided, require both)
    const s = String(form.startDate || "").trim();
    const e = String(form.endDate || "").trim();

    if ((s && !e) || (!s && e)) {
      return "Please provide both Start Date and End Date.";
    }
    if (s && e && e < s) {
      return "End Date cannot be earlier than Start Date.";
    }

    // Influencer requirements validation (optional fields)
    const followerMin = form.influencerRequirements?.followerMin;
    if (followerMin !== "" && Number(followerMin) < 0)
      return "Follower min must be 0 or more.";

    const eng = form.influencerRequirements?.engagementMin;
    if (eng !== "" && (Number(eng) < 0 || Number(eng) > 100))
      return "Engagement % must be between 0 and 100.";

    return "";
  };

  const resetForm = () => {
    setEditingId(null);
    setError("");
    setForm({
      name: "",
      influencer: "",
      platforms: ["Instagram"],
      currency: "USD",
      budget: "",
      startDate: "",
      endDate: "",
      status: "Draft",
      campaignType: "Product Launch",
      productName: "",
      campaignDescription: "",
      influencerRequirements: {
        niche: "",
        followerMin: "",
        engagementMin: "",
        style: "",
      },
    });
  };

  const addOrUpdateCampaign = (e) => {
    e.preventDefault();
    setError("");

    const msg = validateForm();
    if (msg) {
      setError(msg);
      return;
    }

    const existing = editingId
      ? (campaigns || []).find((c) => c.id === editingId)
      : null;

    const payload = {
      id: editingId || safeUUID(),

      name: form.name.trim(),
      influencer: form.influencer.trim() || "—",

      platforms: form.platforms,

      currency: form.currency,
      budget: Number(form.budget),

      // NEW dates
      startDate: form.startDate || "",
      endDate: form.endDate || "",

      status: form.status,

      campaignType: form.campaignType,
      productName: form.productName.trim(),
      campaignDescription: form.campaignDescription.trim(),

      influencerRequirements: {
        niche: form.influencerRequirements?.niche?.trim() || "",
        followerMin:
          form.influencerRequirements?.followerMin === ""
            ? ""
            : Number(form.influencerRequirements?.followerMin),
        engagementMin:
          form.influencerRequirements?.engagementMin === ""
            ? ""
            : Number(form.influencerRequirements?.engagementMin),
        style: form.influencerRequirements?.style?.trim() || "",
      },

      // keep compatibility with old Dashboard that might sum reach
      reach: existing?.reach ?? 0,

      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    const next = editingId
      ? (campaigns || []).map((c) => (c.id === editingId ? payload : c))
      : [payload, ...(campaigns || [])];

    persist(next);
    resetForm();
  };

  const startEdit = (id) => {
    const c = (campaigns || []).find((x) => x.id === id);
    if (!c) return;

    const platforms = normalizePlatforms(c);
    const influencerReq = c?.influencerRequirements || {};

    setEditingId(id);
    setError("");

    setForm({
      name: c.name || "",
      influencer: c.influencer && c.influencer !== "—" ? c.influencer : "",

      platforms: platforms.length ? platforms : ["Instagram"],

      currency: c.currency || "USD",
      budget: c.budget ?? "",

      startDate: c.startDate || "",
      endDate: c.endDate || "",

      status: c.status || "Draft",

      campaignType: c.campaignType || "Product Launch",
      productName: c.productName || "",
      // backward compatibility: old code may have productDescription
      campaignDescription: c.campaignDescription || c.productDescription || "",

      influencerRequirements: {
        niche: influencerReq.niche || "",
        followerMin:
          influencerReq.followerMin === 0
            ? 0
            : influencerReq.followerMin ?? "",
        engagementMin:
          influencerReq.engagementMin === 0
            ? 0
            : influencerReq.engagementMin ?? "",
        style: influencerReq.style || "",
      },
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeCampaign = (id) => {
    const next = (campaigns || []).filter((c) => c.id !== id);
    persist(next);
    if (editingId === id) resetForm();
  };

  const launchCampaign = (id) => {
    const next = (campaigns || []).map((c) =>
      c.id === id ? { ...c, status: "Active", updatedAt: Date.now() } : c
    );
    persist(next);
    if (editingId === id) setForm((p) => ({ ...p, status: "Active" }));
  };

  const getStatusColor = (status) => {
    switch (status) {
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
  };

  const moneyLabel = (currency, amount) => {
    const a = Number(amount || 0);
    const formatted = Number.isFinite(a) ? a.toLocaleString() : "0";
    return String(currency || "USD").toUpperCase() === "PKR"
      ? `PKR ${formatted}`
      : `USD ${formatted}`;
  };

  const dateRangeLabel = (c) => {
    const s = c.startDate || "";
    const e = c.endDate || "";
    if (s && e) return `${s} → ${e}`;
    if (c.date) return c.date; // backward compatibility
    return "";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-[#5b2333]">Campaigns</h1>
        <p className="mt-1 text-gray-600">
          Create campaigns here. Added campaigns update your Dashboard stats.
        </p>
        {shouldOpenNew ? (
          <p className="mt-2 text-sm text-[#ff6a00] font-medium">
            Tip: Fill the form below to create a new campaign.
          </p>
        ) : null}
      </div>

      {/* Add/Edit Form */}
      <form
        onSubmit={addOrUpdateCampaign}
        className="bg-white rounded-2xl border border-gray-100 p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId ? "Edit Campaign" : "Add Campaign"}
          </h2>

          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Campaign Name">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="e.g., Summer Launch"
            />
          </Field>

          <Field label="Influencer (optional)">
            <input
              value={form.influencer}
              onChange={(e) =>
                setForm((p) => ({ ...p, influencer: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="e.g., Sarah Jenkins"
            />
          </Field>

          {/* Platforms */}
          <div className="md:col-span-2">
            <Field label="Platforms (select one or more)">
              <div className="mt-2 flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map(({ key, Icon, color }) => {
                  const selected = form.platforms.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePlatform(key)}
                      className={[
                        "px-3 py-2 rounded-xl border text-sm font-medium transition inline-flex items-center gap-2",
                        selected
                          ? "border-[#ff6a00] bg-[#ff6a00]/10 text-[#ff6a00]"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <Icon className={color} />
                      {key}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Select where the influencer will publish content.
              </p>
            </Field>
          </div>

          {/* Budget */}
          <Field label="Budget">
            <div className="flex gap-2">
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm((p) => ({ ...p, currency: e.target.value }))
                }
                className="w-28 rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="USD">USD</option>
                <option value="PKR">PKR</option>
              </select>

              <input
                type="number"
                min="0"
                value={form.budget}
                onChange={(e) =>
                  setForm((p) => ({ ...p, budget: e.target.value }))
                }
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                placeholder={form.currency === "PKR" ? "e.g., 250000" : "e.g., 5000"}
              />
            </div>
          </Field>

          {/* NEW: Start/End dates */}
          <Field label="Start Date (optional)">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, startDate: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
            />
          </Field>

          <Field label="End Date (optional)">
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, endDate: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
            />
          </Field>

          {/* Status + explanation */}
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="mt-2 text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Purpose:</span> Status
              helps track campaign progress with influencers:
              <ul className="list-disc ml-4 mt-1">
                <li><b>Draft</b>: saved idea, not finalized</li>
                <li><b>Pending</b>: waiting for influencer approvals/confirmation</li>
                <li><b>Active</b>: live/running; content is being posted</li>
                <li><b>Completed</b>: finished deliverables</li>
              </ul>
            </div>
          </Field>

          {/* Campaign product/type + description */}
          <div className="md:col-span-2">
            <Field label="Campaign Product / Type">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={form.campaignType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, campaignType: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                >
                  {CAMPAIGN_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <input
                  value={form.productName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, productName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Product name (optional)"
                />
              </div>

              <textarea
                value={form.campaignDescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, campaignDescription: e.target.value }))
                }
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
                rows={4}
                placeholder="Describe the campaign (launch/awareness/promotion), key points, deliverables, message..."
              />
            </Field>
          </div>

          {/* Influencer requirements (removed followerMax) */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-bold text-gray-900">
                Influencer Requirements (optional)
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Define niche, minimum followers, engagement, and style.
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Niche / Category">
                  <input
                    value={form.influencerRequirements.niche}
                    onChange={(e) => updateReq("niche", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g., skincare, tech, fitness"
                  />
                </Field>

                <Field label="Content Style">
                  <input
                    value={form.influencerRequirements.style}
                    onChange={(e) => updateReq("style", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g., UGC, review, unboxing"
                  />
                </Field>

                <Field label="Minimum Followers">
                  <input
                    type="number"
                    min="0"
                    value={form.influencerRequirements.followerMin}
                    onChange={(e) => updateReq("followerMin", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g., 10000"
                  />
                </Field>

                <Field label="Min Engagement %">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.influencerRequirements.engagementMin}
                    onChange={(e) => updateReq("engagementMin", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g., 3"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white font-semibold hover:opacity-95 transition"
        >
          {editingId ? "Update Campaign" : "Add Campaign"}
        </button>
      </form>

      {/* Campaigns List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#5b2333]">All Campaigns</h3>
          <span className="text-sm text-gray-500">{(campaigns || []).length} total</span>
        </div>

        {(campaigns || []).length === 0 ? (
          <div className="p-6 text-gray-500">
            No campaigns yet. Add your first campaign above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Platforms</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {(campaigns || []).map((camp) => {
                  const platforms = normalizePlatforms(camp);
                  const showLaunch = camp.status !== "Active" && camp.status !== "Completed";
                  const range = dateRangeLabel(camp);

                  return (
                    <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {camp.name}
                        <span className="block text-xs text-gray-400 font-normal mt-0.5">
                          {camp.campaignType ? `${camp.campaignType}` : ""}
                          {camp.productName ? ` • ${camp.productName}` : ""}
                          {range ? ` • ${range}` : ""}
                        </span>

                        {camp.campaignDescription || camp.productDescription ? (
                          <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                            {camp.campaignDescription || camp.productDescription}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-6 py-4">
                        {platforms.length ? (
                          <div className="flex flex-wrap gap-2">
                            {platforms.map((p) => (
                              <span
                                key={p}
                                className="px-2 py-1 rounded-full text-xs border border-gray-200 bg-white text-gray-700"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-900">
                        {moneyLabel(camp.currency || "USD", camp.budget)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            camp.status
                          )}`}
                        >
                          {camp.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startEdit(camp.id)}
                            className="text-gray-600 hover:text-[#ff6a00] transition-colors font-medium"
                          >
                            Edit
                          </button>

                          {showLaunch ? (
                            <button
                              type="button"
                              onClick={() => launchCampaign(camp.id)}
                              className="text-green-700 hover:text-green-800 transition-colors font-medium"
                              title="Set status to Active"
                            >
                              Launch
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => removeCampaign(camp.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}