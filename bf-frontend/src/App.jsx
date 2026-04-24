import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { LoginModalProvider } from "./context/LoginModalContext";
import LoginChooserModal from "./components/LoginChooserModal";

import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import CreatorSignup from "./pages/Auth/CreatorSignup";
import CreatorLogin from "./pages/Auth/CreatorLogin";
import BrandSignup from "./pages/Auth/BrandSignup";
import BrandLogin from "./pages/Auth/BrandLogin";

import CreatorProfile from "./pages/Creator/CreatorProfile";
import PublicCreatorProfile from "./pages/Creator/PublicCreatorProfile";
import CreatorDashboardLayout from "./pages/Creator/CreatorDashboardLayout";
import CreatorDashboardHome from "./pages/Creator/CreatorDashboardHome";
import CreatorOpportunities from "./pages/Creator/CreatorOpportunities";
import CreatorMessages from "./pages/Creator/CreatorMessages";
import CreatorMeetings from "./pages/Creator/CreatorMeetings";
import CreatorEarnings from "./pages/Creator/CreatorEarnings";

import BrandProfile from "./pages/Brand/BrandProfile";
import BrandDashboardLayout from "./pages/Brand/BrandDashboardLayout";
import BrandDashboardHome from "./pages/Brand/BrandDashboardHome";
import Campaigns from "./pages/Brand/Campaigns";
import Messages from "./pages/Brand/Messages";
import Meetings from "./pages/Brand/Meetings";
import Payments from "./pages/Brand/Payments";

import PublicBrandProfile from "./pages/Brand/PublicBrandProfile";

import ExploreLayout from "./pages/Explore/ExploreLayout";
import ExploreCreatorsView from "./pages/Explore/views/ExploreCreatorsView";
import ExploreBrandsView from "./pages/Explore/views/ExploreBrandsView";
import ExploreCampaignsView from "./pages/Explore/views/ExploreCampaignsView";

export default function App() {
  return (
    <LoginModalProvider>
      <Router>
        <LoginChooserModal />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/explore" element={<Navigate to="/explore/creators" replace />} />
          <Route path="/explore/*" element={<ExploreLayout />}>
            <Route path="creators" element={<ExploreCreatorsView />} />
            <Route path="brands" element={<ExploreBrandsView />} />
            <Route path="campaigns" element={<ExploreCampaignsView />} />
          </Route>

          <Route
            path="/creator/:id"
            element={
              <>
                <Navbar />
                <PublicCreatorProfile />
                <Footer />
              </>
            }
          />

          <Route
            path="/brand/:id"
            element={
              <>
                <Navbar />
                <PublicBrandProfile />
                <Footer />
              </>
            }
          />

          <Route path="/creator-login" element={<CreatorLogin />} />
          <Route path="/brand-login" element={<BrandLogin />} />
          <Route path="/creator-sign-up" element={<CreatorSignup />} />
          <Route path="/brand-sign-up" element={<BrandSignup />} />

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

          <Route path="/creator-signup" element={<Navigate to="/creator-sign-up" replace />} />
          <Route path="/brand-signup" element={<Navigate to="/brand-sign-up" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LoginModalProvider>
  );
}