import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import BrandSignup from "./pages/brand-sign-up";
import BrandProfile from "./pages/brand-profile-page";
import BrandDashboard from "./pages/BrandDashboard";
import Explore from "./pages/Explore";
import CreatorProfile from "./pages/CreatorProfile";

// Brand Dashboard nested pages (inside pages/BrandMaterial/components)
import DashboardHome from "./pages/BrandMaterial/components/DashBoardHome";
import Campaigns from "./pages/BrandMaterial/components/Campaigns";
import Messages from "./pages/BrandMaterial/components/Messages";
import Meetings from "./pages/BrandMaterial/components/Meetings";
import Payments from "./pages/BrandMaterial/components/Payments";

const App = () => {
  return (
    <Router>
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
  );
};

export default App;