import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageIndices, setImageIndices] = useState({}); // Track current image index for each auction

  // Function to calculate time left for an auction
  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  // Fetch auctions from the backend
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auctions");
        console.log("Raw auction data:", response.data); // Debug log
        
        const formattedAuctions = response.data
          .filter(auction => {
            // Filter out ended auctions
            const now = new Date();
            const end = new Date(auction.endTime);
            return end > now; // Only include auctions that haven't ended
          })
          .sort((a, b) => {
            // Sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .map((auction) => {
            console.log("Processing auction:", auction); // Debug log
            console.log("Auction images:", auction.images); // Debug log
            
            const formattedAuction = {
              id: auction._id,
              title: auction.itemName,
              category: auction.category,
              currentBid: auction.raisedAmount || auction.startingBid,
              timeLeft: calculateTimeLeft(auction.endTime),
              imageUrl: auction.images && auction.images.length > 0 ? auction.images[0] : auction.images[0],
              images: auction.images || [],
              bids: auction.bids?.length || 0,
              watchers: 0,
              condition: "Not specified",
              createdAt: auction.createdAt // Add creation date for sorting
            };
            
            console.log("Formatted auction:", formattedAuction); // Debug log
            return formattedAuction;
          });
        
        console.log("All formatted auctions:", formattedAuctions); // Debug log
        setAuctions(formattedAuctions);
        // Initialize image indices for each auction
        setImageIndices(formattedAuctions.reduce((acc, auction) => ({
          ...acc,
          [auction.id]: 0,
        }), {}));
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setError("Failed to load auctions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  // Handle image navigation for carousel
  const handlePrevImage = (auctionId, imageCount) => {
    setImageIndices((prev) => ({
      ...prev,
      [auctionId]: (prev[auctionId] - 1 + imageCount) % imageCount,
    }));
  };

  const handleNextImage = (auctionId, imageCount) => {
    setImageIndices((prev) => ({
      ...prev,
      [auctionId]: (prev[auctionId] + 1) % imageCount,
    }));
  };

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

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading auctions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Filter and Sort Options */}
        {!loading && !error && (
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
        )}

        {/* Auctions Grid */}
        {!loading && !error && auctions.length === 0 && (
          <div className="text-center">
            <p className="text-lg text-gray-600">No live auctions available.</p>
          </div>
        )}

        {!loading && !error && auctions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.slice(0, 3).map((auction) => (
              <div
                key={auction.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={auction.imageUrl}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image failed to load:", auction.imageUrl);
                      console.log("Full auction data:", auction); // Debug log
                      e.target.onerror = null;
                      e.target.src = auction.images[0]; // Use the first image from the array which should be the base64 placeholder
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-bl-lg">
                    {auction.timeLeft}
                  </div>
                  {/* Carousel Controls (only for > 3 images) */}
                  {auction.images.length > 3 && (
                    <>
                      <button
                        onClick={() => handlePrevImage(auction.id, auction.images.length)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleNextImage(auction.id, auction.images.length)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                      >
                        <svg
                          className="h-5 w-5"
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
                    </>
                  )}
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
                    <button
                      onClick={() => window.location.href = `/place-bid/${auction.id}`}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    >
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
        )}

        {/* View All Auctions Button */}
        {!loading && !error && (
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
        )}
      </div>
    </section>
  );
};

export default LiveAuctions;