import { getCreators } from "../../../data/creatorsStore";
import { creators as sampleCreators } from "../ExploreSampleData";

export const brands = [
  {
    id: "b1",
    name: "BluePeak Clothing",
    category: "Fashion",
    location: "Lahore, PK",
    website: "https://bluepeak.com",
    about:
      "Premium streetwear brand focused on Gen‑Z drops and creator-led launches.",
    logo:
      "https://images.unsplash.com/photo-1520975958225-1d49dbfa31b3?w=600&auto=format&fit=crop&q=70",
    tags: ["Streetwear", "Drops", "UGC"],
  },
  {
    id: "b2",
    name: "NovaTech",
    category: "Tech",
    location: "Karachi, PK",
    website: "https://novatech.io",
    about:
      "Consumer electronics brand looking for creators for reviews, unboxings, and UGC.",
    logo:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=70",
    tags: ["Reviews", "Unboxing", "UGC"],
  },
  {
    id: "b3",
    name: "FreshBite",
    category: "Food",
    location: "Islamabad, PK",
    website: "https://freshbite.pk",
    about:
      "Food & beverage brand partnering with creators for short-form content and promos.",
    logo:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=70",
    tags: ["Shorts", "Lifestyle", "Events"],
  },
];

export const campaigns = [
  {
    id: "cp1",
    title: "Summer Drop Launch",
    brandId: "b1",
    brandName: "BluePeak Clothing",
    platform: "Instagram",
    budgetUSD: 1500,
    deadline: "2026-03-15",
    tags: ["Fashion", "Reels", "OOTD"],
  },
  {
    id: "cp2",
    title: "Gadget Review Collaboration",
    brandId: "b2",
    brandName: "NovaTech",
    platform: "YouTube",
    budgetUSD: 2500,
    deadline: "2026-04-01",
    tags: ["Tech", "Review", "Unboxing"],
  },
  {
    id: "cp3",
    title: "Food Festival Promo",
    brandId: "b3",
    brandName: "FreshBite",
    platform: "TikTok",
    budgetUSD: 900,
    deadline: "2026-03-22",
    tags: ["Food", "Shorts", "Vlog"],
  },
];

function safeGetStoredCreators() {
  try {
    const arr = getCreators();
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function getExploreCreators() {
  const stored = safeGetStoredCreators();
  const storedIds = new Set(stored.map((c) => String(c.id)));

  const extras = (Array.isArray(sampleCreators) ? sampleCreators : []).filter(
    (c) => !storedIds.has(String(c.id))
  );

  return [...stored, ...extras];
}

export function getCreatorCategories(creatorsList) {
  const set = new Set();
  (creatorsList || []).forEach((c) => {
    (c.categories || []).forEach((x) => set.add(x));
  });
  return Array.from(set).sort();
}

export function getBrandCategories() {
  const set = new Set();
  brands.forEach((b) => set.add(b.category));
  return Array.from(set).sort();
}