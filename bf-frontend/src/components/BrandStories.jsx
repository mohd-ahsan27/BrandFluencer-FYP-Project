import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const BrandStories = () => {
  const reviews = [
    {
      quote:
        "Brand Fluencer helped us find genuine influencers who perfectly matched our campaigns. The results were incredible!",
      name: "Clothing Brand",
      person: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Marketing Head",
    },
    {
      quote:
        "A seamless experience! We collaborated with multiple creators smoothly — definitely a must-have platform.",
      name: "Food Brand",
      person: "https://randomuser.me/api/portraits/men/46.jpg",
      role: "Brand Manager",
    },
    {
      quote:
        "Brand Fluencer is our go-to for influencer partnerships. It’s professional, efficient, and truly innovative!",
      name: "Tech Brand",
      person: "https://randomuser.me/api/portraits/women/68.jpg",
      role: "Digital Strategist",
    },
  ];

  return (
    <section
      id="brand-stories"
      className="relative py-20 overflow-hidden text-center
                 bg-gradient-to-b from-gray-950 via-gray-900 to-black"
    >
      <div className="absolute top-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-fuchsia-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 to-teal-200">
            Trusted by Leading Brands
          </span>
        </h2>
        <p className="text-white/70 mb-12 max-w-2xl mx-auto">
          Real feedback from partners using Brand Fluencer for collaborations.
        </p>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8
                         shadow-[0_18px_70px_-50px_rgba(0,0,0,0.85)]
                         hover:-translate-y-2 hover:bg-white/8 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-300 to-fuchsia-300" />

              <FaQuoteLeft className="text-teal-200 text-3xl mb-4 mx-auto opacity-80 group-hover:scale-110 transition-transform duration-300" />

              <p className="text-white/75 italic mb-6 leading-relaxed">“{r.quote}”</p>

              <div className="flex flex-col items-center">
                <img
                  src={r.person}
                  alt={r.name}
                  className="w-16 h-16 rounded-full object-cover border border-white/20 shadow-md mb-3"
                />
                <h4 className="text-lg font-semibold text-white">{r.name}</h4>
                <p className="text-sm text-white/60">{r.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-teal-300 to-fuchsia-300 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default BrandStories;