import { Route, Routes, BrowserRouter } from "react-router-dom";
import React, { useState } from 'react'
import Landingpage from "./pages/Landingpage";
import PostingAuction from "./pages/PostingAuction";
// import Authentication from "./pages/Authentication";
import Navbar from './components/Navbar';
import LoginPopUp from './components/LoginPopUp';
import './index.css'  // or whatever your CSS file is named

// import SignUp from "./components/Signup";


const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
    {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
    <Navbar setShowLogin={setShowLogin} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/post-auction" element={<PostingAuction />} />
        {/* <Route path="/Authentication" element={<Authentication />} /> */}
        {/* <Route path="/signin" element={<Authentication />} />
        <Route path="/signup" element={<SignUp />} /> */}
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App

