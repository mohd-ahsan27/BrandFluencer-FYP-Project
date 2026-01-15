import React from "react";

// Landing components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";
import About from "../../components/About";
import Features from "../../components/Features";
import HowItWorks from "../../components/HowItWorks";
import Influencers from "../../components/Influencers";
import BrandStories from "../../components/BrandStories";

export default function Home() {
  return (
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
  );
}