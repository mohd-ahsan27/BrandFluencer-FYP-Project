
import creators from "../../../data/creatorSampleData";

export const brands = [
  {
    id: "b1",
    name: "BluePeak Clothing",
    industry: "Fashion",
    location: "Lahore, PK",
    website: "bluepeak.com",
    budgetUSD: 5000,
    logo: "https://images.unsplash.com/photo-1520975958225-1d49dbfa31b3?w=400&q=70",
  },
  {
    id: "b2",
    name: "NovaTech",
    industry: "Tech",
    location: "Karachi, PK",
    website: "novatech.io",
    budgetUSD: 12000,
    logo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=70",
  },
  {
    id: "b3",
    name: "FreshBite",
    industry: "Food",
    location: "Islamabad, PK",
    website: "freshbite.pk",
    budgetUSD: 3000,
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70",
  },
];

// Basic campaign sample data for creators to browse
export const campaigns = [
  {
    id: "cp1",
    title: "Summer Drop Launch",
    brand: "BluePeak Clothing",
    platform: "Instagram",
    budgetUSD: 1500,
    deadline: "2026-03-15",
    tags: ["Fashion", "Reels", "OOTD"],
  },
  {
    id: "cp2",
    title: "Gadget Review Collaboration",
    brand: "NovaTech",
    platform: "YouTube",
    budgetUSD: 2500,
    deadline: "2026-04-01",
    tags: ["Tech", "Review", "Unboxing"],
  },
  {
    id: "cp3",
    title: "Food Festival Promo",
    brand: "FreshBite",
    platform: "TikTok",
    budgetUSD: 900,
    deadline: "2026-03-22",
    tags: ["Food", "Shorts", "Vlog"],
  },
];

// Normalize creators data (your sample data may be different shapes)
export const creatorsNormalized = (Array.isArray(creators) ? creators : []).map((c) => ({
  id: c.id,
  name: c.name,
  category: c.category || c.niche || "Creator",
  location: c.location || "—",
  price: Number(c.price || 0),
  rating: Number(c.rating || 0),
  followers: parseFollowers(c.followers),
  image: c.image,
}));

function parseFollowers(v) {
  // supports: "120K", "1.2M", 120000, etc.
  if (typeof v === "number") return v;
  const s = String(v || "").trim().toUpperCase();
  if (!s) return 0;
  if (s.endsWith("M")) return Math.round(parseFloat(s) * 1_000_000);
  if (s.endsWith("K")) return Math.round(parseFloat(s) * 1_000);
  const n = Number(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}