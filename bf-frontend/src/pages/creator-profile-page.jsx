// import React, { useEffect, useState, useRef } from "react";
// import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";

// // --- Configuration ---
// const LOCAL_STORAGE_KEY = "creator_user_data";

// // --- Main App Component ---
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<CreatorSignUp />} />
//         {/* Route parameter :id added to simulate specific profile fetching */}
//         <Route path="/creator-profile/:id?" element={<CreatorProfile />} />
//         <Route path="/chat" element={<ChatPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// // ============================================================================
// // 1. CREATOR PROFILE PAGE
// // ============================================================================
// function CreatorProfile() {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Start support for specific IDs
  
//   // State for data, loading, and error handling
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Logic: Fetch creator profile data
//   useEffect(() => {
//     const fetchProfileData = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         // Simulate API network delay (800ms)
//         await new Promise(resolve => setTimeout(resolve, 800));

//         // --- SIMULATED FETCH LOGIC ---
//         // In a real application, you would use:
//         // const response = await fetch(`/api/creators/${id || 'current'}`);
//         // const data = await response.json();

//         // For this demo, we try to get data passed from the SignUp page first
//         const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        
//         if (storedData) {
//           const parsedData = JSON.parse(storedData);
//           // Enrich with mock stats required for the profile view
//           setProfile({
//             ...parsedData,
//             followers: "125K",
//             following: "450",
//             posts: "1.2K"
//           });
//         } else {
//           // Fallback/Demo Data (if user visits directly)
//           setProfile({
//             fullName: "Sarah Jenkins",
//             bio: "Travel & Lifestyle Creator ✈️",
//             aboutMe: "I travel the world and capture moments that inspire. Exploring hidden gems and sharing my journey one photo at a time.",
//             profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//             categories: ["Travel", "Lifestyle", "Photography"],
//             followers: "230K",
//             socials: {
//               instagram: { handle: "sarah_travels" },
//               youtube: { handle: "sarahvlogs" },
//               tiktok: { handle: "" },
//               facebook: { handle: "" }
//             }
//           });
//         }
//       } catch (err) {
//         setError("Failed to load profile data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, [id]);

//   // --- Loading State ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           <p className="text-gray-500 font-medium">Loading Creator Profile...</p>
//         </div>
//       </div>
//     );
//   }

//   // --- Error State ---
//   if (error || !profile) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
//         <div className="text-red-500 font-medium text-lg mb-2">Error Loading Profile</div>
//         <p className="text-gray-500 mb-4">{error || "Creator not found."}</p>
//         <button 
//           onClick={() => navigate('/')}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Go Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans pb-12">
      
//       {/* --- HEADER: Gradient Cover --- */}
//       <div className="relative h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
//         <button 
//           onClick={() => navigate('/')}
//           className="absolute top-6 left-6 bg-black/20 hover:bg-black/30 text-white px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 transition-all text-sm font-medium z-10"
//         >
//           <FaArrowLeft /> Edit Profile
//         </button>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
//         {/* --- PROFILE INFO SECTION --- */}
//         <div className="relative -mt-24 mb-12">
//           <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fadeIn">
//             <div className="flex flex-col md:flex-row gap-6 items-start">
              
//               {/* Avatar (Circle) with Verified Badge */}
//               <div className="relative flex-shrink-0 mx-auto md:mx-0 group">
//                 <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
//                   {profile.profileImage ? (
//                     <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
//                   )}
//                 </div>
//                 {/* Verified Badge Icon (FaCheckCircle) */}
//                 <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm transform group-hover:scale-110 transition-transform" title="Verified Creator">
//                   <FaCheckCircle size={20} />
//                 </div>
//               </div>

//               {/* Text Info */}
//               <div className="flex-1 text-center md:text-left pt-2 md:pt-10">
//                 <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
//                   <h1 className="text-3xl font-bold text-slate-900">{profile.fullName}</h1>
//                   {/* Category Chips */}
//                   <div className="flex flex-wrap gap-2 justify-center">
//                     {profile.categories.map((cat, i) => (
//                       <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
//                         {cat}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <p className="text-lg text-slate-600 font-medium mb-4 max-w-2xl">{profile.bio}</p>

