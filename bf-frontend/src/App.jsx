import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Login modal system (used by Navbar Login + Sign Up buttons)
import { LoginModalProvider } from "./context/LoginModalContext";
import LoginChooserModal from "./components/LoginChooserModal";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Influencers from "./components/Influencers";
import BrandStories from "./components/BrandStories";
import Footer from "./components/Footer";

// Pages
import CreatorSignUp from "./pages/creator-sign-up";
import CreatorWelcome from "./pages/creator-profile-page";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorLogin from "./pages/creator-login";

import BrandSignup from "./pages/brand-sign-up";
import BrandProfile from "./pages/brand-profile-page";
import BrandDashboard from "./pages/BrandDashboard";
import BrandLogin from "./pages/brand-login";

import Explore from "./pages/Explore";
import CreatorProfile from "./pages/CreatorProfile";

// Brand Dashboard nested pages
import DashboardHome from "./pages/BrandMaterial/components/DashboardHome";
import Campaigns from "./pages/BrandMaterial/components/Campaigns";
import Messages from "./pages/BrandMaterial/components/Messages";
import Meetings from "./pages/BrandMaterial/components/Meetings";
import Payments from "./pages/BrandMaterial/components/Payments";

// Creator Dashboard nested pages

import CreatorDashboardHome from "./pages/CreatorMaterial/components/CreatorDashboardHome";
import CreatorOpportunities from "./pages/CreatorMaterial/components/CreatorOpportunities";
import CreatorMessages from "./pages/CreatorMaterial/components/CreatorMessages";
import CreatorMeetings from "./pages/CreatorMaterial/components/CreatorMeetings";
import CreatorEarnings from "./pages/CreatorMaterial/components/CreatorEarnings";


const App = () => {
  return (
    <LoginModalProvider>
      <Router>
        {/* Global modal so Navbar Login/SignUp works everywhere */}
        <LoginChooserModal />

        <div className="font-sans text-gray-800">
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Hero />
                  <About />
                  <Features />
                  <HowItWorks />
                  <Influencers />
                  <BrandStories />
                  <Footer />
                </>
              }
            />

            {/* Explore Page */}
            <Route
              path="/explore"
              element={
                <>
                  <Navbar />
                  <Explore />
                  <Footer />
                </>
              }
            />

            {/* Public Creator Profile (dynamic) */}
            <Route
              path="/creator/:id"
              element={
                <>
                  <Navbar />
                  <CreatorProfile />
                  <Footer />
                </>
              }
            />

            {/* Creator Login */}
            <Route
              path="/creator-login"
              element={
                <>
                  <Navbar />
                  <CreatorLogin />
                  <Footer />
                </>
              }
            />

            {/* Brand Login */}
            <Route
              path="/brand-login"
              element={
                <>
                  <Navbar />
                  <BrandLogin />
                  <Footer />
                </>
              }
            />

            {/* Creator Signup */}
            <Route
              path="/creator-sign-up"
              element={
                <>
                  <Navbar />
                  <CreatorSignUp />
                </>
              }
            />

            {/* Editable Creator Profile */}
            <Route
              path="/creator-profile"
              element={
                <>
                  <Navbar />
                  <CreatorWelcome />
                  <Footer />
                </>
              }
            />

            {/* Creator Dashboard (nested routes) */}
            <Route path="/creator-dashboard" element={<CreatorDashboard />}>
              <Route index element={<CreatorDashboardHome />} />
              {/* If you added "CreatorCampaigns.jsx", enable this route: */}
              {/* <Route path="campaigns" element={<CreatorCampaigns />} /> */}
              <Route path="opportunities" element={<CreatorOpportunities />} />
              <Route path="messages" element={<CreatorMessages />} />
              <Route path="meetings" element={<CreatorMeetings />} />
              <Route path="earnings" element={<CreatorEarnings />} />
            </Route>

            {/* Optional legacy alias */}
            <Route
              path="/creator-welcome-page"
              element={
                <>
                  <Navbar />
                  <CreatorWelcome />
                  <Footer />
                </>
              }
            />

            {/* Brand Signup */}
            <Route
              path="/brand-sign-up"
              element={
                <>
                  <Navbar />
                  <BrandSignup />
                </>
              }
            />

            {/* Brand Profile */}
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

            {/* Brand Dashboard (nested routes) */}
            <Route path="/brand-dashboard" element={<BrandDashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="messages" element={<Messages />} />
              <Route path="meetings" element={<Meetings />} />
              <Route path="payments" element={<Payments />} />
            </Route>

            {/* Optional legacy alias */}
            <Route path="/brand-profile-page" element={<BrandDashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="messages" element={<Messages />} />
              <Route path="meetings" element={<Meetings />} />
              <Route path="payments" element={<Payments />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </LoginModalProvider>
  );
};

export default App;
