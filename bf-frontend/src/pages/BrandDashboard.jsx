// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiHome,
//   FiMessageSquare,
//   FiCalendar,
//   FiMenu,
//   FiX,
//   FiLogOut,
//   FiTrendingUp,
//   FiActivity,
//   FiPlus,
// } from "react-icons/fi";
// import { FaBullhorn, FaMoneyBillWave } from "react-icons/fa";

// export default function BrandDashboard() {
//   const navigate = useNavigate();

//   // --- State Management ---
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [brandName, setBrandName] = useState("Brand");
//   const [stats, setStats] = useState({
//     activeCampaigns: 0,
//     totalSpent: 0,
//     totalReach: 0,
//   });
//   const [campaigns, setCampaigns] = useState([]);

//   // --- Mock API Call (useEffect) ---
//   useEffect(() => {
//     // 1. Retrieve Brand Name from LocalStorage (set during Signup)
//     const storedUser = localStorage.getItem("brandfluencer_brand_user");
//     if (storedUser) {
//       const parsed = JSON.parse(storedUser);
//       setBrandName(parsed.companyName || parsed.fullName);
//     }

//     // 2. Simulate Fetching Dashboard Data
//     const fetchDashboardData = async () => {
//       setLoading(true);
      
//       // Simulate network delay
//       setTimeout(() => {
//         // Mock Data Response
//         const mockData = {
//           stats: {
//             activeCampaigns: 3,
//             totalSpent: "12,450",
//             totalReach: "1.2M",
//           },
//           campaigns: [
//             {
//               id: 1,
//               name: "Summer Collection Launch",
//               influencer: "Sarah Jenkins",
//               platform: "Instagram",
//               status: "Active",
//               budget: "$5,000",
//               date: "2025-10-15",
//             },
//             {
//               id: 2,
//               name: "Tech Review Series",
//               influencer: "TechGuru42",
//               platform: "YouTube",
//               status: "Pending",
//               budget: "$2,500",
//               date: "2025-11-01",
//             },
//             {
//               id: 3,
//               name: "Holiday Giveaway",
//               influencer: "Multiple",
//               platform: "TikTok",
//               status: "Completed",
//               budget: "$4,950",
//               date: "2025-09-20",
//             },
//           ],
//         };

//         setStats(mockData.stats);
//         setCampaigns(mockData.campaigns);
//         setLoading(false);
//       }, 1000);
//     };

//     fetchDashboardData();
//   }, []);

//   // --- UI Helpers ---
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active": return "bg-green-100 text-green-700 border-green-200";
//       case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
//       case "Completed": return "bg-blue-100 text-blue-700 border-blue-200";
//       default: return "bg-gray-100 text-gray-700";
//     }
//   };

//   const navItems = [
//     { name: "Dashboard", icon: <FiHome />, active: true },
//     { name: "Campaigns", icon: <FaBullhorn />, active: false },
//     { name: "Messages", icon: <FiMessageSquare />, active: false },
//     { name: "Meetings", icon: <FiCalendar />, active: false },
//     { name: "Payments", icon: <FaMoneyBillWave />, active: false },
//   ];

//   return (
//     <div className="flex h-screen bg-[#fffaf5]">
//       {/* ================= SIDEBAR ================= */}
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar Content */}
//       <aside
//         className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo Area */}
//           <div className="h-20 flex items-center px-8 border-b border-gray-100">
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff6a00] to-[#e7a833] bg-clip-text text-transparent">
//               BrandFluencer
//             </h1>
//           </div>

//           {/* Nav Links */}
//           <nav className="flex-1 px-4 py-6 space-y-2">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
//                   item.active
//                     ? "bg-gradient-to-r from-[#ff6a00]/10 to-[#e7a833]/10 text-[#ff6a00]"
//                     : "text-gray-500 hover:bg-gray-50 hover:text-[#5b2333]"
//                 }`}
//               >
//                 <span className="text-xl mr-3">{item.icon}</span>
//                 {item.name}
//               </button>
//             ))}
//           </nav>

//           {/* User / Logout */}
//           <div className="p-4 border-t border-gray-100">
//             <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 cursor-pointer group transition-colors">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#e7a833] flex items-center justify-center text-white font-bold">
//                 {brandName.charAt(0).toUpperCase()}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-gray-700 truncate">
//                   {brandName}
//                 </p>
//                 <p className="text-xs text-gray-500">View Profile</p>
//               </div>
//               <FiLogOut className="text-gray-400 group-hover:text-red-500" />
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* Header (Mobile Toggle + Title) */}
//         <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <FiMenu size={24} />
//             </button>
//             <h2 className="text-xl font-bold text-[#5b2333]">Dashboard</h2>
//           </div>
          