//                 {/* Follower Counts (FiUsers) */}
//                 <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
//                   <div className="flex items-center gap-2 text-slate-700 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
//                     <FiUsers className="text-blue-500" size={18} />
//                     <span>{profile.followers} Followers</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Invite Button -> Opens Chat */}
//               <div className="w-full md:w-auto mt-4 md:mt-10">
//                 <button 
//                   onClick={() => navigate('/chat')}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
//                 >
//                   <FaEnvelope /> Invite to Campaign
//                 </button>
//               </div>
//             </div>

//             {/* Social Links Section */}
//             <div className="mt-8 pt-6 border-t border-gray-100">
//               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Connect on Socials</h3>
//               <div className="flex flex-wrap gap-4 justify-center md:justify-start">
//                 {Object.entries(profile.socials).map(([platform, data]) => {
//                   if (!data.handle) return null;
                  
//                   // Logic for platform specific styling
//                   let icon, style;
//                   if (platform === "instagram") { 
//                     icon = <FaInstagram />; 
//                     style = "text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-100"; 
//                   } else if (platform === "youtube") { 
//                     icon = <FaYoutube />; 
//                     style = "text-red-600 bg-red-50 hover:bg-red-100 border-red-100"; 
//                   } else if (platform === "tiktok") { 
//                     icon = <FaTiktok />; 
//                     style = "text-black bg-gray-100 hover:bg-gray-200 border-gray-200"; 
//                   } else if (platform === "facebook") { 
//                     icon = <FaFacebook />; 
//                     style = "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100"; 
//                   }

//                   return (
//                     <a 
//                       key={platform} 
//                       href="#" 
//                       className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all hover:shadow-sm ${style}`}
//                     >
//                       <span className="text-xl">{icon}</span>
//                       <div className="text-left">
//                         <div className="text-[10px] font-bold uppercase opacity-60 leading-tight">{platform}</div>
//                         <div className="text-sm font-bold">@{data.handle}</div>
//                       </div>
//                     </a>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- PORTFOLIO GALLERY (Grid 3x3) --- */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
//             <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
//             Portfolio Gallery
//           </h2>
          
//           {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop (3x3 items) */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
//               <div 
//                 key={item} 
//                 className="group relative aspect-square bg-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
//               >
//                 <img 
//                   src={`https://picsum.photos/600/600?random=${item + 10}`} 
//                   alt="Portfolio Item" 
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                 />
                
//                 {/* Hover Zoom & Overlay Effect */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
//                   <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                     Content Piece {item}
//                   </span>
//                   <span className="text-gray-300 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
//                     View Details
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


// // ============================================================================
// // 2. CREATOR SIGN UP FORM
// // ============================================================================
// function CreatorSignUp() {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   const [step, setStep] = useState(0);
//   const [errors, setErrors] = useState({});
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     bio: "",
//     aboutMe: "",
//     profileImage: "",
//     socials: {
//       instagram: { handle: "" },
//       youtube: { handle: "" },
//       tiktok: { handle: "" },
//       facebook: { handle: "" },
//     },
//     categories: [],
//   });

//   const validateStep = (s) => {
//     const e = {};
//     if (s === 0) {
//       if (!form.fullName) e.fullName = "Required";
//       if (!form.email) e.email = "Required";
//       if (!form.password) e.password = "Required";
//     }
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => setForm({ ...form, profileImage: ev.target.result });
//       reader.readAsDataURL(file);
//     }
//   };

//   const submit = (e) => {
//     e.preventDefault();
//     if (validateStep(step)) {
//       // Store data to be picked up by the Profile page
//       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
//       navigate("/creator-profile");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
//       <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
//         <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Join as Creator</h2>
        
//         {step === 0 && (
//            <div className="space-y-4 animate-fadeIn">
//              <input placeholder="Full Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
//              <input placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
//              <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
//            </div>
//         )}
        
