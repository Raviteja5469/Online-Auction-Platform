import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuctionsPage from '../components/AuctionsPage'
// import LiveAuctions from '../components/LiveAuctions'

const MainAuctionpage = () => {
  return (
    <div>
      <Navbar />
      <AuctionsPage />
      {/* <LiveAuctions /> */}
      <Footer />
    </div>
  )
}

export default MainAuctionpage
