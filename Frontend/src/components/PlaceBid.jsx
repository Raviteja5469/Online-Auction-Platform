import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceBid = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [autoMaxBid, setAutoMaxBid] = useState('');
  const [enableAutoBid, setEnableAutoBid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [auctionItem, setAuctionItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        console.log('Fetching auction details for ID:', auctionId);
        const response = await axios.get(`http://localhost:5000/api/auctions/${auctionId}`);
        console.log('Auction details response:', response.data);
        setAuctionItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auction details:', error.response || error);
        setError(error.response?.data?.message || 'Failed to load auction details. Please try again later.');
        setLoading(false);
      }
    };

    if (auctionId) {
      fetchAuctionDetails();
    } else {
      setError('No auction ID provided');
      setLoading(false);
    }
  }, [auctionId]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError(null);
    setBidSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/auctions/${auctionId}/bid`,
        {
          amount: Number(bidAmount),
          isAutoBid: enableAutoBid,
          maxAutoBidAmount: enableAutoBid ? Number(autoMaxBid) : undefined
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBidSuccess(true);
      // Update auction details with new bid
      setAuctionItem(prev => ({
        ...prev,
        currentBid: response.data.auction.currentBid,
        timeLeft: response.data.auction.timeLeft
      }));
      setBidAmount('');
      setAutoMaxBid('');
    } catch (error) {
      setBidError(error.response?.data?.message || 'Failed to place bid. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/auctions')}
            className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Auctions
          </button>
        </div>
      </div>
    );
  }

  if (!auctionItem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" style={{ backgroundColor: 'rgb(233 233 233' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><a href="/" className="hover:text-gray-700">Home</a></li>
            <li>/</li>
            <li><a href="/auctions" className="hover:text-gray-700">Auctions</a></li>
            <li>/</li>
            <li className="text-gray-900">Place Bid</li>
          </ol>
        </nav>

        {bidSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Bid placed successfully!
          </div>
        )}

        {bidError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {bidError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Item Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Item Details</h2>
            
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <img
                src={auctionItem.images[0]}
                alt={auctionItem.itemName}
                className="rounded-lg object-cover w-full h-64"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{auctionItem.itemName}</h3>
                <p className="text-gray-500">Category: {auctionItem.category}</p>
              </div>

              <div className="flex justify-between border-t border-b border-gray-200 py-4">
                <div>
                  <p className="text-gray-500">Current Bid</p>
                  <p className="text-2xl font-bold text-gray-900">${auctionItem.currentBid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Time Left</p>
                  <p className="text-xl font-semibold text-gray-600">{auctionItem.timeLeft}</p>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>{auctionItem.bids?.length || 0} bids</span>
                <span>Seller: {auctionItem.sellerName}</span>
              </div>
            </div>
          </div>

          {/* Bidding Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Place Your Bid</h2>
            
            <form onSubmit={handleBidSubmit} className="space-y-6">
              {/* Bid Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={auctionItem.currentBid + auctionItem.minBidIncrement}
                    step={auctionItem.minBidIncrement}
                    required
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Minimum bid: ${(auctionItem.currentBid + auctionItem.minBidIncrement).toLocaleString()}
                </p>
              </div>

              {/* Auto Bidding */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoBid"
                    checked={enableAutoBid}
                    onChange={(e) => setEnableAutoBid(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoBid" className="ml-2 block text-sm text-gray-700">
                    Enable Auto Bidding
                  </label>
                </div>

                {enableAutoBid && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Auto Bid Amount
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                      <input
                        type="number"
                        value={autoMaxBid}
                        onChange={(e) => setAutoMaxBid(e.target.value)}
                        min={bidAmount}
                        className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors duration-300"
              >
                Place Bid Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceBid;
