import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Signin from '../components/Signin'
import Signup from '../components/Signup'

const authentication = () => {
  return (
    <div>
      <Navbar />    
      <Signin />
      <Footer />    
    </div>
  )
}

export default authentication
