
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CreatorWelcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-400 via-cyan-400 to-pink-400 text-white px-4">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">🎉 Sign-Up Complete!</h1>
        <p className="text-white/90 mb-6">
          Welcome to <span className="font-semibold">BrandFluencer</span>!  
          Your creator profile has been successfully created.
        </p>

        <button
          onClick={() => navigate("/creator-profile")}
          className="bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-teal-50 transition"
        >
          Go to Your Profile
        </button>
      </div>
    </div>
  );
}
