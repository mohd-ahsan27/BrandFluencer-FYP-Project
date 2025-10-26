import React from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";

const Influencers = () => {
  const data = [
    {
      name: "Sheela Influencer",
      category: "Dance / Lifestyle",
      followers: "1.2M",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11ihar6akV44vNZpzKQXjOPeW_WTaJCAIng&s",
      socials: [
        { icon: <FaInstagram />, color: "text-pink-500" },
        { icon: <FaTwitter />, color: "text-sky-500" },
      ],
    },
    {
      name: "Sheela 2.0",
      category: "Tech Reviewer",
      followers: "80K",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOjSMTZamTtocNQ7w4NbfV84W-0NCOMTf8Sg&s",
      socials: [
        { icon: <FaYoutube />, color: "text-red-500" },
        { icon: <FaFacebook />, color: "text-sky-500" },
      ],
    },
    {
      name: "Unknow ",
      category: "Fashion / Lifestyle",
      followers: "150K",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKRUN6JGR_z04p00-zLQqHSICrsFGFnG_vdA&s",
      socials: [
        { icon: <FaInstagram />, color: "text-pink-500" },
        { icon: <FaTiktok />, color: "text-sky-500" },
      ],
    },
  ];

  return (
    <section
      id="influencers"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-center"
    >
      <h2 className="text-4xl font-extrabold text-teal-600 mb-12 tracking-tight">
        Featured Influencers
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        {data.map((inf, i) => (
          <div
            key={i}
            className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
          >
            {/* Profile Image */}
            <div className="relative">
              <img
                src={inf.img}
                alt={inf.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-1 text-gray-800">
                {inf.name}
              </h3>
              <p className="text-gray-500">{inf.category}</p>
              <p className="text-sm text-gray-400 mb-4">
                {inf.followers} Followers
              </p>

              {/* Social Icons */}
              <div className="flex justify-center space-x-4 mb-5">
                {inf.socials.map((s, idx) => (
                  <span
                    key={idx}
                    className={`${s.color} text-xl hover:scale-110 transition-transform`}
                  >
                    {s.icon}
                  </span>
                ))}
              </div>

              <button className="bg-gradient-to-r from-teal-400 to-pink-400 text-white px-5 py-2 rounded-full shadow hover:brightness-110 transition-all">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Line */}
      <div className="relative mt-16 flex justify-center">
        <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-pink-400 rounded-full animate-pulse" />
      </div>
    </section>
  );
};

export default Influencers;
