import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  // Check if a brand is already logged in (using your existing localStorage key)
  const isBrandLoggedIn = () => {
    try {
      const auth = localStorage.getItem("brand_auth");
      if (auth) {
        const parsed = JSON.parse(auth);
        return parsed.loggedIn === true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleFindInfluencers = (e) => {
    if (isBrandLoggedIn()) {
      navigate("/explore");
    } else {
      // Not a brand → redirect to Brand Sign-Up with smooth message
      navigate("/brand-sign-up");
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-24 min-h-[90vh] flex flex-col items-center justify-center text-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white"
    >
      {/* Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[420px] h-[420px] bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[520px] h-[520px] bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.08),transparent_65%)] pointer-events-none" />

      {/* Badge
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur"
      >
        <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-400 to-pink-400 animate-pulse" />
        <span className="text-sm text-gray-200 font-medium">
          {isBrandLoggedIn() ? "Welcome back, Brand!" : "Connect brands with creators that actually convert"}
        </span>
      </motion.div> */}

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-5xl md:text-7xl font-extrabold mb-6 max-w-5xl leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
      >
        Empowering{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-pink-400">
          Brands
        </span>{" "}
        with Real Influence
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        className="z-10 text-lg md:text-2xl mb-12 max-w-3xl text-gray-200 font-light"
      >
        Build meaningful collaborations with genuine creators who share your brand’s values and audience.
      </motion.p>

      {/* Smart Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="flex flex-col sm:flex-row gap-6 z-10"
      >
        {/* SMART BUTTON: Find Influencers */}
        <button
          onClick={handleFindInfluencers}
          className="group px-10 py-5 rounded-full font-bold text-lg transition-all duration-300
                     border border-white/20 bg-white/10 backdrop-blur-xl
                     hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 
                     hover:shadow-2xl hover:shadow-teal-500/30
                     flex items-center justify-center gap-3"
        >
          <span>{isBrandLoggedIn() ? "Go to Explore" : "Find Influencers as Brand"}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>

        {/* Creator Button */}
        <Link
          to="/creator-sign-up"
          className="px-10 py-5 rounded-full font-bold text-lg text-gray-900 transition-all duration-300
                     bg-gradient-to-r from-teal-400 via-cyan-400 to-pink-400
                     hover:brightness-110 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/50
                     flex items-center justify-center gap-3"
        >
          <span>Join as Creator</span>
         
        </Link>
      </motion.div>

      {/* Optional subtle text below buttons */}
      {!isBrandLoggedIn() && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 text-sm text-gray-400"
        >
          Brands: Click "Find Influencers" to sign up → explore thousands of creators
        </motion.p>
      )}
    </section>
  );
};

export default Hero;