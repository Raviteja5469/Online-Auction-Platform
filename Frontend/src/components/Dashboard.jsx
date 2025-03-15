import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // User Data
  const userData = {
    personalInfo: {
      name: "John Doe",
      email: "john.doe@example.com",
      joined: "Jan 2024",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      verificationStatus: "Verified",
      location: "New York, USA"
    },
    auctionStats: {
      totalBidsPlaced: 67,
      auctionsWon: 12,
      activeAuctions: 5,
      totalSpent: "\$45,320"
    },
    recentActivity: [
      {
        id: 1,
        item: "Vintage Rolex Submariner",
        action: "Placed bid",
        amount: "\$15,500",
        time: "2 hours ago",
        status: "winning"
      },
      {
        id: 2,
        item: "Art Deco Painting",
        action: "Outbid",
        amount: "$12,300",
        time: "5 hours ago",
        status: "outbid"
      }
    ]
  };

  // Your existing data constants
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const categoryData = [
    { name: 'Watches', value: 35 },
    { name: 'Art', value: 25 },
    { name: 'Cars', value: 20 },
    { name: 'Jewelry', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const stats = [
    { title: 'Total Auctions', value: '1,234', change: '+12%', color: 'text-blue-600' },
    { title: 'Active Bidders', value: '856', change: '+8%', color: 'text-green-600' },
    { title: 'Total Revenue', value: '$328,456', change: '+15%', color: 'text-purple-600' },
    { title: 'Success Rate', value: '94%', change: '+3%', color: 'text-yellow-600' },
  ];

  const [timeRange, setTimeRange] = useState('weekly');

  return (
    <div className="min-h-screen bg-gray-50 pt-30       ">
      <div className="max-w-7xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center">
              <img 
                src={userData.personalInfo.avatar} 
                alt="Profile"
                className="h-20 w-20 rounded-full border-4 border-white shadow-md" 
              />
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">{userData.personalInfo.name}</h2>
                <div className="flex items-center mt-1">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    {userData.personalInfo.location}
                  </span>
                  <span className="ml-3 text-white/80 text-sm">
                    Member since {userData.personalInfo.joined}
                  </span>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {userData.personalInfo.verificationStatus}
                </span>
                <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{userData.auctionStats.totalBidsPlaced}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Auctions Won</p>
              <p className="text-2xl font-bold text-gray-900">{userData.auctionStats.auctionsWon}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Active Auctions</p>
              <p className="text-2xl font-bold text-gray-900">{userData.auctionStats.activeAuctions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{userData.auctionStats.totalSpent}</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {userData.recentActivity.map((activity) => (
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

        {/* Your existing dashboard content */}
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
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <div className="flex items-baseline mt-4">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${stat.color}`}>
                  {stat.change}
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" />
                  </svg>
                </p>
              </div>
            </div>
          ))}
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
                {/* Add your auction items here */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Vintage Watch</td>
                  <td className="px-6 py-4 whitespace-nowrap">$15,000</td>
                  <td className="px-6 py-4 whitespace-nowrap">23</td>
                  <td className="px-6 py-4 whitespace-nowrap">2d 5h</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
