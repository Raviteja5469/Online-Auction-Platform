import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LiveAuctions = ({ openLoginModal }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageIndices, setImageIndices] = useState({});
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : {};
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [timers, setTimers] = useState({});
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auctions");
        const formattedAuctions = response.data
          .filter(auction => {
            const now = new Date();
            const end = new Date(auction.endTime);
            return end > now;
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((auction) => ({
            id: auction._id,
            title: auction.itemName,
            category: auction.category,
            currentBid: auction.raisedAmount || auction.startingBid,
            timeLeft: calculateTimeLeft(auction.endTime),
            imageUrl: auction.images && auction.images.length > 0 ? auction.images[0] : auction.images[0],
            images: auction.images || [],
            bids: auction.bids?.length || 0,
            watchers: watchlist[auction._id] ? 1 : 0, // Initialize based on watchlist
            condition: "Not specified",
            createdAt: auction.createdAt,
          }));

        setAuctions(formattedAuctions);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = {};
        auctions.forEach((auction) => {
          const end = new Date(auction.endTime).getTime();
          const now = Date.now();
          const diff = Math.max(0, end - now);
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          updated[auction.id] = `${mins}m ${secs}s`;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [auctions]);

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

  const handleToggleWatchlist = (auctionId) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    setWatchlist((prev) => {
      const updated = { ...prev };
      if (updated[auctionId]) {
        delete updated[auctionId];
      } else {
        updated[auctionId] = true;
      }
      return updated;
    });

    setAuctions((prevAuctions) =>
      prevAuctions.map((auction) =>
        auction.id === auctionId
          ? { ...auction, watchers: watchlist[auctionId] ? auction.watchers - 1 : auction.watchers + 1 }
          : auction
      )
    );
  };

  const handleProtectedAction = (action) => {
    if (!isLoggedIn) {
      openLoginModal();
    } else {
      action();
    }
  };

  const handleViewAllAuctions = () => {
    window.location.href = '/on-going-Auctions';
  };

  const handlePlaceBid = (auctionId) => {
    // const confirmBid = window.confirm("Are you sure you want to place a bid on this item?");
    // if (confirmBid) {
    //   alert(`Placing bid on auction ${auctionId}`);
    // }
    navigate(`/place-bid/${auctionId}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/auctions?category=${encodeURIComponent(category)}`);
  };

  // Add trending badge logic
  const isTrending = (auction) => auction.bids > 10 || auction.currentBid > 1000;

  return (
    <section className="bg-white py-16" style={{ backgroundColor: 'rgb(233 233 233)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-extrabold tracking-tight text-gray-900 font-semibold text-d4a017 uppercase tracking-wide font-inter animate-fade-in">
            Live Auctions
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-playfair animate-fade-in">
            Featured Items Up for Bid
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto font-inter animate-fade-in animation-delay-200">
            Discover unique items and place your bids on these trending auctions
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <p className="text-lg text-gray-600 font-inter">Loading auctions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            <p className="font-inter">{error}</p>
          </div>
        )}

        {/* Auctions Grid */}
        {!loading && !error && auctions.length === 0 && (
          <div className="text-center">
            <p className="text-lg text-gray-600 font-inter">No live auctions available.</p>
          </div>
        )}

        {!loading && !error && auctions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.slice(0, 3).map((auction, index) => (
              <div
                key={auction.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl hover:border-d4a017 hover:scale-105 transition-all duration-300 animate-fade-in-up group relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Trending Badge */}
                {isTrending(auction) && (
                  <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg animate-fade-in" >Trending</span>
                )}
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      auction.images && auction.images.length > 0
                        ? auction.images[imageIndices[auction.id] || 0]
                        : auction.imageUrl
                    }
                    alt={auction.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image failed to load:", auction.imageUrl);
                      console.log("Full auction data:", auction);
                      e.target.onerror = null;
                      e.target.src = auction.images[0];
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-d4a017 text-white px-3 py-1 rounded-bl-lg font-inter">
                    {timers[auction.id] || auction.timeLeft}
                  </div>
                  {/* Carousel Controls (show if more than 1 image) */}
                  {auction.images && auction.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handlePrevImage(auction.id, auction.images.length)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                        aria-label="Previous Image"
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
                        aria-label="Next Image"
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
                      {/* Image indicator dots */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {auction.images.map((_, imgIdx) => (
                          <span
                            key={imgIdx}
                            className={`inline-block w-2 h-2 rounded-full ${imgIdx === (imageIndices[auction.id] || 0) ? 'bg-d4a017' : 'bg-white bg-opacity-70'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 font-inter">
                      {auction.title}
                    </h3>
                    <span
                      className="text-sm font-medium text-d4a017 font-inter cursor-pointer hover:underline"
                      onClick={() => handleCategoryClick(auction.category)}
                    >
                      {auction.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600 font-inter">Current Bid</p>
                      <p className="text-xl font-bold text-gray-900 font-inter">
                        ${auction.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 font-inter">Condition</p>
                      <p className="text-sm font-medium text-gray-900 font-inter">
                        {auction.condition}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4 font-inter">
                    <span>{auction.bids} bids</span>
                    <span>{auction.watchers} watching</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleProtectedAction(() => handlePlaceBid(auction.id))}
                      className="flex-1 bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-500 hover:bg-gray-900 hover:text-white transition-all duration-300 font-inter"
                    >
                      Place Bid
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => handleToggleWatchlist(auction.id)}
                        className="flex-none px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-300"
                      >
                        <svg
                          className={`h-5 w-5 ${watchlist[auction.id] ? 'text-red-500 fill-red-500' : 'text-d4a017'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            fill={watchlist[auction.id] ? 'currentColor' : 'none'}
                          />
                        </svg>
                      </button>
                      <span className="absolute hidden group-hover:block -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
                        {watchlist[auction.id] ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      </span>
                    </div>
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
              onClick={() => handleProtectedAction(handleViewAllAuctions)}
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-white bg-gray-900 hover:bg-d4a017 hover:text-white transition-all duration-300 md:text-lg md:px-10 font-inter"
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

      {/* Animations and Tooltip Styling */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .relative:hover .group-hover\\:block {
          display: block;
        }
      `}</style>
    </section>
  );
};

export default LiveAuctions;