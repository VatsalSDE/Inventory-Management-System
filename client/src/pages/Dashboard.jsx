import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { dashboardAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, salesDataRes, topSellingRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getSalesData(),
        dashboardAPI.getTopSellingProducts()
      ]);
      
      setStats(statsData);
      setSalesData(salesDataRes);
      setTopSellingItems(topSellingRes);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Stock data for pie chart
  const stockData = stats ? [
    { name: "Low Stock", value: stats.lowStockProducts, color: "#ef4444" },
    { name: "In Stock", value: stats.totalProducts - stats.lowStockProducts, color: "#22c55e" },
  ] : [];

  // Revenue data for line chart
  const revenueData = stats ? [
    { name: "Jan", revenue: Math.round(stats.totalRevenue * 0.15) },
    { name: "Feb", revenue: Math.round(stats.totalRevenue * 0.18) },
    { name: "Mar", revenue: Math.round(stats.totalRevenue * 0.17) },
    { name: "Apr", revenue: Math.round(stats.totalRevenue * 0.20) },
    { name: "May", revenue: Math.round(stats.totalRevenue * 0.22) },
    { name: "Jun", revenue: Math.round(stats.totalRevenue * 0.25) },
  ] : [];

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
          <p className="text-gray-600">Start by adding some products and orders to see dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">📊</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">●</span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Real-time insights into your gas stove inventory business
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                📈 Revenue: ₹{stats.totalRevenue.toLocaleString()}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                📦 {stats.totalProducts} Products
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Sales Activity Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Sales Activity
                </h3>
                <p className="text-gray-500 text-sm">Order status overview</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-orange-600 text-3xl">⏳</span>
                  <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-orange-700 font-semibold mb-1">
                  Pending Orders
                </p>
                <p className="text-4xl font-bold text-orange-600 mb-2">{stats.pendingOrders}</p>
                <p className="text-xs text-orange-500">Awaiting processing</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-600 text-3xl">✅</span>
                  <span className="text-xs bg-green-200 text-green-600 px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-green-700 font-semibold mb-1">
                  Completed Orders
                </p>
                <p className="text-4xl font-bold text-green-600 mb-2">{stats.completedOrders}</p>
                <p className="text-xs text-green-500">Successfully delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Summary Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">📦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Inventory</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600 font-medium">
                    Total Products
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Items
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-1">{stats.totalProducts}</p>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600 font-medium">
                    Total Value
                  </p>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    INR
                  </span>
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-1">
                  ₹{stats.totalInventoryValue.toLocaleString()}
                </p>
                <div className="w-full bg-purple-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Analytics Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full -ml-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Analytics</h3>
            </div>

            {/* Stock Status */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <p className="text-xs text-red-700 font-medium mb-1">
                  Low Stock
                </p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</p>
                <p className="text-xs text-red-500">Need attention</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="text-xs text-gray-700 font-medium mb-1">
                  Total Orders
                </div>
                <p className="text-2xl font-bold text-gray-700">{stats.totalOrders}</p>
                <p className="text-xs text-gray-500">Orders placed</p>
              </div>
            </div>

            {/* Mini Pie Chart */}
            <div className="h-24 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={35}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">📊</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Sales Performance
                </h3>
                <p className="text-gray-500 text-sm">Payment-based sales data</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                Real-time
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-xs text-blue-700 font-medium">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
              <p className="text-xs text-blue-500">All time</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-xs text-green-700 font-medium">Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-xs text-green-500">Total earned</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p className="text-xs text-purple-700 font-medium">Avg Order</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders / 1000) : 0}K
              </p>
              <p className="text-xs text-purple-500">Per order</p>
            </div>
          </div>

          {/* Enhanced Sales Chart */}
          <div className="h-64 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-4">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#64748b"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#colorSales)"
                    name="Sales"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#colorTarget)"
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p>No sales data available yet</p>
                  <p className="text-sm">Start creating orders and payments to see data</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">🏆</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Top Selling Items
              </h3>
              <p className="text-gray-500 text-sm">
                Best performers
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {topSellingItems.length > 0 ? (
              topSellingItems.map((item, index) => (
                <div
                  key={index}
                  className="group p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`relative w-12 h-12 ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          : index === 1
                            ? "bg-gradient-to-r from-gray-300 to-gray-400"
                            : index === 2
                              ? "bg-gradient-to-r from-orange-400 to-orange-500"
                              : "bg-gradient-to-r from-blue-400 to-blue-500"
                      } rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <span className="text-white font-bold text-lg">
                        {index + 1}
                      </span>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🔥</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-sm">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500 font-medium">
                          Qty: {item.quantity}
                        </p>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          {item.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <p className="font-bold text-lg text-green-600 group-hover:text-green-700">
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🏆</div>
                <p>No sales data yet</p>
                <p className="text-sm">Create orders to see top sellers</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">💹</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Revenue Trend
              </h3>
              <p className="text-gray-500">Monthly revenue performance</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-500">Total revenue</p>
          </div>
        </div>
        <div className="h-48 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={4}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
