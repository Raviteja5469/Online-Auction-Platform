import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturesSection from '../components/FeaturesSection'
import LiveAuctions from '../components/LiveAuctions'
import Footer from '../components/Footer'
import Faqs from '../components/Faqs'


const Landingpage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <LiveAuctions />
      <Faqs />
      <Footer />
    </div>
  )
}

export default Landingpage

