import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* ✅ Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-pink-500"
        >
          Brand<span className="text-gray-800">Fluencer</span>
        </Link>

        {/* ✅ Desktop Menu */}
        <ul className="hidden lg:flex space-x-8 font-medium text-gray-700">
          <li>
            <a href="#home" className="hover:text-teal-500 transition">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-teal-500 transition">
              About
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-teal-500 transition">
              Features
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="hover:text-teal-500 transition">
              How It Works
            </a>
          </li>
          <li>
            <a href="#influencers" className="hover:text-teal-500 transition">
              Influencers
            </a>
          </li>
          <li>
            <a href="#brand-stories" className="hover:text-teal-500 transition">
              Brand Stories
            </a>
          </li>
        </ul>

        {/* ✅ Desktop Buttons */}
        <div className="hidden lg:flex space-x-4">
          <button
            onClick={() => navigate("/creator-sign-up")}
            className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:scale-105 hover:opacity-90 transition"
          >
            Join as Influencer
          </button>
          <button
            onClick={() => navigate("/brand-sign-up")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:scale-105 hover:opacity-90 transition"
          >
            Join as Brand
          </button>
        </div>

        {/* ✅ Mobile Menu Toggle */}
        <div
          className="lg:hidden text-2xl text-gray-700 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* ✅ Mobile Drawer Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-md shadow-md transform transition-transform duration-300 ${
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
          <FaTimes
            className="text-2xl text-gray-700 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* ✅ Menu Links */}
        <ul className="flex flex-col items-center mt-8 space-y-6 text-gray-800 font-medium text-lg">
          <li>
            <a href="#home" onClick={() => setIsOpen(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={() => setIsOpen(false)}>
              About
            </a>
          </li>
          <li>
            <a href="#features" onClick={() => setIsOpen(false)}>
              Features
            </a>
          </li>
          <li>
            <a href="#how-it-works" onClick={() => setIsOpen(false)}>
              How It Works
            </a>
          </li>
          <li>
            <a href="#influencers" onClick={() => setIsOpen(false)}>
              Influencers
            </a>
          </li>
          <li>
            <a href="#brand-stories" onClick={() => setIsOpen(false)}>
              Brand Stories
            </a>
          </li>
        </ul>

        {/* ✅ Mobile Buttons */}
        <div className="flex flex-col items-center mt-10 space-y-4 px-6">
          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/creator-sign-up");
            }}
            className="w-full max-w-xs bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition"
          >
            Join as Influencer
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/brand-sign-up");
            }}
            className="w-full max-w-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition"
          >
            Join as Brand
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
