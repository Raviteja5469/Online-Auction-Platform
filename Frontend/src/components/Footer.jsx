import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">AuctionX</h3>
          <p className="text-gray-400">
            Your premier online auction platform to bid on rare items and treasures.
            Enjoy secure transactions and real-time bidding with a vibrant community.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-400">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22,12A10,10,0,1,0,10,22V14H7v-3h3V8.5a4,4,0,0,1,4-4h3v3H14a1,1,0,0,0-1,1V11h4l-1,3H13v8A10,10,0,0,0,22,12Z" />
              </svg>
            </a>
            <a href="#" className="hover:text-indigo-400">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.28 4.28 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.71 1.04 4.27 4.27 0 0 0-7.3 3.89A12.1 12.1 0 0 1 3 4.6a4.27 4.27 0 0 0 1.32 5.7A4.23 4.23 0 0 1 2.8 9.7v.05a4.27 4.27 0 0 0 3.42 4.18 4.27 4.27 0 0 1-1.92.07 4.27 4.27 0 0 0 4 3 8.57 8.57 0 0 1-5.3 1.83A8.78 8.78 0 0 1 2 19.54a12.07 12.07 0 0 0 6.54 1.92c7.86 0 12.16-6.52 12.16-12.16l-.01-.55A8.7 8.7 0 0 0 24 4.56a8.45 8.45 0 0 1-2.54.7z" />
              </svg>
            </a>
            <a href="#" className="hover:text-indigo-400">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-400">Home</a></li>
            <li><a href="#" className="hover:text-indigo-400">Auctions</a></li>
            <li><a href="#" className="hover:text-indigo-400">Dashboard</a></li>
            <li><a href="#" className="hover:text-indigo-400">Post Auction</a></li>
            <li><a href="#" className="hover:text-indigo-400">Contact Us</a></li>
            <li><a href="#" className="hover:text-indigo-400">Help & Support</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Subscribe to our Auction App</h4>
          <p className="text-gray-400">
            Stay updated on the latest auctions, deals, and news.
          </p>
          <form className="flex flex-col sm:flex-row">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 flex-1 mb-2 sm:mb-0 sm:mr-2" 
            />
            <button 
              type="submit" 
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <div>&copy; 2025 AuctionX. All rights reserved.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
