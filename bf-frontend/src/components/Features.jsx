import React from "react";
import {
  FaRobot,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaHandshake,
  FaBolt,
} from "react-icons/fa";

const Features = () => {
  const items = [
    {
      title: "Smart Matching",
      desc: "Our AI-powered engine instantly connects brands with the most relevant influencers based on audience, reach, and niche.",
      Icon: FaRobot,
      grad: "from-teal-400 to-pink-400",
    },
    {
      title: "Secure Payments",
      desc: "Enjoy safe and transparent transactions with built-in payment protection for both brands and influencers.",
      Icon: FaShieldAlt,
      grad: "from-pink-400 to-purple-400",
    },
    {
      title: "Performance Insights",
      desc: "Track real-time engagement, conversions, and ROI through our powerful analytics dashboard.",
      Icon: FaChartLine,
      grad: "from-purple-400 to-teal-400",
    },
    {
      title: "Verified Influencers",
      desc: "Every influencer profile is manually verified to ensure authenticity and genuine engagement.",
      Icon: FaUsers,
      grad: "from-teal-300 to-sky-400",
    },
    {
      title: "Easy Collaboration",
      desc: "Chat, negotiate, and finalize deals directly on our platform with no middlemen.",
      Icon: FaHandshake,
      grad: "from-sky-400 to-pink-400",
    },
    {
      title: "Instant Campaign Launch",
      desc: "Create and launch campaigns in minutes from influencer search to results tracking.",
      Icon: FaBolt,
      grad: "from-amber-300 to-pink-400",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black text-center"
    >
      {/* Glow blobs */}
      <div className="absolute top-0 left-10 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl" />

      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-pink-400">
            Platform Features
          </span>
        </h2>
        <p className="text-gray-300 mb-12 max-w-2xl mx-auto px-4">
          Everything you need to discover creators, run campaigns, and track results — in one place.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {items.map((f, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8
                         shadow-[0_20px_70px_-45px_rgba(0,0,0,0.8)]
                         hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4 mb-5">
                <div
                  className={[
                    "h-14 w-14 rounded-2xl grid place-items-center",
                    "bg-gradient-to-br",
                    f.grad,
                    "shadow-sm",
                  ].join(" ")}
                >
                  <f.Icon className="text-2xl text-gray-900" />
                </div>

                <h3 className="text-xl font-semibold text-white">{f.title}</h3>
              </div>

              <p className="text-gray-300 leading-relaxed">{f.desc}</p>

              <div className="mt-6 h-0.5 w-20 bg-gradient-to-r from-teal-400/70 to-pink-400/70 rounded-full opacity-60 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>

        <div className="relative mt-16 flex justify-center">
          <div className="w-28 h-1 bg-gradient-to-r from-teal-400 to-pink-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Features;