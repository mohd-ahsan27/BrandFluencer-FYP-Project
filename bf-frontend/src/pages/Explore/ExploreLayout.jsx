import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import ExploreHeader from "./components/ExploreHeader";

function detectRole() {
  const role = localStorage.getItem("userRole");
  if (role === "brand") return "brand";
  if (role === "creator") return "creator";

  try {
    const c = JSON.parse(localStorage.getItem("creator_auth") || "{}");
    if (c.loggedIn) return "creator";
  } catch {}

  try {
    const b = JSON.parse(localStorage.getItem("brand_auth") || "{}");
    if (b.loggedIn) return "brand";
  } catch {}

  return "guest";
}

export default function ExploreLayout() {
  const role = useMemo(detectRole, []);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50">
      <ExploreHeader role={role} search={search} setSearch={setSearch} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet context={{ role, search }} />
      </div>
    </div>
  );
}