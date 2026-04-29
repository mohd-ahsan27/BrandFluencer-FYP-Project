const KEY = "bf_settings";

function safeRead() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (data && typeof data === "object") return data;
    return {};
  } catch {
    return {};
  }
}

function save(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

export function getSettings() {
  return safeRead();
}

export function saveSettings(next) {
  save(next || {});
}