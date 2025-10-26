import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      id="about"
      className="relative py-20 bg-gradient-to-b from-white to-teal-50 overflow-hidden"
    >
      {/* Decorative gradient blur circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl font-extrabold text-teal-600 mb-6">
            About Our Platform
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            <span className="font-semibold text-pink-500">Brand Fluencer</span> bridges the gap between
            brands and influencers by providing a smart, intuitive, and transparent platform
            that fosters <span className="text-teal-500 font-semibold">genuine collaborations.</span>
          </p>
          <p className="text-gray-600 leading-relaxed text-base">
            Whether you’re an influencer seeking growth opportunities or a brand aiming to
            reach the right audience, our AI-driven system ensures effortless partnerships,
            secure payments, and measurable campaign success — all in one place.
          </p>

          <a
            href="#features"
            className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-teal-500 to-pink-400 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Explore Features
          </a>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1"
        >
          <img
            src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
            alt="About Brand Fluencer"
            className="rounded-2xl shadow-lg mx-auto md:mx-0"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
