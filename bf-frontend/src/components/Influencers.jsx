import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Influencers = () => {
  const data = [
    {
      name: "Sheela Influencer",
      category: "Dance / Lifestyle",
      followers: "1.2M",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11ihar6akV44vNZpzKQXjOPeW_WTaJCAIng&s",
      socials: [
        { icon: <FaInstagram />, color: "text-pink-300" },
        { icon: <FaTwitter />, color: "text-sky-300" },
      ],
    },
    {
      name: "Sheela 2.0",
      category: "Tech Reviewer",
      followers: "80K",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOjSMTZamTtocNQ7w4NbfV84W-0NCOMTf8Sg&s",
      socials: [
        { icon: <FaYoutube />, color: "text-red-300" },
        { icon: <FaFacebook />, color: "text-sky-300" },
      ],
    },
    {
      name: "Unknow",
      category: "Fashion / Lifestyle",
      followers: "150K",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKRUN6JGR_z04p00-zLQqHSICrsFGFnG_vdA&s",
      socials: [
        { icon: <FaInstagram />, color: "text-pink-300" },
        { icon: <FaTiktok />, color: "text-teal-200" },
      ],
    },
  ];

  return (
    <section
      id="influencers"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black text-center"
    >
      {/* Glow blobs */}
      <div className="absolute top-0 left-10 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl" />

      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-pink-400">
            Featured Influencers
          </span>
        </h2>
        <p className="text-gray-300 mb-12 max-w-2xl mx-auto px-6">
          Explore verified creators and find the perfect match for your next campaign.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {data.map((inf, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl
                         shadow-[0_20px_70px_-45px_rgba(0,0,0,0.8)]
                         hover:-translate-y-2 hover:bg-white/10 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={inf.img}
                  alt={inf.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white
                                border border-white/15 bg-white/10 backdrop-blur">
                  {inf.followers} Followers
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-1 text-white">
                  {inf.name}
                </h3>
                <p className="text-gray-300">{inf.category}</p>

                {/* Socials */}
                <div className="flex justify-center space-x-4 my-5">
                  {inf.socials.map((s, idx) => (
                    <span
                      key={idx}
                      className={`${s.color} text-xl hover:scale-110 transition-transform`}
                    >
                      {s.icon}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-teal-400 to-pink-400 text-gray-900 font-semibold
                                   px-5 py-2 rounded-full shadow hover:brightness-110 transition-all">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-pink-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Influencers;