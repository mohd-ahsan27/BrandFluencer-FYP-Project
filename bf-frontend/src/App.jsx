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

          {/* Editable Creator Profile (post-signup destination) */}
          <Route
            path="/creator-profile"
            element={
              <>
                <Navbar />
                <CreatorWelcome />
              </>
            }
          />

          {/* Optional legacy alias (if anything still links here) */}
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

          {/* Brand Profile (post-signup destination) */}
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

          {/* Optional alias (if you ever used this old path)
          <Route
            path="/brand-profile-page"
            element={
              <>
                <Navbar />
                <BrandProfile />
                <Footer />
              </>
            }
          /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
