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
import BrandDashboard from "./pages/BrandDashboard";
import Explore from "./pages/Explore";
import CreatorProfile from "./pages/CreatorProfile";

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

          {/* Creator Profile (Dynamic) */}
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

          {/* Creator Welcome Page */}
          <Route
            path="/creator-welcome-page"
            element={
              <>
                <Navbar />
                <CreatorWelcome />
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

          {/* Brand Dashboard (No Navbar/Footer intentionally) */}
          <Route path="/brand-dashboard" element={<BrandDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
