import React, { useState } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Eye,
  Settings,
} from "lucide-react";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lowStockLimit, setLowStockLimit] = useState(10);
  const [viewMode, setViewMode] = useState("table"); // table or cards

  // Mock inventory data
  const [inventory, setInventory] = useState([
    {
      id: 1,
      productCode: "PGS-STEEL-4-BRASS",
      name: "Premium Gas Stove Deluxe",
      category: "Steel",
      burners: 4,
      burnerType: "Brass",
      price: 15000,
      quantity: 25,
      totalValue: 375000,
      lastUpdated: "2024-01-15",
      trend: "up",
      weeklyChange: "+5",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100",
      supplier: "Premium Supplies Co.",
    },
    {
      id: 2,
      productCode: "CGS-GLASS-2-ALLOY",
      name: "Compact Glass Top Stove",
      category: "Glass",
      burners: 2,
      burnerType: "Alloy",
      price: 8500,
      quantity: 45,
      totalValue: 382500,
      lastUpdated: "2024-01-14",
      trend: "up",
      weeklyChange: "+12",
      image:
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100",
      supplier: "Glass Tech Ltd.",
    },
    {
      id: 3,
      productCode: "STD-STEEL-3-BRASS",
      name: "Standard 3 Burner Professional",
      category: "Steel",
      burners: 3,
      burnerType: "Brass",
      price: 12000,
      quantity: 8,
      totalValue: 96000,
      lastUpdated: "2024-01-13",
      trend: "down",
      weeklyChange: "-3",
      image: "https://images.unsplash.com/photo-1556909019-f2c9d2d0c1bb?w=100",
      supplier: "Steel Works Inc.",
    },
    {
      id: 4,
      productCode: "LUX-GLASS-1-ALLOY",
      name: "Luxury Single Burner Elite",
      category: "Glass",
      burners: 1,
      burnerType: "Alloy",
      price: 6500,
      quantity: 5,
      totalValue: 32500,
      lastUpdated: "2024-01-12",
      trend: "down",
      weeklyChange: "-2",
      image: "https://images.unsplash.com/photo-1556909019-f2c9d2d0c1bb?w=100",
      supplier: "Luxury Kitchen Co.",
    },
    {
      id: 5,
      productCode: "FAM-STEEL-4-ALLOY",
      name: "Family Size Stove Premium",
      category: "Steel",
      burners: 4,
      burnerType: "Alloy",
      price: 13500,
      quantity: 32,
      totalValue: 432000,
      lastUpdated: "2024-01-11",
      trend: "up",
      weeklyChange: "+8",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100",
      supplier: "Family Kitchen Solutions",
    },
  ]);

  const getStockStatus = (quantity) => {
    return quantity <= lowStockLimit ? "low" : "in-stock";
  };

  const getStatusIcon = (quantity) => {
    if (quantity <= lowStockLimit) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusBadge = (quantity) => {
    if (quantity <= lowStockLimit) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300">
          <AlertTriangle className="w-4 h-4" />
          Critical Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
        <CheckCircle className="w-4 h-4" />
        Healthy Stock
      </span>
    );
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "low" && getStockStatus(item.quantity) === "low") ||
      (statusFilter === "in-stock" &&
        getStockStatus(item.quantity) === "in-stock");

    return matchesSearch && matchesStatus;
  });

  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(
    (item) => getStockStatus(item.quantity) === "low",
  ).length;
  const trendingUp = inventory.filter((item) => item.trend === "up").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <BarChart3 className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Real-time monitoring and analytics for your gas stove inventory
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              Products
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total Items</p>
          <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
          <p className="text-xs text-blue-600 mt-2">Active products</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
              Units
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Total Quantity
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {totalQuantity.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-2">
            +{trendingUp} trending up
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">₹</span>
            </div>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
              Value
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
          <p className="text-3xl font-bold text-gray-900">
            ₹{(totalValue / 100000).toFixed(1)}L
          </p>
          <p className="text-xs text-purple-600 mt-2">Market worth</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
              Alert
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Low Stock Items
          </p>
          <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
          <p className="text-xs text-red-600 mt-2">Need attention</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
              Limit
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Stock Threshold
          </p>
          <p className="text-3xl font-bold text-gray-900">{lowStockLimit}</p>
          <p className="text-xs text-orange-600 mt-2">Units minimum</p>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 mb-8">
        <div className="flex flex-col xl:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by product name, code, category, or supplier..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-gray-700 placeholder-gray-400 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-700 text-lg"
              >
                <option value="all">All Status</option>
                <option value="in-stock">Healthy Stock</option>
                <option value="low">Critical Stock</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-lg font-medium text-gray-700">
                Stock Limit:
              </label>
              <input
                type="number"
                value={lowStockLimit}
                onChange={(e) =>
                  setLowStockLimit(parseInt(e.target.value) || 10)
                }
                className="w-20 px-3 py-4 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-lg text-center"
                min="1"
              />
            </div>

            <button className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Inventory Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Specifications
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  {/* Product Details */}
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img
                          className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-300"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-block">
                          {item.productCode}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Specifications */}
                  <td className="px-6 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.burners} Burner
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.burnerType} Type
                      </div>
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-gray-900">
                        ₹{item.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total: ₹{item.totalValue.toLocaleString()}
                      </div>
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td className="px-6 py-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.quantity)}
                        <span
                          className={`text-2xl font-bold ${
                            item.quantity <= lowStockLimit
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <span className="text-gray-500 text-sm">units</span>
                      </div>
                      {getStatusBadge(item.quantity)}
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(item.trend)}
                        <span
                          className={`text-sm font-semibold ${
                            item.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.weeklyChange} this week
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {item.lastUpdated}
                      </div>
                    </div>
                  </td>

                  {/* Supplier */}
                  <td className="px-6 py-6">
                    <div className="text-sm font-medium text-gray-900">
                      {item.supplier}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-6">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-16">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No inventory items found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Analytics Footer */}
      <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Inventory Analytics
            </h3>
            <p className="text-gray-600">
              Performance insights and trend analysis
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Turnover Rate</p>
              <p className="text-2xl font-bold text-green-600">12.4%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Reorder Point</p>
              <p className="text-2xl font-bold text-orange-600">
                {lowStockItems} items
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Avg. Stock Days</p>
              <p className="text-2xl font-bold text-blue-600">45 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
