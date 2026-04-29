import React, { useEffect, useState } from "react";
import { getSettings, saveSettings } from "../../data/settingsStore";

export default function AdminSettings() {
  const [text, setText] = useState("");

  useEffect(() => {
    const s = getSettings();
    const raw = s && s.categoriesText ? String(s.categoriesText) : "";
    setText(raw);
  }, []);

  const onSave = () => {
    const next = { categoriesText: text, updatedAt: Date.now() };
    saveSettings(next);
    alert("Settings saved (demo).");
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <h2 className="text-xl font-extrabold text-slate-900">Settings (Demo)</h2>
      <p className="text-sm text-slate-600 mt-1">
        Store platform settings in localStorage.
      </p>

      <div className="mt-6">
        <label className="text-sm font-semibold text-slate-800">
          Categories (one per line)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="Fashion&#10;Tech&#10;Food"
        />
      </div>

      <button
        type="button"
        onClick={onSave}
        className="mt-4 px-5 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 transition"
      >
        Save Settings
      </button>
    </div>
  );
}