import React, { useState, useEffect } from "react";
import { FiClock, FiTag, FiEye, FiSearch } from "react-icons/fi";

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("/api/auctions"); // Replace with actual API endpoint
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-24">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-white uppercase tracking-wide">
            Live Auctions
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-white">
            Browse & Place Your Bids
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full sm:w-2/3 md:w-1/2">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading auctions...</p>
        ) : filteredAuctions.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No auctions found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredAuctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={auction.imageUrl}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-700 text-white px-4 py-1 rounded-bl-lg flex items-center">
                    <FiClock className="mr-1" /> {auction.timeLeft}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900">{auction.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-2">
                    <FiTag className="mr-1" /> {auction.category}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-4">${auction.currentBid.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Condition: {auction.condition}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-5">
                    <span className="flex items-center">
                      <FiEye className="mr-1" /> {auction.watchers} watching
                    </span>
                    <span>{auction.bids} bids</span>
                  </div>
                  <button className="mt-6 w-full bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-800 transition-colors duration-300">
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AuctionsPage;
