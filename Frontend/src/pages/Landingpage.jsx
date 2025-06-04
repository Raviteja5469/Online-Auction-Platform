import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturesSection from '../components/FeaturesSection'
import LiveAuctions from '../components/LiveAuctions'
import Footer from '../components/Footer'
import Faqs from '../components/Faqs'
import Authentication from '../components/Authmodal' // Import your modal

const Landingpage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <div>
      <Navbar openLoginModal={openLoginModal} />
      <Hero />
      <FeaturesSection />
      <LiveAuctions openLoginModal={openLoginModal} />
      <Faqs />
      <Footer />
      <Authentication open={showLoginModal} onClose={closeLoginModal} />
    </div>
  )
}

export default Landingpage

