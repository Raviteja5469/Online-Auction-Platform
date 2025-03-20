import React, { useState, useEffect } from "react";
import axios from "axios";

const LiveAuctions = () => {
  const [auctions, setAuctions] = useState([]);

  const auctis = [
    {
      id: 1,
      title: "Vintage Rolex Submariner",
      category: "Watches",
      currentBid: 15000,
      timeLeft: "2d 5h",
      imageUrl:
        "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600", // Replace with actual image URL
      bids: 23,
      watchers: 156,
      condition: "Excellent",
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
      condition: "Good",
    },
    // Add more auction items as needed
  ];

  const auction = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/fetchliveauctions"
      );
      setAuctions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
    }
  };

  useEffect(() => {
    auction();
  }, []);

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

        {/* View More Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => (window.location.href = "/on-going-Auctions")}
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
};

export default LiveAuctions;
