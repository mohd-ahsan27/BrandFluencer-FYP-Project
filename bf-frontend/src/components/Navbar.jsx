import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { useLoginModal } from "../context/LoginModalContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { openLogin, openSignup } = useLoginModal();

  const isHome = location.pathname === "/";

  const sections = useMemo(
    () => [
      { label: "Home", id: "home" },
      { label: "About", id: "about" },
      { label: "Features", id: "features" },
      { label: "How It Works", id: "how-it-works" },
      { label: "Influencers", id: "influencers" },
      { label: "Brand Stories", id: "brand-stories" },
    ],
    []
  );

  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goToSection = (id) => {
    setIsOpen(false);

    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (!isHome) {
      navigate("/");
      setTimeout(scroll, 150);
    } else {
      scroll();
    }
  };

  const btnBase =
    "h-10 w-32 inline-flex items-center justify-center gap-2 rounded-full font-semibold transition";

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* ✅ Logo (left) */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-pink-500"
          onClick={() => setIsOpen(false)}
        >
          Brand<span className="text-gray-800">Fluencer</span>
        </Link>

        {/* ✅ Desktop Menu (center) */}
        <ul className="hidden lg:flex flex-1 justify-center items-center gap-1 text-sm font-semibold text-gray-700">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goToSection(s.id)}
                className="px-4 py-2 rounded-full hover:bg-gray-50 hover:text-teal-600 transition"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        {/* ✅ Desktop buttons (right) — same size */}
        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={openLogin}
            className={`${btnBase} border border-gray-200 bg-white hover:bg-gray-50 text-gray-800`}
          >
            <FiLogIn />
            Login
          </button>

          <button
            type="button"
            onClick={openSignup}
            className={`${btnBase} bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95`}
          >
            <FiUserPlus />
            Sign Up
          </button>
        </div>

        {/* ✅ Mobile (right): burger only, clean */}
        <div className="lg:hidden ml-auto flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
            onClick={() => setIsOpen((s) => !s)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <FaTimes className="text-xl text-gray-700" />
            ) : (
              <FaBars className="text-xl text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* panel */}
        <div
          className={`absolute top-0 left-0 h-full w-[86%] max-w-sm bg-white shadow-xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-pink-500"
            >
              Brand<span className="text-gray-800">Fluencer</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition"
              aria-label="Close menu"
            >
              <FaTimes className="text-xl text-gray-700" />
            </button>
          </div>

          <div className="px-6 py-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
              Pages
            </p>

            <ul className="mt-4 space-y-2 text-gray-800 font-semibold">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goToSection(s.id)}
                    className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gray-50 transition"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* ✅ Mobile buttons */}
            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openLogin();
                }}
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition font-semibold"
              >
                <FiLogIn />
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openSignup();
                }}
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95 transition font-semibold"
              >
                <FiUserPlus />
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;