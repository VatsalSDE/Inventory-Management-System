import React from "react";
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

const Dashboard = () => {
  // Mock data for demonstration
  const salesData = [
    { name: "Mon", sales: 400, target: 350 },
    { name: "Tue", sales: 300, target: 320 },
    { name: "Wed", sales: 200, target: 280 },
    { name: "Thu", sales: 278, target: 300 },
    { name: "Fri", sales: 189, target: 250 },
    { name: "Sat", sales: 239, target: 220 },
    { name: "Sun", sales: 349, target: 380 },
  ];

  const stockData = [
    { name: "Low Stock", value: 15, color: "#ef4444" },
    { name: "In Stock", value: 85, color: "#22c55e" },
  ];

  const revenueData = [
    { name: "Jan", revenue: 45000 },
    { name: "Feb", revenue: 52000 },
    { name: "Mar", revenue: 48000 },
    { name: "Apr", revenue: 58000 },
    { name: "May", revenue: 62000 },
    { name: "Jun", revenue: 67000 },
  ];

  const topSellingItems = [
    {
      name: "4 Burner Steel Glass Top",
      quantity: 145,
      value: "₹2,18,500",
      trend: "+12%",
    },
    {
      name: "2 Burner Brass Burner",
      quantity: 132,
      value: "₹1,98,000",
      trend: "+8%",
    },
    {
      name: "3 Burner Alloy Type",
      quantity: 98,
      value: "₹1,47,000",
      trend: "+5%",
    },
    {
      name: "1 Burner Steel Standard",
      quantity: 87,
      value: "₹87,000",
      trend: "+3%",
    },
    {
      name: "2 Burner Glass Top Premium",
      quantity: 76,
      value: "₹1,14,000",
      trend: "+2%",
    },
  ];

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
                📈 Revenue Up 12%
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                📦 Stock Healthy
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
                <p className="text-gray-500 text-sm">Last 7 days performance</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-orange-600 text-3xl">⏳</span>
                  <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                    +3 today
                  </span>
                </div>
                <p className="text-sm text-orange-700 font-semibold mb-1">
                  Pending Orders
                </p>
                <p className="text-4xl font-bold text-orange-600 mb-2">24</p>
                <p className="text-xs text-orange-500">Awaiting processing</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-600 text-3xl">✅</span>
                  <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">
                    +12 today
                  </span>
                </div>
                <p className="text-sm text-green-700 font-semibold mb-1">
                  Completed Orders
                </p>
                <p className="text-4xl font-bold text-green-600 mb-2">156</p>
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
                    Quantity in Hand
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Units
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-1">1,247</p>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
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
                  ₹18,70,500
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
                <p className="text-2xl font-bold text-red-600">8</p>
                <p className="text-xs text-red-500">Need attention</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-700 font-medium mb-1">
                  Total Items
                </p>
                <p className="text-2xl font-bold text-gray-700">52</p>
                <p className="text-xs text-gray-500">Products listed</p>
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
                <p className="text-gray-500 text-sm">Daily sales vs targets</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                This Week
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-xs text-blue-700 font-medium">
                Total Quantity
              </p>
              <p className="text-2xl font-bold text-blue-600">847</p>
              <p className="text-xs text-blue-500">+5.2% vs last week</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-xs text-green-700 font-medium">Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹12.7L</p>
              <p className="text-xs text-green-500">+8.1% vs last week</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p className="text-xs text-purple-700 font-medium">Avg Order</p>
              <p className="text-2xl font-bold text-purple-600">₹15K</p>
              <p className="text-xs text-purple-500">+2.3% vs last week</p>
            </div>
          </div>

          {/* Enhanced Sales Chart */}
          <div className="h-64 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-4">
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
                Best performers this month
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {topSellingItems.map((item, index) => (
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
            ))}
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
            <p className="text-3xl font-bold text-green-600">₹67,000</p>
            <p className="text-sm text-green-500">+15% from last month</p>
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
