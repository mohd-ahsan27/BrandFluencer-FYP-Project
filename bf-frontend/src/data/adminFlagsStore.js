const KEY = "bf_admin_flags_v1";

function safeParse(raw) {
  if (!raw) return { creators: {}, brands: {} };
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return { creators: {}, brands: {} };
    if (!data.creators) data.creators = {};
    if (!data.brands) data.brands = {};
    return data;
  } catch {
    return { creators: {}, brands: {} };
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function isCreatorBlocked(creatorId) {
  const f = safeParse(localStorage.getItem(KEY));
  return f.creators[String(creatorId)] === "blocked";
}

export function setCreatorBlocked(creatorId, blocked) {
  const f = safeParse(localStorage.getItem(KEY));
  if (blocked) f.creators[String(creatorId)] = "blocked";
  else f.creators[String(creatorId)] = "active";
  save(f);
}

export function isBrandBlocked(brandKey) {
  const f = safeParse(localStorage.getItem(KEY));
  return f.brands[String(brandKey)] === "blocked";
}

export function setBrandBlocked(brandKey, blocked) {
  const f = safeParse(localStorage.getItem(KEY));
  if (blocked) f.brands[String(brandKey)] = "blocked";
  else f.brands[String(brandKey)] = "active";
  save(f);
}