import React from "react";
import { useParams } from "react-router-dom";

// Temporary dummy data (replace with API later)
const creators = [
  {
    id: "1",
    name: "Pearline Mcjanny",
    username: "@pearline",
    location: "Chicago, US",
    category: ["Fashion", "Lifestyle", "Fitness"],
    price: "$50",
    rating: 4.8,
    followers: "120K",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    bio:
      "I am a fashion and lifestyle content creator focusing on modern trends and daily styling inspiration.",
    socials: {
      instagram: "https://instagram.com",
      tiktok: "https://tiktok.com",
      youtube: "",
    },
  },
  {
    id: "2",
    name: "Tazmin Mohamed",
    username: "@tazfit",
    location: "Dubai, UAE",
    category: ["Fitness", "Health"],
    price: "$100",
    rating: 5.0,
    followers: "93.5K",
    image:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126",
    bio:
      "Certified fitness trainer helping brands promote healthy and active lifestyles.",
    socials: {
      instagram: "https://instagram.com",
      tiktok: "",
      youtube: "https://youtube.com",
    },
  },
];

const CreatorProfile = () => {
  const { id } = useParams();
  const creator = creators.find((c) => c.id === id);

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Creator not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            <img
              src={creator.image}
              alt={creator.name}
              className="w-40 h-40 rounded-xl object-cover border"
            />
          </div>

          {/* Basic Info */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-semibold text-gray-800">
              {creator.name}
            </h1>
            <p className="text-gray-500">{creator.username}</p>
            <p className="text-sm text-gray-600 mt-1">{creator.location}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {creator.category.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-sm rounded-full bg-sky-100 text-sky-700"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex gap-6 mt-4 text-sm text-gray-700">
              <span>Followers: {creator.followers}</span>
              <span>Rating: {creator.rating}</span>
              <span>Starting at: {creator.price}</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="border-t px-6 py-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            About Creator
          </h2>
          <p className="text-gray-600 leading-relaxed">{creator.bio}</p>
        </div>

        {/* Social Links */}
        <div className="border-t px-6 py-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Social Profiles
          </h2>
          <div className="flex flex-wrap gap-4">
            {creator.socials.instagram && (
              <a
                href={creator.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
              >
                Instagram
              </a>
            )}
            {creator.socials.tiktok && (
              <a
                href={creator.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
              >
                TikTok
              </a>
            )}
            {creator.socials.youtube && (
              <a
                href={creator.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
              >
                YouTube
              </a>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t px-6 py-6 flex justify-end">
          <button className="px-6 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">
            Contact Creator
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
