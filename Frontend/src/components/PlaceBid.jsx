import React, { useState } from 'react';

const PlaceBid = () => {
  const [bidAmount, setBidAmount] = useState('');
  const [autoMaxBid, setAutoMaxBid] = useState('');
  const [enableAutoBid, setEnableAutoBid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Example auction details - in real app, this would come from props or API
  const auctionItem = {
    title: "Vintage Rolex Submariner",
    currentBid: 15000,
    minBidIncrement: 500,
    timeLeft: "2d 5h",
    imageUrl: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600", // Your image base64 string
    condition: "Excellent",
    bids: 23,
    watchers: 156
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    // Implement bid submission logic here
    console.log({
      bidAmount,
      enableAutoBid,
      autoMaxBid,
      paymentMethod
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Item Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Item Details</h2>
            
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <img
                src={auctionItem.imageUrl}
                alt={auctionItem.title}
                className="rounded-lg object-cover w-full h-64"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{auctionItem.title}</h3>
                <p className="text-gray-500">Condition: {auctionItem.condition}</p>
              </div>

              <div className="flex justify-between border-t border-b border-gray-200 py-4">
                <div>
                  <p className="text-gray-500">Current Bid</p>
                  <p className="text-2xl font-bold text-gray-900">${auctionItem.currentBid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Time Left</p>
                  <p className="text-xl font-semibold text-indigo-600">{auctionItem.timeLeft}</p>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>{auctionItem.bids} bids</span>
                <span>{auctionItem.watchers} watching</span>
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
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300"
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
