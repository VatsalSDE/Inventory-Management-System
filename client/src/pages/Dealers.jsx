import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  Building,
} from "lucide-react";
import { dealersAPI } from "../services/api";

const Dealers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDealer, setEditingDealer] = useState(null);

  const [formData, setFormData] = useState({
    firm_name: "",
    person_name: "",
    address: "",
    mobile_number: "",
    email: "",
    gstin: "",
  });

  useEffect(() => {
    loadDealers();
  }, []);

  const loadDealers = async () => {
    try {
      setLoading(true);
      const data = await dealersAPI.getAll();
      setDealers(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load dealers:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateDealerCode = (firmName) => {
    const prefix = firmName
      .split(" ")
      .map((word) => word.substring(0, 3))
      .join("")
      .toUpperCase();
    const sequenceNumber = String(dealers.length + 1).padStart(3, "0");
    return `${prefix}-${sequenceNumber}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      firm_name: "",
      person_name: "",
      address: "",
      mobile_number: "",
      email: "",
      gstin: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dealerCode = generateDealerCode(formData.firm_name);

      const newDealer = {
        ...formData,
        dealer_code: dealerCode,
      };

      await dealersAPI.create(newDealer);
      await loadDealers();
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Failed to create dealer:', err);
    }
  };

  const handleEdit = (dealer) => {
    setEditingDealer(dealer);
    setFormData({
      firm_name: dealer.firm_name,
      person_name: dealer.person_name,
      address: dealer.address,
      mobile_number: dealer.mobile_number,
      email: dealer.email,
      gstin: dealer.gstin,
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dealerCode = generateDealerCode(formData.firm_name);

      const updatedDealer = {
        ...formData,
        dealer_code: dealerCode,
      };

      await dealersAPI.update(editingDealer.dealer_id, updatedDealer);
      await loadDealers();
      resetForm();
      setShowEditForm(false);
      setEditingDealer(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to update dealer:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      try {
        await dealersAPI.delete(id);
        await loadDealers();
      } catch (err) {
        setError(err.message);
        console.error('Failed to delete dealer:', err);
      }
    }
  };

  const filteredDealers = dealers.filter((dealer) => {
    const matchesSearch =
      dealer.firm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.dealer_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && dealer.status === "Active") ||
      (statusFilter === "high-receivables" && dealer.receivables > 50000) ||
      (statusFilter === "recent" &&
        new Date(dealer.lastOrder) > new Date("2024-01-01"));

    return matchesSearch && matchesStatus;
  });

  const totalDealers = dealers.length;
  const activeDealers = dealers.filter(
    (dealer) => dealer.status === "Active",
  ).length;

  const getStatusColor = (receivables) => {
    if (receivables === 0)
      return "bg-green-100 text-green-800 border-green-200";
    if (receivables > 50000) return "bg-red-100 text-red-800 border-red-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dealers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dealers</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadDealers}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Users className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {activeDealers}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Dealers Network
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage your dealer partnerships and track business relationships
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              Network
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Total Dealers
          </p>
          <p className="text-3xl font-bold text-gray-900">{totalDealers}</p>
          <p className="text-xs text-blue-600 mt-2">Active partnerships</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
              Active
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Active Dealers
          </p>
          <p className="text-3xl font-bold text-gray-900">{activeDealers}</p>
          <p className="text-xs text-green-600 mt-2">Currently engaged</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
              GST
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            GST Registered
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {dealers.filter(d => d.gstin).length}
          </p>
          <p className="text-xs text-orange-600 mt-2">Tax compliant</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">
              New
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            This Month
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {dealers.filter(d => {
              const joinDate = new Date(d.created_at);
              const thisMonth = new Date();
              return joinDate.getMonth() === thisMonth.getMonth() && 
                     joinDate.getFullYear() === thisMonth.getFullYear();
            }).length}
          </p>
          <p className="text-xs text-yellow-600 mt-2">Recent additions</p>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search dealers by name, firm, or contact..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-gray-700 placeholder-gray-400 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-gray-700 text-lg"
            >
              <option value="all">All Dealers</option>
              <option value="active">Active Only</option>
              <option value="gst">GST Registered</option>
              <option value="recent">Recent Additions</option>
            </select>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold"
            >
              <Plus className="w-6 h-6" />
              Add Dealer
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Dealers Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredDealers.map((dealer) => (
          <div
            key={dealer.dealer_id}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl border-3 border-white shadow-xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{dealer.firm_name}</h3>
                    <p className="text-blue-100 text-lg">{dealer.person_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {dealer.dealer_code}
                      </span>
                      {dealer.gstin && (
                        <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm font-medium">
                          GST: {dealer.gstin}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                    ✅ Active
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">
                    {dealer.dealer_id}
                  </p>
                  <p className="text-xs text-blue-500 font-medium">
                    Dealer ID
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {dealer.gstin ? 'Yes' : 'No'}
                  </p>
                  <p className="text-xs text-green-500 font-medium">
                    GST Registered
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 mb-6">
                {dealer.mobile_number && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {dealer.mobile_number}
                      </p>
                      <p className="text-sm text-gray-500">Primary Contact</p>
                    </div>
                  </div>
                )}

                {dealer.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {dealer.email}
                      </p>
                      <p className="text-sm text-gray-500">Business Email</p>
                    </div>
                  </div>
                )}

                {dealer.address && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 line-clamp-2">
                        {dealer.address}
                      </p>
                      <p className="text-sm text-gray-500">Business Address</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined: {new Date(dealer.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => handleEdit(dealer)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg transform hover:scale-105 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(dealer.dealer_id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-2xl hover:from-red-600 hover:to-red-700 transition-colors shadow-lg transform hover:scale-105 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredDealers.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            No dealers found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search criteria or add new dealers to get
            started.
          </p>
        </div>
      )}

      {/* Add Dealer Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Add New Dealer</h2>
                  <p className="text-blue-100 mt-1">
                    Expand your dealer network
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Firm Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Firm Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firm_name"
                  value={formData.firm_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                  placeholder="Enter firm/company name"
                  required
                />
              </div>

              {/* Dealer Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="person_name"
                  value={formData.person_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                  placeholder="Enter contact person name"
                  required
                />
              </div>

              {/* Contact Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                    placeholder="email@domain.com"
                    required
                  />
                </div>
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                  placeholder="22AAAAA0000A1Z5 (optional)"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg resize-none"
                  placeholder="Enter complete business address with city, state, and pincode"
                  required
                />
              </div>

              {/* Generated Dealer ID */}
              {formData.firm_name && (
                <div className="bg-cyan-50 p-6 rounded-2xl border border-cyan-200">
                  <label className="block text-lg font-semibold text-cyan-700 mb-2">
                    Generated Dealer Code
                  </label>
                  <div className="text-2xl font-bold text-cyan-600 font-mono">
                    {generateDealerCode(formData.firm_name)}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors text-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-colors shadow-lg text-lg font-semibold"
                >
                  Add Dealer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dealer Modal */}
      {showEditForm && editingDealer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Edit Dealer</h2>
                  <p className="text-blue-100 mt-1">
                    Update dealer information
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingDealer(null);
                    resetForm();
                  }}
                  className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              {/* Firm Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Firm Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firm_name"
                  value={formData.firm_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                  placeholder="Enter firm/company name"
                  required
                />
              </div>

              {/* Dealer Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="person_name"
                  value={formData.person_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                  placeholder="Enter contact person name"
                  required
                />
              </div>

              {/* Contact Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                    placeholder="email@domain.com"
                    required
                  />
                </div>
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg"
                  placeholder="22AAAAA0000A1Z5 (optional)"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-lg resize-none"
                  placeholder="Enter complete business address with city, state, and pincode"
                  required
                />
              </div>

              {/* Generated Dealer ID */}
              {formData.firm_name && (
                <div className="bg-cyan-50 p-6 rounded-2xl border border-cyan-200">
                  <label className="block text-lg font-semibold text-cyan-700 mb-2">
                    Generated Dealer Code
                  </label>
                  <div className="text-2xl font-bold text-cyan-600 font-mono">
                    {generateDealerCode(formData.firm_name)}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingDealer(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors text-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg text-lg font-semibold"
                >
                  Update Dealer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dealers;