//         {step === 1 && (
//            <div className="space-y-4 animate-fadeIn">
//              <div className="text-center">
//                <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center">
//                  {form.profileImage ? <img src={form.profileImage} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs">No Photo</span>}
//                </div>
//                <button type="button" onClick={() => fileInputRef.current.click()} className="text-blue-600 font-medium text-sm hover:underline">Upload Profile Photo</button>
//                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImage} />
//              </div>
//              <textarea placeholder="Short Bio" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
//            </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-4 animate-fadeIn">
//             <h3 className="font-semibold text-gray-700">Select Categories</h3>
//             <div className="flex flex-wrap gap-2">
//               {["Travel", "Tech", "Food", "Lifestyle", "Fashion", "Gaming"].map(cat => (
//                 <button 
//                   key={cat} type="button"
//                   onClick={() => setForm(prev => {
//                     const exists = prev.categories.includes(cat);
//                     return {...prev, categories: exists ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat]};
//                   })}
//                   className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${form.categories.includes(cat) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
            
//             <h3 className="font-semibold text-gray-700 mt-4">Social Handles</h3>
//             <input placeholder="@instagram" className="w-full p-2 border rounded text-sm" onChange={e => setForm({...form, socials: {...form.socials, instagram: {handle: e.target.value}}})} />
//             <input placeholder="@youtube" className="w-full p-2 border rounded text-sm" onChange={e => setForm({...form, socials: {...form.socials, youtube: {handle: e.target.value}}})} />
//           </div>
//         )}

//         <div className="mt-8 flex justify-between pt-4 border-t border-gray-100">
//           <button type="button" onClick={() => setStep(Math.max(0, step - 1))} className={`px-4 py-2 text-gray-500 hover:text-gray-800 ${step === 0 ? 'invisible' : ''}`}>Back</button>
//           {step < 2 ? (
//             <button type="button" onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Next Step</button>
//           ) : (
//             <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Create Profile</button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// // ============================================================================
// // 3. CHAT PAGE
// // ============================================================================
// function ChatPage() {
//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
//       <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
//         <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//           <FaEnvelope size={24} />
//         </div>
//         <h2 className="text-xl font-bold mb-2 text-slate-800">Chat Room</h2>
//         <p className="text-gray-500 mb-6 text-sm">Start collaborating with the creator directly.</p>
//         <button onClick={() => navigate(-1)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">Go Back</button>
//       </div>
//     </div>
//   );
// }

// // ============================================================================
// // 4. ICON DEFINITIONS (Local SVGs to avoid dependency errors)
// // ============================================================================
// const FaCheckCircle = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em" {...p}><path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628 0z"/></svg>;
// const FaArrowLeft = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" height="1em" width="1em" {...p}><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/></svg>;
// const FaEnvelope = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em" {...p}><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg>;
// const FiUsers = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
// const FaInstagram = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" height="1em" width="1em" {...p}><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>;
// const FaFacebook = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em" {...p}><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>;
// const FaYoutube = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" height="1em" width="1em" {...p}><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>;
// const FaTiktok = (p) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" height="1em" width="1em" {...p}><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>;


import { useParams } from "react-router-dom";
import creators from "../data/creatorSampleData";

const CreatorProfile = () => {
  const { id } = useParams();
  const creator = creators.find((c) => c.id === id);

  if (!creator) {
    return <p className="p-10">Creator not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={creator.image}
            alt={creator.name}
            className="w-full md:w-72 h-72 object-cover rounded-xl"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{creator.name}</h1>
            <p className="text-gray-500">{creator.category}</p>

            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Location:</strong> {creator.location}</p>
              <p><strong>Followers:</strong> {creator.followers}</p>
              <p><strong>Rating:</strong> ⭐ {creator.rating}</p>
              <p><strong>Starting Price:</strong> ${creator.price}</p>
            </div>

            <button className="mt-6 px-6 py-2 bg-black text-white rounded-lg">
              Contact Creator
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-2">About</h2>
          <p className="text-gray-700">{creator.about}</p>
        </div>

      </div>
    </div>
  );
};

export default CreatorProfile;
