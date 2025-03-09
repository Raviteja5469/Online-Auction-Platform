import { Route, Routes, BrowserRouter } from "react-router-dom";
import React from 'react'
import Landingpage from "./pages/Landingpage";
import PostingAuction from "./pages/PostingAuction";
import Authentication from "./pages/Authentication";
import SignUp from "./components/Signup";


const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/PostAuction" element={<PostingAuction />} />
        <Route path="/Authentication" element={<Authentication />} />
        <Route path="/signin" element={<Authentication />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App

