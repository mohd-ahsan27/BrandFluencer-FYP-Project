import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiUser, FiBriefcase } from "react-icons/fi";
import { useLoginModal } from "../context/LoginModalContext";

export default function LoginChooserModal() {
  const navigate = useNavigate();
  const { open, mode, closeModal } = useLoginModal();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeModal]);

  const title = mode === "signup" ? "Sign Up" : "Login";
  const subtitle =
    mode === "signup"
      ? "Choose how you want to create your account."
      : "Choose how you want to login.";

  const routes = useMemo(() => {
    return mode === "signup"
      ? { creator: "/creator-sign-up", brand: "/brand-sign-up" }
      : { creator: "/creator-login", brand: "/brand-login" };
  }, [mode]);

  if (!open) return null;

  const go = (path) => {
    closeModal();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

      {/* Modal */}
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-xl p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center text-gray-700"
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() => go(routes.creator)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                  <FiUser />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Creator {mode === "signup" ? "Sign Up" : "Login"}
                  </p>
                  <p className="text-sm text-gray-600">For influencers / creators</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => go(routes.brand)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white flex items-center justify-center">
                  <FiBriefcase />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Brand {mode === "signup" ? "Sign Up" : "Login"}
                  </p>
                  <p className="text-sm text-gray-600">For brands / companies</p>
                </div>
              </div>
            </button>
          </div>

        
        </div>
      </div>
    </div>
  );
}