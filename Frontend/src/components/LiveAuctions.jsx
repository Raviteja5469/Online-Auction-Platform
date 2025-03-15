import React from 'react'

const LiveAuctions = () => {
  const auctions = [
    {
      id: 1,
      title: "Vintage Rolex Submariner",
      category: "Watches",
      currentBid: 15000,
      timeLeft: "2d 5h",
      imageUrl: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600", // Replace with actual image URL
      bids: 23,
      watchers: 156,
      condition: "Excellent"
    },
    {
      id: 2,
      title: "1967 Ford Mustang GT",
      category: "Classic Cars",
      currentBid: 45000,
      timeLeft: "5d 12h",
      imageUrl: "https://example.com/car.jpg",
      bids: 15,
      watchers: 234,
      condition: "Good"
    },
    // Add more auction items as needed
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">
            Live Auctions
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Featured Items Up for Bid
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Discover unique items and place your bids on these trending auctions
          </p>
        </div>

        {/* Filter and Sort Options */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>All Categories</option>
              <option>Watches</option>
              <option>Classic Cars</option>
              <option>Art</option>
              <option>Collectibles</option>
            </select>
            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Ending Soon</option>
              <option>Most Bids</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="search"
              placeholder="Search auctions..."
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={auction.imageUrl}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-bl-lg">
                  {auction.timeLeft}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {auction.title}
                  </h3>
                  <span className="text-sm font-medium text-indigo-600">
                    {auction.category}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${auction.currentBid.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="text-sm font-medium text-gray-900">
                      {auction.condition}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{auction.bids} bids</span>
                  <span>{auction.watchers} watching</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button   onClick={() => window.location.href = '/PlaceBiding'}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                    Place Bid
                  </button>
                  <button className="flex-none px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300">
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

        {/* View More Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/on-going-Auctions'}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg md:px-10"
          >
            View All Auctions
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default LiveAuctions
