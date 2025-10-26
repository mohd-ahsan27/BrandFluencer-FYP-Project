// // src/pages/creator-profile.jsx
// import React, { useEffect, useState } from "react";
// import {
//   FaInstagram,
//   FaYoutube,
//   FaFacebook,
//   FaTiktok,
//   FaCheckCircle,
//   FaBars,
//   FaUserEdit,
//   FaImage,
//   FaListUl,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function CreatorProfile() {
//   const navigate = useNavigate();
//   const [creator, setCreator] = useState(null);
//   const [tab, setTab] = useState("overview");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [edit, setEdit] = useState({ bio: "", shortDescription: "" });

//   useEffect(() => {
//     const stored = localStorage.getItem("brandfluencer_creator_user");
//     if (stored) {
//       const data = JSON.parse(stored);
//       setCreator(data);
//       setEdit({ bio: data.bio || "", shortDescription: data.shortDescription || "" });
//     } else navigate("/creator-sign-up");
//   }, [navigate]);

//   if (!creator) return null;

//   const save = () => {
//     const updated = { ...creator, ...edit };
//     localStorage.setItem("brandfluencer_creator_user", JSON.stringify(updated));
//     setCreator(updated);
//     alert("Profile updated!");
//   };

//   const socials = [
//     { key: "instagram", icon: FaInstagram, color: "text-[#ff6a00]" },
//     { key: "youtube", icon: FaYoutube, color: "text-[#e7a833]" },
//     { key: "facebook", icon: FaFacebook, color: "text-[#9a6b83]" },
//     { key: "tiktok", icon: FaTiktok, color: "text-[#c17457]" },
//   ];

//   const SideButton = ({ name, icon: Icon, id }) => (
//     <button
//       onClick={() => {
//         setTab(id);
//         setMenuOpen(false);
//       }}
//       className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left text-sm font-medium transition-all
//         ${
//           tab === id
//             ? "bg-[#ff6a00] text-white shadow-sm"
//             : "text-gray-700 hover:bg-gray-100"
//         }`}
//     >
//       <Icon /> {name}
//     </button>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fff] to-[#fef6f3] flex flex-col md:flex-row font-sans text-gray-800">
//       {/* --- Sidebar --- */}
//       <aside
//         className={`fixed md:static z-20 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
//         ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//       >
//         <div className="flex items-center justify-between md:justify-center p-4 border-b border-gray-100">
//           <h1 className="text-lg font-bold text-[#5b2333]">My Profile</h1>
//           <button
//             onClick={() => setMenuOpen(false)}
//             className="md:hidden text-gray-600 text-2xl"
//           >
//             ✕
//           </button>
//         </div>
//         <div className="p-4 space-y-2">
//           <SideButton name="Overview" icon={FaListUl} id="overview" />
//           <SideButton name="Socials" icon={FaTiktok} id="socials" />
//           <SideButton name="Portfolio" icon={FaImage} id="portfolio" />
//           <SideButton name="Edit Profile" icon={FaUserEdit} id="edit" />
//         </div>
//       </aside>

//       {/* --- Mobile burger --- */}
//       <button
//         onClick={() => setMenuOpen(true)}
//         className="md:hidden fixed top-4 left-4 bg-white/90 p-2 rounded-full shadow text-[#5b2333] z-30"
//       >
//         <FaBars />
//       </button>

//       {/* --- Main panel --- */}
//       <main className="flex-1 p-6 md:p-10 overflow-y-auto">
//         {/* Header Card */}
//         <div className="relative bg-gradient-to-r from-[#5b2333] via-[#9a6b83] to-[#c17457] rounded-2xl shadow-lg text-center py-10 mb-8 text-white">
//           <div className="absolute top-3 right-3">
//             <FaCheckCircle className="text-[#e7a833] text-xl" />
//           </div>
//           <div className="mx-auto w-32 h-32 rounded-full border-[4px] border-white overflow-hidden shadow-lg bg-white/20">
//             {creator.profileImageDataUrl ? (
//               <img
//                 src={creator.profileImageDataUrl}
//                 alt="avatar"
//                 className="object-cover w-full h-full"
//               />
//             ) : (
//               <div className="flex items-center justify-center w-full h-full text-3xl font-bold">
//                 {creator.fullName?.charAt(0) || "?"}
//               </div>
//             )}
//           </div>
//           <h2 className="mt-4 text-2xl font-semibold">{creator.fullName}</h2>
//           <p className="text-sm text-white/90">{creator.shortDescription}</p>
//         </div>

//         {/* === Tabs === */}
//         {tab === "overview" && (
//           <div className="bg-white rounded-xl shadow p-6">
//             <h3 className="text-lg font-semibold mb-2 text-[#5b2333]">
//               About Me
//             </h3>
//             <p className="text-gray-700 mb-5">{creator.bio || "No bio added."}</p>
//             {creator.categories?.length > 0 && (
//               <>
//                 <h4 className="font-semibold mb-2">Categories</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {creator.categories.map((cat) => (
//                     <span
//                       key={cat}
//                       className="px-3 py-1 bg-[#ff6a00]/10 text-[#5b2333] rounded-full text-sm border border-[#ff6a00]/20"
//                     >
//                       {cat}
//                     </span>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {tab === "socials" && (
//           <div className="bg-white rounded-xl shadow p-6">
//             <h3 className="text-lg font-semibold mb-4 text-[#5b2333]">
//               Social Accounts
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {socials.map(({ key, icon: Icon, color }) => {
//                 const acc = creator.socials?.[key];
//                 if (!acc?.handle) return null;
//                 return (
//                   <div
//                     key={key}
//                     className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
//                   >
//                     <Icon className={`text-2xl ${color}`} />
//                     <div>
//                       <div className="font-medium">{acc.handle}</div>
//                       <div className="text-sm text-gray-500">
//                         {acc.followers} followers
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {tab === "portfolio" && (
//           <div className="bg-white rounded-xl shadow p-6">
//             <h3 className="text-lg font-semibold mb-4 text-[#5b2333]">
//               Portfolio
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div key={i} className="overflow-hidden rounded-lg shadow">
//                   <img
//                     src={`https://source.unsplash.com/random/800x80${i}?sig=${i}`}
//                     alt=""
//                     className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {tab === "edit" && (
//           <div className="bg-white rounded-xl shadow p-6 max-w-xl">
//             <h3 className="text-lg font-semibold text-[#5b2333] mb-4">
//               Edit Profile
//             </h3>
//             <label className="block text-sm font-medium mb-1 text-[#5b2333]">
//               Bio
//             </label>
//             <textarea
//               value={edit.bio}
//               onChange={(e) => setEdit((p) => ({ ...p, bio: e.target.value }))}
//               rows={4}
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-[#ff6a00] outline-none"
//             />
//             <label className="block text-sm font-medium mb-1 text-[#5b2333]">
//               Short Description
//             </label>
//             <input
//               value={edit.shortDescription}
//               onChange={(e) =>
//                 setEdit((p) => ({ ...p, shortDescription: e.target.value }))
//               }
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-[#ff6a00] outline-none"
//             />
//             <button
//               onClick={save}
//               className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white font-semibold hover:opacity-90"
//             >
//               Save Changes
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }