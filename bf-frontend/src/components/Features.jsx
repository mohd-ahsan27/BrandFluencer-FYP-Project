import React from "react";
import { FaRobot, FaShieldAlt, FaChartLine, FaUsers, FaHandshake, FaBolt } from "react-icons/fa";

const Features = () => {
  const items = [
    {
      title: "Smart Matching",
      desc: "Our AI-powered engine instantly connects brands with the most relevant influencers based on audience, reach, and niche.",
      icon: <FaRobot className="text-4xl text-teal-500 mb-4" />,
    },
    {
      title: "Secure Payments",
      desc: "Enjoy safe and transparent transactions with built-in payment protection for both brands and influencers.",
      icon: <FaShieldAlt className="text-4xl text-pink-500 mb-4" />,
    },
    {
      title: "Performance Insights",
      desc: "Track real-time engagement, conversions, and ROI through our powerful analytics dashboard.",
      icon: <FaChartLine className="text-4xl text-purple-500 mb-4" />,
    },
    {
      title: "Verified Influencers",
      desc: "Every influencer profile is manually verified to ensure authenticity and genuine engagement.",
      icon: <FaUsers className="text-4xl text-orange-400 mb-4" />,
    },
    {
      title: "Easy Collaboration",
      desc: "Chat, negotiate, and finalize deals directly on our platform with no middlemen.",
      icon: <FaHandshake className="text-4xl text-blue-500 mb-4" />,
    },
    {
      title: "Instant Campaign Launch",
      desc: "Create and launch campaigns in minutes — from influencer search to results tracking.",
      icon: <FaBolt className="text-4xl text-yellow-500 mb-4" />,
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-200 to-gray-300 text-center">
      <h2 className="text-4xl font-extrabold text-teal-600 mb-12">
        Platform Features
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
        {items.map((f, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 border border-gray-100"
          >
            {f.icon}
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{f.title}</h3>
            <p className="text-gray-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
