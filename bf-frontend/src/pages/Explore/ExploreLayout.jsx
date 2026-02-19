// src/pages/Explore/ExploreLayout.jsx
import React, { useMemo, useState } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import ExploreHeader from "./components/ExploreHeader";

function getRole() {
  return localStorage.getItem("userRole") || "guest";
}

export default function ExploreLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = useMemo(getRole, []);
  const [search, setSearch] = useState("");

  // If creator hits /explore/creators, redirect them to brands view
  if (role === "creator" && location.pathname.endsWith("/creators")) {
    return <Navigate to="/explore/brands" replace />;
  }

  // If brand hits /explore/brands or /explore/campaigns, redirect to creators view
  if (role === "brand" && (location.pathname.endsWith("/brands") || location.pathname.endsWith("/campaigns"))) {
    return <Navigate to="/explore/creators" replace />;
  }

  // Optional: if guest, allow creators view but encourage login
  const onPrimaryAction = () => {
    if (role === "brand") navigate("/brand-dashboard/campaigns?new=1");
    else if (role === "creator") navigate("/creator-dashboard");
    else navigate("/brand-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50">
      <ExploreHeader role={role} search={search} setSearch={setSearch} onPrimaryAction={onPrimaryAction} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet context={{ role, search, setSearch }} />
      </div>
    </div>
  );
}