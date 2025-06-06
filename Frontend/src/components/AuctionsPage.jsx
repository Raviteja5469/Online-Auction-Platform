import React, { useState, useEffect } from "react";
import { FiClock, FiTag, FiEye, FiSearch } from "react-icons/fi";
import axios from "axios";

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // Function to calculate time left for an auction
  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  // Fetch auctions from the backend
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("https://online-auction-platform-1.onrender.com/api/auctions");
        console.log("Raw auction data:", response.data); // Debug log
        
        const formattedAuctions = response.data
          .filter(auction => {
            // Filter out ended auctions
            const now = new Date();
            const end = new Date(auction.endTime);
            return end > now; // Only include auctions that haven't ended
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
              imageUrl: auction.images && auction.images.length > 0 ? auction.images[0] : 'https://via.placeholder.com/300x200?text=No+Image',
              images: auction.images || [],
              bids: auction.bids?.length || 0,
              watchers: 0,
              condition: "Not specified",
            };
            
            console.log("Formatted auction:", formattedAuction); // Debug log
            return formattedAuction;
          });
        
        console.log("All formatted auctions:", formattedAuctions); // Debug log
        setAuctions(formattedAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setError("Failed to load auctions. Please try again later.");
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
    <section className="bg-gray-100 py-24">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
            Live Auctions
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">
            Browse & Place Your Bids
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 flex justify-center">
          <div className="relative bg-white rounded-md w-full sm:w-2/3 md:w-1/2">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <p className="text-center text-lg text-white">Loading auctions...</p>
        ) : filteredAuctions.length === 0 ? (
          <p className="text-center text-lg text-white">No auctions found.</p>
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
                    onError={(e) => {
                      console.log("Image failed to load:", auction.imageUrl);
                      console.log("Full auction data:", auction); // Debug log
                      e.target.onerror = null;
                      e.target.src = auction.images[0]; // Use the first image from the array which should be the base64 placeholder
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-gray-900 text-white px-4 py-1 rounded-bl-lg flex items-center">
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
                  <button
                    onClick={() => window.location.href = `/place-bid/${auction.id}`}
                    className="mt-6 w-full bg-gray-900 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-500 transition-colors duration-300"
                  >
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
