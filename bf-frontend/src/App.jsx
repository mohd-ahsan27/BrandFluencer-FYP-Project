import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { LoginModalProvider } from "./context/LoginModalContext";
import LoginChooserModal from "./components/LoginChooserModal";


import Home from "./pages/Home/Home";


import ExplorePage from "./pages/Explore/ExplorePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


import BrandSignup from "./pages/Auth/BrandSignup";
import BrandLogin from "./pages/Auth/BrandLogin";
import CreatorSignup from "./pages/Auth/CreatorSignup";
import CreatorLogin from "./pages/Auth/CreatorLogin";


import CreatorProfile from "./pages/Creator/CreatorProfile";
import BrandProfile from "./pages/Brand/BrandProfile";

import CreatorDashboardLayout from "./pages/Creator/CreatorDashboardLayout";
import CreatorDashboardHome from "./pages/Creator/CreatorDashboardHome";
import CreatorOpportunities from "./pages/Creator/CreatorOpportunities";
import CreatorMessages from "./pages/Creator/CreatorMessages";
import CreatorMeetings from "./pages/Creator/CreatorMeetings";
import CreatorEarnings from "./pages/Creator/CreatorEarnings";

import BrandDashboardLayout from "./pages/Brand/BrandDashboardLayout";


import BrandDashboardHome from "./pages/Brand/BrandDashboardHome";
import Campaigns from "./pages/Brand/Campaigns";
import Messages from "./pages/Brand/Messages";
import Meetings from "./pages/Brand/Meetings";
import Payments from "./pages/Brand/Payments";

export default function App() {
  return (
    <LoginModalProvider>
      <Router>
      
        <LoginChooserModal />

        <div className="font-sans">
          <Routes>
           
            <Route path="/" element={<Home />} />

           
            <Route
              path="/explore"
              element={
                <>
                  <Navbar />
                  <ExplorePage />
                  <Footer />
                </>
              }
            />

          
            <Route
              path="/creator-login"
              element={
                <>
                  <CreatorLogin />
                  <Footer />
                </>
              }
            />
            <Route
              path="/brand-login"
              element={
                <>
                  <BrandLogin />
                  <Footer />
                </>
              }
            />

            
            <Route
              path="/creator-sign-up"
              element={
                <>
                  <Navbar />
                  <CreatorSignup />
                  <Footer />
                </>
              }
            />
            <Route
              path="/brand-sign-up"
              element={
                <>
                  <Navbar />
                  <BrandSignup />
                  <Footer />
                </>
              }
            />

            
            <Route
              path="/creator-profile"
              element={
                <>
                  <Navbar />
                  <CreatorProfile />
                  <Footer />
                </>
              }
            />
            <Route
              path="/brand-profile"
              element={
                <>
                  <Navbar />
                  <BrandProfile />
                  <Footer />
                </>
              }
            />

            {/* OPTIONAL aliases (remove if you are sure you don't use them) */}
            <Route path="/creator-signup" element={<Navigate to="/creator-sign-up" replace />} />
            <Route path="/brand-signup" element={<Navigate to="/brand-sign-up" replace />} />

            
            <Route path="/creator-dashboard" element={<CreatorDashboardLayout />}>
              <Route index element={<CreatorDashboardHome />} />
              <Route path="opportunities" element={<CreatorOpportunities />} />
              <Route path="messages" element={<CreatorMessages />} />
              <Route path="meetings" element={<CreatorMeetings />} />
              <Route path="earnings" element={<CreatorEarnings />} />
            </Route>

        
            <Route path="/brand-dashboard" element={<BrandDashboardLayout />}>
              <Route index element={<BrandDashboardHome />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="messages" element={<Messages />} />
              <Route path="meetings" element={<Meetings />} />
              <Route path="payments" element={<Payments />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LoginModalProvider>
  );
}