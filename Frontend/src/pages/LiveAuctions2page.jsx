import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import LiveAuctions from '../components/LiveAuctions'



const LiveAuctions2page = () => {
  return (
    <div>
      <Navbar />
      <LiveAuctions />
      {/* Auctions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              {/* Image Container */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={auction.images[0]}
                  alt={auction.itemName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                  Ends: {new Date(auction.endTime).toLocaleDateString()}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Item Name & Category */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {auction.itemName}
                  </h3>
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                    {auction.category}
                  </span>
                </div>

                {/* Price & Raised Amount */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${auction.startingBid}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Raised Amount</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${auction.raisedAmount || 0}
                    </p>
                  </div>
                </div>

                {/* Seller Information */}
                <div className="border-t pt-3 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Seller:</span>{" "}
                    {auction.sellerName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    <span className="font-medium text-gray-900">Email:</span>{" "}
                    {auction.sellerEmail}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => (window.location.href = "/PlaceBiding")}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 font-medium"
                  >
                    Place Bid
                  </button>
                  <button className="flex-none px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      <Footer />
    </div>
  )
}

export default LiveAuctions2page
