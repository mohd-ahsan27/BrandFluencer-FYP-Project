const REPORTS_KEY = "bf_reports";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `rep_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function safeParseArray(raw) {
  try {
    const data = raw ? JSON.parse(raw) : [];
    if (Array.isArray(data)) return data;
    return [];
  } catch {
    return [];
  }
}

export function addReport(input) {
  const type = String(input?.type || "").trim();
  const targetId = String(input?.targetId || input?.id || "").trim();
  const reason = String(input?.reason || "").trim();

  if (!type || !targetId) {
    throw new Error("Report must include type and targetId.");
  }

  const report = {
    id: makeId(),
    type,
    targetId,
    targetName: String(input?.targetName || "").trim(),
    reason: reason || "Not specified",
    details: String(input?.details || "").trim(),
    reporterRole: String(input?.reporterRole || "guest").trim(),
    reporterName: String(input?.reporterName || "").trim(),
    status: "open",
    createdAt: Date.now(),
  };

  const prev = safeParseArray(localStorage.getItem(REPORTS_KEY));
  prev.unshift(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(prev));
  return report;
}

export function getReports() {
  return safeParseArray(localStorage.getItem(REPORTS_KEY));
}

export function updateReportStatus(reportId, status) {
  const nextStatus = String(status || "").trim();
  const list = safeParseArray(localStorage.getItem(REPORTS_KEY));

  const updated = list.map((r) => {
    if (String(r.id) !== String(reportId)) return r;
    return { ...r, status: nextStatus || "open" };
  });

  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  return updated;
}

export function removeReport(reportId) {
  const list = safeParseArray(localStorage.getItem(REPORTS_KEY));
  const updated = list.filter((r) => String(r.id) !== String(reportId));
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  return updated;
}