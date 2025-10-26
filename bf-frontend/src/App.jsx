import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Influencers from "./components/Influencers";
import BrandStories from "./components/BrandStories";
import Footer from "./components/Footer";
import CreatorSignUp from "./pages/creator-sign-up";
// import CreatorProfile from "./pages/creator-profile";
import CreatorWelcome from "./pages/creator-welcome-page";
import BrandSignup from "./pages/brand-sign-up";

const App = () => {
  return (
    <Router>
      <div className="font-sans text-gray-800">
        {/*  Navbar on all pages */}
        <Navbar />

        {/*  Define all routes */}
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
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

          {/*  Influencer Signup */}
          <Route path="/creator-sign-up" element={<CreatorSignUp />} />

          {/*  Influencer Profile */}
          {/* <Route path="/creator-profile" element={<CreatorProfile />} /> */}

          {/*  Welcome Page after signup */}
          <Route path="/creator-welcome-page" element={<CreatorWelcome />} />

          {/*  Brand Signup */}
          <Route path="/brand-sign-up" element={<BrandSignup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
