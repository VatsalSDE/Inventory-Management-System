import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Bell,
  Menu,
  Search,
  Settings,
  User,
  ChevronDown,
  X,
  AlertTriangle,
  Package,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { dashboardAPI } from "../../services/api";

const TopBar = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const notifRef = useRef();
  const profileRef = useRef();
  const settingsRef = useRef();
  const searchRef = useRef();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Load real-time data
  useEffect(() => {
    loadRealTimeData();
    const interval = setInterval(loadRealTimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRealTimeData = async () => {
    try {
      const [statsData, activitiesRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentActivities()
      ]);
      
      setStats(statsData);
      
      // Convert activities to notifications
      const newNotifications = activitiesRes.slice(0, 5).map((activity, index) => ({
        id: index + 1,
        title: activity.type === 'order' ? 'New Order' : 
               activity.type === 'payment' ? 'Payment Received' : 
               activity.type === 'product' ? 'Low Stock Alert' : 'System Update',
        message: activity.description,
        time: activity.timestamp,
        type: activity.type === 'product' ? 'warning' : 
              activity.type === 'payment' ? 'success' : 'info',
        unread: true,
      }));
      
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Failed to load real-time data:', error);
    }
  };

  // Global search functionality
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Search in products, orders, dealers
      const [products, orders, dealers] = await Promise.all([
        dashboardAPI.getStats().then(s => s.products || []),
        dashboardAPI.getStats().then(s => s.orders || []),
        dashboardAPI.getStats().then(s => s.dealers || [])
      ]);

      const results = [];
      
      // Search products
      products.forEach(product => {
        if (product.product_name.toLowerCase().includes(term.toLowerCase()) ||
            product.product_code.toLowerCase().includes(term.toLowerCase())) {
          results.push({
            type: 'product',
            id: product.product_id,
            title: product.product_name,
            subtitle: product.product_code,
            action: () => navigate('/products')
          });
        }
      });

      // Search orders
      orders.forEach(order => {
        if (order.order_code.toLowerCase().includes(term.toLowerCase())) {
          results.push({
            type: 'order',
            id: order.order_id,
            title: `Order ${order.order_code}`,
            subtitle: `Status: ${order.order_status}`,
            action: () => navigate('/orders')
          });
        }
      });

      // Search dealers
      dealers.forEach(dealer => {
        if (dealer.firm_name.toLowerCase().includes(term.toLowerCase()) ||
            dealer.dealer_code.toLowerCase().includes(term.toLowerCase())) {
          results.push({
            type: 'dealer',
            id: dealer.dealer_id,
            title: dealer.firm_name,
            subtitle: dealer.dealer_code,
            action: () => navigate('/dealers')
          });
        }
      });

      setSearchResults(results.slice(0, 8));
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-200/20 relative z-40">
      <div className="flex items-center justify-between h-20 px-6 relative">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar - Now Functional! */}
          <div ref={searchRef} className="hidden lg:flex items-center relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, orders, dealers..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64 xl:w-80 pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="font-semibold text-gray-800">Search Results</h3>
                  </div>
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => {
                        result.action();
                        setShowSearchResults(false);
                        setSearchTerm("");
                      }}
                      className="w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          result.type === 'product' ? 'bg-blue-100 text-blue-600' :
                          result.type === 'order' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {result.type === 'product' ? <Package className="w-4 h-4" /> :
                           result.type === 'order' ? <TrendingUp className="w-4 h-4" /> :
                           <User className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{result.title}</p>
                          <p className="text-sm text-gray-500">{result.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Logo - Better positioning */}
        <div className="hidden xl:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="relative group pointer-events-auto">
            {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg"></span>
            </div> */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          <div className="text-center pointer-events-auto">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              INVENZA
            </h1>
            <p className="text-xl text-gray-500 font-medium -mt-1 whitespace-nowrap">
              Inventory Management
            </p>
          </div>
        </div>

        {/* Mobile Logo */}
        <div className="xl:hidden flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">VL</span>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            INVENZA
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Stats - Now Real-time! */}
          <div className="hidden 2xl:flex items-center gap-4 mr-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Online</span>
            </div>
            {stats && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-sm font-medium text-blue-700">
                  ₹{(stats.totalRevenue / 100000).toFixed(1)}L
                </span>
              </div>
            )}
          </div>

          {/* Notifications - Now Real-time! */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300 hover:shadow-lg group"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:animate-pulse" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">
                      Notifications
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {unreadCount} new
                    </span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${notification.unread ? "bg-blue-50/50" : ""}`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                              notification.type === "warning"
                                ? "bg-yellow-500 animate-pulse"
                                : notification.type === "success"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-800 text-sm">
                                {notification.title}
                              </h4>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {notification.message}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-xl transition-colors">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings - Now Functional! */}
          <div ref={settingsRef} className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300 hover:shadow-lg group"
              title="System Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <h3 className="font-semibold text-gray-800">System Settings</h3>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors">
                    <Package className="w-4 h-4" />
                    Low Stock Threshold
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors">
                    <TrendingUp className="w-4 h-4" />
                    Business Rules
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors">
                    <DollarSign className="w-4 h-4" />
                    Financial Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown - Now Functional! */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs opacity-80">Manager</p>
              </div>
              <ChevronDown className="w-4 h-4 opacity-80" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Admin User</p>
                      <p className="text-sm text-gray-500">
                        admin@vinayaklakshmi.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors">
                    <Settings className="w-4 h-4" />
                    Preferences
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;