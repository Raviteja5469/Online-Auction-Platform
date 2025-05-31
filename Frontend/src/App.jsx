import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import './App.css';
import React, { useState } from 'react'
import Landingpage from "./pages/Landingpage";
import PostingAuction from "./pages/PostingAuction";
import Navbar from './components/Navbar';
import LoginPopUp from './components/LoginPopUp';
import './index.css'
import LiveAuctions2page from "./pages/LiveAuctions2page";
import MainAuctionpage from "./pages/MainAuctionpage";
import PlaceBidPage from "./pages/PlaceBidPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./components/NotFound";

// Layout component to handle navbar display
const Layout = ({ children, setShowLogin }) => {
  const location = useLocation();
  const isNotFoundPage = location.pathname === '/404' || location.pathname === '*';

  return (
    <>
      {!isNotFoundPage && <Navbar setShowLogin={setShowLogin} />}
      {children}
    </>
  );
};

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <BrowserRouter>
      {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
      <Layout setShowLogin={setShowLogin}>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/post-auction" element={<PostingAuction />} />
          <Route path="/LiveAuctionspage2" element={<LiveAuctions2page />} />
          <Route path="/On-going-Auctions" element={<MainAuctionpage />} />
          <Route path="/place-bid/:auctionId" element={<PlaceBidPage />} />
          <Route path="/Dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
