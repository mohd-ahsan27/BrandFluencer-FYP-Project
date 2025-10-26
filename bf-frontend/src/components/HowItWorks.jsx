import React from "react";
import { FaUserPlus, FaHandshake, FaRocket } from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUserPlus className="text-5xl text-teal-500 mb-4" />,
      title: "Sign Up",
      desc: "Create your free account as a brand or influencer and set up your profile in minutes.",
    },
    {
      icon: <FaHandshake className="text-5xl text-pink-500 mb-4" />,
      title: "Connect",
      desc: "Discover your perfect match! Brands find influencers that fit their niche and audience.",
    },
    {
      icon: <FaRocket className="text-5xl text-purple-500 mb-4" />,
      title: "Collaborate",
      desc: "Launch your campaign, collaborate seamlessly, and watch your brand presence grow.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 text-center"
    >
      <h2 className="text-4xl font-extrabold text-teal-600 mb-12 tracking-tight">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        {steps.map((s, i) => (
          <div
            key={i}
            className="group bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-500 border border-gray-100"
          >
            <div className="flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
              {s.icon}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              {s.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Decorative line animation */}
      <div className="relative mt-16 flex justify-center">
        <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-pink-400 rounded-full animate-pulse" />
      </div>
    </section>
  );
};

export default HowItWorks;