//           <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6a00] to-[#e7a833] text-white rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm font-semibold">
//             <FiPlus size={18} />
//             <span className="hidden sm:inline">Create Campaign</span>
//           </button>
//         </header>

//         {/* Scrollable Content Area */}
//         <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
//           {loading ? (
//             <div className="flex h-64 items-center justify-center text-gray-400">
//               Loading dashboard data...
//             </div>
//           ) : (
//             <div className="max-w-6xl mx-auto space-y-8">
              
//               {/* 1. Welcome Banner */}
//               <div className="bg-gradient-to-r from-[#5b2333] to-[#8a344c] rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
//                 <div className="relative z-10">
//                   <h1 className="text-3xl font-bold mb-2">Welcome back, {brandName}! 👋</h1>
//                   <p className="text-white/80 max-w-xl">
//                     You have <span className="font-semibold text-[#ffb366]">{stats.activeCampaigns} active campaigns</span> running. 
//                     Check your messages, you have 4 new proposals from influencers.
//                   </p>
//                 </div>
//                 {/* Decorative Circle */}
//                 <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
//               </div>

//               {/* 2. Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard 
//                   title="Active Campaigns" 
//                   value={stats.activeCampaigns} 
//                   icon={<FaBullhorn className="text-white" />} 
//                   color="from-orange-400 to-pink-500"
//                 />
//                 <StatCard 
//                   title="Total Spent" 
//                   value={`$${stats.totalSpent}`} 
//                   icon={<FaMoneyBillWave className="text-white" />} 
//                   color="from-green-400 to-emerald-500"
//                 />
//                 <StatCard 
//                   title="Total Reach" 
//                   value={stats.totalReach} 
//                   icon={<FiTrendingUp className="text-white" />} 
//                   color="from-blue-400 to-indigo-500"
//                 />
//               </div>

//               {/* 3. Campaigns Table */}
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
//                   <h3 className="text-lg font-bold text-[#5b2333]">Recent Campaigns</h3>
//                   <button className="text-sm text-[#ff6a00] font-medium hover:underline">View All</button>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left text-sm text-gray-600">
//                     <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
//                       <tr>
//                         <th className="px-6 py-4">Campaign Name</th>
//                         <th className="px-6 py-4">Influencer</th>
//                         <th className="px-6 py-4">Budget</th>
//                         <th className="px-6 py-4">Status</th>
//                         <th className="px-6 py-4 text-right">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {campaigns.map((camp) => (
//                         <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4 font-medium text-gray-900">
//                             {camp.name}
//                             <span className="block text-xs text-gray-400 font-normal">{camp.platform}</span>
//                           </td>
//                           <td className="px-6 py-4">{camp.influencer}</td>
//                           <td className="px-6 py-4 text-gray-900">{camp.budget}</td>
//                           <td className="px-6 py-4">
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(camp.status)}`}>
//                               {camp.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             <button className="text-gray-400 hover:text-[#ff6a00] transition-colors">
//                               Edit
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// // Simple Sub-component for Stats
// function StatCard({ title, value, icon, color }) {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
//       <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
//         {icon}
//       </div>
//       <div>
//         <p className="text-sm text-gray-500 font-medium">{title}</p>
//         <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
//       </div>
//     </div>
//   );
// }