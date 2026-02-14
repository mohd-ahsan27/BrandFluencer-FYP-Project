// src/pages/Explore/components/FilterChip.jsx
import React from "react";

export default function FilterChip({ selected, label, onClick }) {
  let cls =
    "px-3 py-1.5 rounded-full text-sm font-medium transition border ";
  if (selected) {
    cls += "bg-gradient-to-r from-sky-500 to-violet-500 text-white border-transparent shadow";
  } else {
    cls += "bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {label}
    </button>
  );
}