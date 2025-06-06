import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { getDashboardData } from '../services/api';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [auctionStats, setAuctionStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [timeRange, setTimeRange] = useState('weekly');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', location: '' });

  useEffect(() => {
    setLoading(true);
    const storedData = localStorage.getItem("dashboardData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setUserProfile(data.userProfile);
      setAuctionStats(data.auctionStats);
      setRecentActivity(data.recentActivity);
      setRevenueData(data.revenueData);
      setCategoryData(data.categoryData);
      setRecentAuctions(data.recentAuctions);
      setLoading(false);
    } else {
      getDashboardData()
        .then(data => {
          setUserProfile(data.userProfile);
          setAuctionStats(data.auctionStats);
          setRecentActivity(data.recentActivity);
          setRevenueData(data.revenueData);
          setCategoryData(data.categoryData);
          setRecentAuctions(data.recentAuctions);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  const handleEditProfile = () => {
    setEditFormData({ 
      name: userProfile.name, 
      email: userProfile.email,
      location: userProfile.location 
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://online-auction-platform-1.onrender.com/api/user/profile",
        editFormData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Update the userProfile state with the new data
      setUserProfile(response.data.user);
      setIsEditModalOpen(false);

      // Refresh dashboard data
      const dashboardResponse = await axios.get("https://online-auction-platform-1.onrender.com/api/user/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      // Update localStorage and all states with fresh data
      localStorage.setItem("dashboardData", JSON.stringify(dashboardResponse.data));
      setUserProfile(dashboardResponse.data.userProfile);
      setAuctionStats(dashboardResponse.data.auctionStats);
      setRecentActivity(dashboardResponse.data.recentActivity);
      setRevenueData(dashboardResponse.data.revenueData);
      setCategoryData(dashboardResponse.data.categoryData);
      setRecentAuctions(dashboardResponse.data.recentAuctions);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!userProfile || !auctionStats) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center">
              <img 
                src={userProfile.avatar} 
                alt="Profile"
                className="h-20 w-20 rounded-full border-4 border-white shadow-md" 
              />
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
                <div className="flex items-center mt-1">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    {userProfile.location}
                  </span>
                  <span className="ml-3 text-white/80 text-sm">
                    Member since {new Date(userProfile.joined).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {userProfile.verificationStatus}
                </span>
                <button 
                  onClick={handleEditProfile}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{auctionStats.totalBidsPlaced}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Auctions Won</p>
              <p className="text-2xl font-bold text-gray-900">{auctionStats.auctionsWon}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Active Auctions</p>
              <p className="text-2xl font-bold text-gray-900">{auctionStats.activeAuctions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{auctionStats.totalSpent}</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'winning' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.item}</p>
                      <p className="text-sm text-gray-500">
                        {activity.action} - {activity.time}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{activity.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Auction Dashboard</h1>
          <div className="flex space-x-4">
            <select 
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Export Report
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
           {/* Revenue Chart */}
           <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
            <LineChart width={500} height={300} data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
            <PieChart width={500} height={300}>
              <Pie
                data={categoryData}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Recent Auctions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Auctions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Bid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bids</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAuctions.map((auction, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">{auction.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{auction.currentBid}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{auction.bids}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{auction.timeLeft}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {auction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  placeholder="Enter your location"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
