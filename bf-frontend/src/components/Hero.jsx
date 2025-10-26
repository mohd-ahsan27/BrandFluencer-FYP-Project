import React from "react";
import { motion } from "framer-motion";

const Hero = () => (
  <section
    id="home"
    className="relative overflow-hidden pt-32 pb-24 min-h-[90vh] flex flex-col items-center justify-center text-center bg-gradient-to-br from-teal-600 via-blue-500 to-purple-600 text-white"
  >
    {/* Subtle glowing background elements */}
    <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-[-120px] right-[-100px] w-[500px] h-[500px] bg-teal-300/20 rounded-full blur-3xl animate-pulse"></div>

    {/* Motion Heading */}
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-5xl md:text-7xl font-extrabold mb-6 max-w-4xl leading-tight drop-shadow-lg"
    >
      Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">Brands</span>{" "}
      with Real Influence
    </motion.h1>

    {/* Subtitle */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.3, ease: "easeOut" }}
      className="text-lg md:text-2xl mb-10 max-w-3xl text-gray-100"
    >
      Build meaningful collaborations with genuine creators who share your brand’s values and audience.
    </motion.p>

    {/* Call to Action Buttons */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="flex flex-col sm:flex-row gap-5 z-10"
    >
      <a
        href="/search"
        className="px-8 py-3 bg-white text-teal-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
      >
        Find Influencers
      </a>
      <a
        href="/creator-signup"
        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-teal-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
      >
        Join as Creator
      </a>
    </motion.div>

    {/* Floating subtle dots / particles effect */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none"></div>
  </section>
);

export default Hero;
