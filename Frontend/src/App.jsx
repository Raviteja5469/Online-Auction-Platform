import { Route, Routes, BrowserRouter } from "react-router-dom";
import './App.css';
import React, { useState } from 'react'
import Landingpage from "./pages/Landingpage";
import PostingAuction from "./pages/PostingAuction";
// import Authentication from "./pages/Authentication";
import Navbar from './components/Navbar';
import LoginPopUp from './components/LoginPopUp';
import './index.css'  // or whatever your CSS file is named
// import LiveAuctions from "../pages/LiveAuctions";
import LiveAuctions2page from "./pages/LiveAuctions2page";
import MainAuctionpage from "./pages/MainAuctionpage";
import PlaceBidPage from "./pages/PlaceBidPage";
import DashboardPage from "./pages/DashboardPage";




const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
    <Navbar />
    {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
    <Navbar setShowLogin={setShowLogin} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/post-auction" element={<PostingAuction />} />
        {/* <Route path="/live-auctions" element={<LiveAuctions />} /> */}
        <Route path="/LiveAuctionspage2" element={<LiveAuctions2page />} />
        <Route path="/On-going-Auctions" element={<MainAuctionpage />} />
        <Route path="/PlaceBiding" element={<PlaceBidPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App

