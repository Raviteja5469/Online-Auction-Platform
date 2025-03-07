import React from 'react'

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-20">
      <div className="max-w-7xl mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
          Welcome to Auction
        </h1>
        <p className="mt-6 max-w-3xl mx-auto font-bold text-[20px] text-white">
          Discover rare items, manage your auctions via a robust dashboard, and post new auctions seamlessly. Join a community where every bid counts!
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a href="#" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md pulse-animation">
            Get Started
          </a>
          <a href="#" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-md">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero
