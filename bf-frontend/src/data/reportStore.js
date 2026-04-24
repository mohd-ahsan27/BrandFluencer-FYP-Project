const REPORTS_KEY = "bf_reports";

export function addReport({ type, id, reason = "Reported from Explore" }) {
  const item = { type, id, reason, at: Date.now() };

  let prev = [];
  try {
    prev = JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
    if (!Array.isArray(prev)) prev = [];
  } catch {
    prev = [];
  }

  prev.unshift(item);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(prev));
  return item;
}

export function getReports() {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}