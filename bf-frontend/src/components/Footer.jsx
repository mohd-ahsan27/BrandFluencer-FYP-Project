import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => (
  <footer className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white py-12 overflow-hidden">
    {/* Decorative blur circles */}
    <div className="absolute top-0 left-10 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
    
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-pink-400 bg-clip-text text-transparent">
        Brand Fluencer
      </h2>

      {/* Navigation links */}
      <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
        <a href="#home" className="hover:text-teal-400 transition-colors duration-300">Home</a>
        <a href="#about" className="hover:text-teal-400 transition-colors duration-300">About</a>
        <a href="#features" className="hover:text-teal-400 transition-colors duration-300">Features</a>
        <a href="#contact" className="hover:text-teal-400 transition-colors duration-300">Contact</a>
        <a href="#privacy" className="hover:text-teal-400 transition-colors duration-300">Privacy Policy</a>
      </div>

      {/* Social icons */}
      <div className="flex justify-center gap-6 mt-6">
        <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-gradient-to-r from-teal-400 to-pink-400 transition-all duration-500">
          <FaFacebook className="text-xl" />
        </a>
        <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-gradient-to-r from-pink-400 to-orange-400 transition-all duration-500">
          <FaInstagram className="text-xl" />
        </a>
        <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-500">
          <FaLinkedin className="text-xl" />
        </a>
        <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-500">
          <FaTiktok className="text-xl" />
        </a>
        <a href="#" className="p-3 rounded-full bg-gray-800 hover:bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-500">
          <FaYoutube className="text-xl" />
        </a>
        
      </div>

      {/* Divider line */}
      <div className="w-24 h-0.5 bg-gradient-to-r from-teal-400 to-pink-400 mx-auto mt-8"></div>

      
      <p className="text-gray-500 text-sm mt-6">
        © {new Date().getFullYear()} <span className="text-white font-medium">Brand Fluencer</span>. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
