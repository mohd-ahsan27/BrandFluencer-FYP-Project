import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdGridView, MdNotifications, MdSearch } from "react-icons/md";

export default function ExploreHeader({ search, setSearch }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = useMemo(() => {
    const role = localStorage.getItem("userRole") || "brand";
    const name = localStorage.getItem("userName") || "Alex Rivera";

    let title = "Brand Manager";
    if (role === "creator") title = "Creator";

    const avatar =
      localStorage.getItem("userAvatar") ||
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&auto=format&fit=crop&q=60";

    return { role, name, title, avatar };
  }, []);

  const goProfile = () => {
    setOpen(false);
    if (user.role === "creator") {
      navigate("/creator-profile");
    } else {
      navigate("/brand-profile");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-10 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 lg:gap-8">
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 bg-[#13daec] flex items-center justify-center rounded-lg text-white">
            <MdGridView className="text-2xl" />
          </div>
          <h2 className="text-slate-900 text-xl font-extrabold tracking-tight">
            BrandFluencer
          </h2>
        </div>

        <div className="flex-1 max-w-xl hidden md:block">
          <label className="relative flex items-center w-full">
            <MdSearch className="absolute left-4 text-slate-400 text-xl" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 bg-slate-100 border-none rounded-xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#13daec]/50 placeholder:text-slate-400"
              placeholder="Search creators or keywords..."
              type="text"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-800 hover:bg-[#13daec]/15 transition-colors"
            title="Notifications"
          >
            <MdNotifications className="text-[22px]" />
          </button>

          <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="flex items-center gap-3"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none text-slate-900">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400">{user.title}</p>
              </div>
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-[#13daec]/20"
                style={{ backgroundImage: `url("${user.avatar}")` }}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white shadow-lg overflow-hidden">
                <button
                  type="button"
                  onClick={goProfile}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
                >
                  Go to Profile
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-500"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-3 md:hidden">
        <label className="relative flex items-center w-full">
          <MdSearch className="absolute left-4 text-slate-400 text-xl" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-slate-100 border-none rounded-xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#13daec]/50 placeholder:text-slate-400"
            placeholder="Search creators..."
            type="text"
          />
        </label>
      </div>
    </header>
  );
}