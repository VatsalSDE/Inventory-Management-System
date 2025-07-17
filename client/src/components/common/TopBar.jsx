import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  Bell,
  Menu,
  Search,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";

const TopBar = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [notifications] = useState([
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Standard 3 Burner is running low (8 units)",
      time: "5 min ago",
      type: "warning",
      unread: true,
    },
    {
      id: 2,
      title: "New Order Received",
      message: "Order ORD-004 from Raj Kitchen Appliances",
      time: "1 hour ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of ₹25,000 received from Sunshine Gas",
      time: "2 hours ago",
      type: "success",
      unread: false,
    },
    {
      id: 4,
      title: "Inventory Updated",
      message: "Product catalog has been updated successfully",
      time: "3 hours ago",
      type: "info",
      unread: false,
    },
  ]);

  const notifRef = useRef();
  const profileRef = useRef();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
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

          {/* Search Bar */}
          <div className="hidden lg:flex items-center relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-64 xl:w-80 pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Center Logo - Better positioning */}
        <div className="hidden xl:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="relative group pointer-events-auto">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">VL</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          <div className="text-center pointer-events-auto">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              Vinayak Lakshmi
            </h1>
            <p className="text-xs text-gray-500 font-medium -mt-1 whitespace-nowrap">
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
            Vinayak Lakshmi
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden 2xl:flex items-center gap-4 mr-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Online</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-sm font-medium text-blue-700">₹18.7L</span>
            </div>
          </div>

          {/* Notifications */}
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

          {/* Settings */}
          <button className="p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300 hover:shadow-lg group">
            <Settings className="w-5 h-5 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Profile Dropdown */}
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
                  <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors">
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