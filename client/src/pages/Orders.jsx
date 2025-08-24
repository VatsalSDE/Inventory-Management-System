import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ShoppingCart,
  Truck,
  FileText,
  IndianRupee,
} from "lucide-react";
import { ordersAPI, dealersAPI, productsAPI } from "../services/api";

const Orders = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const [formData, setFormData] = useState({
    order_code: "",
    dealer_id: "",
    order_status: "Pending",
    total_amount: "",
    delivery_date: "",
    items: [{ product_id: "", quantity: "", unit_price: "" }]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, dealersData, productsData] = await Promise.all([
        ordersAPI.getAll(),
        dealersAPI.getAll(),
        productsAPI.getAll()
      ]);
      setOrders(ordersData);
      setDealers(dealersData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateOrderCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}${day}-${random}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Auto-calculate unit price if product is selected
    if (field === 'product_id') {
      const product = products.find(p => p.product_id.toString() === value);
      if (product) {
        newItems[index].unit_price = product.price.toString();
        // Reset quantity when product changes
        newItems[index].quantity = "";
      }
    }
    
    // Validate quantity against available stock
    if (field === 'quantity') {
      const product = products.find(p => p.product_id.toString() === newItems[index].product_id);
      if (product && parseInt(value) > product.quantity) {
        alert(`Cannot order more than available stock. Available: ${product.quantity}`);
        newItems[index].quantity = product.quantity.toString();
      }
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: "", unit_price: "" }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0));
    }, 0);
  };

  const resetForm = () => {
    setFormData({
      order_code: "",
      dealer_id: "",
      order_status: "Pending",
      total_amount: "",
      delivery_date: "",
      items: [{ product_id: "", quantity: "", unit_price: "" }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate stock levels before submitting
      for (const item of formData.items) {
        if (item.product_id && item.quantity) {
          const product = products.find(p => p.product_id.toString() === item.product_id);
          if (product && parseInt(item.quantity) > product.quantity) {
            alert(`Cannot order ${item.quantity} of ${product.product_name}. Available stock: ${product.quantity}`);
            return;
          }
        }
      }

      const orderCode = formData.order_code || generateOrderCode();
      const totalAmount = calculateTotal();

      const newOrder = {
        ...formData,
        order_code: orderCode,
        total_amount: totalAmount,
        items: formData.items.filter(item => item.product_id && item.quantity && item.unit_price)
      };

      await ordersAPI.create(newOrder);
      await loadData();
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Failed to create order:', err);
    }
  };

  const handleEdit = async (order) => {
    try {
      setEditingOrder(order);
      
      // Load order items
      const items = await ordersAPI.getItems(order.order_id);
      
      setFormData({
        order_code: order.order_code,
        dealer_id: order.dealer_id.toString(),
        order_status: order.order_status,
        total_amount: order.total_amount.toString(),
        delivery_date: order.delivery_date ? order.delivery_date.split('T')[0] : "",
        items: items.length > 0 ? items.map(item => ({
          product_id: item.product_id.toString(),
          quantity: item.quantity.toString(),
          unit_price: item.unit_price.toString()
        })) : [{ product_id: "", quantity: "", unit_price: "" }]
      });
      
      setShowEditForm(true);
    } catch (err) {
      console.error('Failed to load order items:', err);
      setError('Failed to load order items for editing');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Validate stock levels before updating
      for (const item of formData.items) {
        if (item.product_id && item.quantity) {
          const product = products.find(p => p.product_id.toString() === item.product_id);
          if (product && parseInt(item.quantity) > product.quantity) {
            alert(`Cannot order ${item.quantity} of ${product.product_name}. Available stock: ${product.quantity}`);
            return;
          }
        }
      }

      const totalAmount = calculateTotal();

      const updatedOrder = {
        ...formData,
        total_amount: totalAmount,
        items: formData.items.filter(item => item.product_id && item.quantity && item.unit_price)
      };

      await ordersAPI.update(editingOrder.order_id, updatedOrder);
      await loadData();
      resetForm();
      setShowEditForm(false);
      setEditingOrder(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to update order:', err);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      await loadData();
    } catch (err) {
      setError(err.message);
      console.error('Failed to update order status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.delete(id);
        await loadData();
      } catch (err) {
        setError(err.message);
        console.error('Failed to delete order:', err);
      }
    }
  };

  const viewOrderItems = async (order) => {
    try {
      const items = await ordersAPI.getItems(order.order_id);
      setOrderItems(items);
      setSelectedOrder(order);
      setShowItemsModal(true);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load order items:', err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.firm_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.order_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.order_status === 'Pending').length;
  const completedOrders = orders.filter(o => o.order_status === 'Completed').length;
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Package className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
              <ShoppingCart className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {pendingOrders}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Orders Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Track and manage customer orders efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              Total
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Total Orders
          </p>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-xs text-blue-600 mt-2">All time</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">
              Pending
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Pending Orders
          </p>
          <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
          <p className="text-xs text-yellow-600 mt-2">Awaiting processing</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
              Completed
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Completed Orders
          </p>
          <p className="text-3xl font-bold text-gray-900">{completedOrders}</p>
          <p className="text-xs text-green-600 mt-2">Successfully delivered</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
              Revenue
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Total Revenue
          </p>
          <p className="text-3xl font-bold text-gray-900">
            ₹{(totalRevenue / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-purple-600 mt-2">From orders</p>
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
              placeholder="Search orders by code or dealer..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-gray-700 placeholder-gray-400 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-700 text-lg"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg font-semibold"
            >
              <Plus className="w-6 h-6" />
              Create Order
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Orders Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredOrders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl border-3 border-white shadow-xl flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{order.order_code}</h3>
                    <p className="text-blue-100 text-lg">{order.firm_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        ₹{parseFloat(order.total_amount || 0).toLocaleString()}
                      </span>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}
                  >
                    {getStatusIcon(order.order_status)}
                    {order.order_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">
                    {order.order_id}
                  </p>
                  <p className="text-xs text-blue-500 font-medium">
                    Order ID
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Not set'}
                  </p>
                  <p className="text-xs text-green-500 font-medium">
                    Delivery Date
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(order.order_id, status)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        order.order_status === status
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => viewOrderItems(order)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-colors shadow-lg transform hover:scale-105 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  View Items
                </button>
                <button 
                  onClick={() => handleEdit(order)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg transform hover:scale-105 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(order.order_id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-2xl hover:from-red-600 hover:to-red-700 transition-colors shadow-lg transform hover:scale-105 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            No orders found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search criteria or create new orders to get
            started.
          </p>
        </div>
      )}

      {/* Create Order Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Create New Order</h2>
                  <p className="text-blue-100 mt-1">
                    Add a new customer order
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
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Order Code
                  </label>
                  <input
                    type="text"
                    name="order_code"
                    value={formData.order_code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg"
                    placeholder="Leave empty for auto-generation"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Dealer <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="dealer_id"
                    value={formData.dealer_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg"
                    required
                  >
                    <option value="">Select Dealer</option>
                    {dealers.map(dealer => (
                      <option key={dealer.dealer_id} value={dealer.dealer_id}>
                        {dealer.firm_name} - {dealer.person_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Order Status
                  </label>
                  <select
                    name="order_status"
                    value={formData.order_status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-semibold text-gray-700">
                    Order Items <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    + Add Item
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product
                        </label>
                        <select
                          value={item.product_id}
                          onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map(product => (
                            <option key={product.product_id} value={product.product_id}>
                              {product.product_name} - ₹{product.price} (Stock: {product.quantity})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Price
                        </label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1}
                          className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <label className="block text-lg font-semibold text-blue-700">
                    Total Amount
                  </label>
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{calculateTotal().toLocaleString()}
                  </div>
                </div>
              </div>

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
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-lg text-lg font-semibold"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

             {/* Edit Order Modal */}
       {showEditForm && editingOrder && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
             <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-8 text-white">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-3xl font-bold">Edit Order</h2>
                   <p className="text-blue-100 mt-1">
                     Update order details and items
                   </p>
                 </div>
                 <button
                   onClick={() => {
                     setShowEditForm(false);
                     setEditingOrder(null);
                     resetForm();
                   }}
                   className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>

             <form onSubmit={handleUpdate} className="p-8 space-y-6">
               {/* Order Details */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-lg font-semibold text-gray-700 mb-3">
                     Order Code
                   </label>
                   <input
                     type="text"
                     name="order_code"
                     value={formData.order_code}
                     onChange={handleInputChange}
                     className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg"
                     placeholder="Order code"
                   />
                 </div>

                 <div>
                   <label className="block text-lg font-semibold text-gray-700 mb-3">
                     Dealer <span className="text-red-500">*</span>
                   </label>
                   <select
                     name="dealer_id"
                     value={formData.dealer_id}
                     onChange={handleInputChange}
                     className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg"
                     required
                   >
                     <option value="">Select Dealer</option>
                     {dealers.map(dealer => (
                       <option key={dealer.dealer_id} value={dealer.dealer_id}>
                         {dealer.firm_name} - {dealer.person_name}
                       </option>
                     ))}
                   </select>
                 </div>

                 <div>
                   <label className="block text-lg font-semibold text-gray-700 mb-3">
                     Order Status
                   </label>
                   <select
                     name="order_status"
                     value={formData.order_status}
                     onChange={handleInputChange}
                     className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg"
                   >
                     <option value="Pending">Pending</option>
                     <option value="Processing">Processing</option>
                     <option value="Shipped">Shipped</option>
                     <option value="Completed">Completed</option>
                     <option value="Cancelled">Cancelled</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-lg font-semibold text-gray-700 mb-3">
                     Delivery Date
                   </label>
                   <input
                     type="date"
                     name="delivery_date"
                     value={formData.delivery_date}
                     onChange={handleInputChange}
                     className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg"
                   />
                 </div>
               </div>

               {/* Order Items */}
               <div>
                 <div className="flex items-center justify-between mb-4">
                   <label className="block text-lg font-semibold text-gray-700">
                     Order Items <span className="text-red-500">*</span>
                   </label>
                   <button
                     type="button"
                     onClick={addItem}
                     className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                   >
                     + Add Item
                   </button>
                 </div>
                 <p className="text-sm text-gray-600 mb-4">
                   💡 Stock validation: You can only order up to the available stock quantity for each product.
                 </p>
                 
                 <div className="space-y-4">
                   {formData.items.map((item, index) => (
                     <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Product
                         </label>
                         <select
                           value={item.product_id}
                           onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                           required
                         >
                           <option value="">Select Product</option>
                           {products.map(product => (
                             <option key={product.product_id} value={product.product_id}>
                               {product.product_name} - ₹{product.price}
                             </option>
                           ))}
                         </select>
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Quantity
                         </label>
                         <input
                           type="number"
                           value={item.quantity}
                           onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                           placeholder="0"
                           required
                         />
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Unit Price
                         </label>
                         <input
                           type="number"
                           value={item.unit_price}
                           onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                           placeholder="0.00"
                           required
                         />
                       </div>
                       
                       <div className="flex items-end">
                         <button
                           type="button"
                           onClick={() => removeItem(index)}
                           disabled={formData.items.length === 1}
                           className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           Remove
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Total Amount */}
               <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                 <div className="flex items-center justify-between">
                   <label className="block text-lg font-semibold text-blue-700">
                     Total Amount
                   </label>
                   <div className="text-3xl font-bold text-blue-600">
                     ₹{calculateTotal().toLocaleString()}
                   </div>
                 </div>
               </div>

               {/* Submit Buttons */}
               <div className="flex gap-4 pt-6 border-t border-gray-100">
                 <button
                   type="button"
                   onClick={() => {
                     setShowEditForm(false);
                     setEditingOrder(null);
                     resetForm();
                   }}
                   className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors text-lg font-semibold"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-lg text-lg font-semibold"
                 >
                   Update Order
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* Order Items Modal */}
       {showItemsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Order Items</h2>
                  <p className="text-purple-100 mt-1">
                    {selectedOrder.order_code} - {selectedOrder.firm_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowItemsModal(false)}
                  className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-semibold text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-500">Product Code: {item.product_code}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">₹{parseFloat(item.unit_price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ₹{parseFloat(selectedOrder.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
