import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const BrandStories = () => {
  const reviews = [
    {
      quote:
        "Brand Fluencer helped us find genuine influencers who perfectly matched our campaigns. The results were incredible!",
      name: "Clothing Brand",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Nestle_textlogo.svg/2560px-Nestle_textlogo.svg.png",
      person: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Marketing Head",
    },
    {
      quote:
        "A seamless experience! We collaborated with multiple creators smoothly — definitely a must-have platform.",
      name: "Food Brand",
      img: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
      person: "https://randomuser.me/api/portraits/men/46.jpg",
      role: "Brand Manager",
    },
    {
      quote:
        "Brand Fluencer is our go-to for influencer partnerships. It’s professional, efficient, and truly innovative!",
      name: "Tech Brand",
      img: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Coca-Cola_logo.svg",
      person: "https://randomuser.me/api/portraits/women/68.jpg",
      role: "Digital Strategist",
    },
  ];

  return (
    <section
      id="brand-stories"
      className="py-20 bg-gradient-to-b from-white to-teal-50 text-center"
    >
      <h2 className="text-4xl font-extrabold text-teal-600 mb-4">
        Trusted by Leading Brands
      </h2>
      <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
        Our platform bridges the gap between brands and authentic influencers —
        here’s what our partners have to say.
      </p>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 max-w-7xl mx-auto px-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 border border-teal-100 p-8 relative overflow-hidden group"
          >
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-pink-400 rounded-t-3xl"></div>

        
            <FaQuoteLeft className="text-teal-400 text-3xl mb-4 mx-auto opacity-70 group-hover:scale-110 transition-transform duration-300" />

            
            <p className="text-gray-600 italic mb-6 leading-relaxed">
              “{r.quote}”
            </p>

            
            <div className="flex flex-col items-center">
              <img
                src={r.person}
                alt={r.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md mb-3"
              />
              <h4 className="text-lg font-semibold text-gray-800">{r.name}</h4>
              <p className="text-sm text-gray-500 mb-3">{r.role}</p>
              {/* <img src={r.img} alt={r.name} className="h-6 opacity-80" /> */}
            </div>
          </div>
        ))}
      </div>


      <div className="relative mt-16 flex justify-center">
        <div className="w-32 h-1 bg-gradient-to-r from-teal-400 to-pink-400 rounded-full animate-pulse" />
      </div>
    </section>
  );
};

export default BrandStories;
