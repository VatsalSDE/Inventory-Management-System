import React, { useState } from "react";
import {
  X,
  Plus,
  Search,
  Eye,
  Trash2,
  Calendar,
  User,
  Package,
  IndianRupee,
} from "lucide-react";

const Orders = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const [dealers] = useState([
    {
      id: "RAJ-001",
      firmName: "Raj Kitchen Appliances",
      dealerName: "Rajesh Kumar",
      mobile: "+91 9876543210",
      email: "rajesh@rajkitchen.com",
    },
    {
      id: "SUN-002",
      firmName: "Sunshine Gas Equipment",
      dealerName: "Sunil Sharma",
      mobile: "+91 9876543211",
      email: "sunil@sunshine.com",
    },
    {
      id: "MOD-003",
      firmName: "Modern Home Solutions",
      dealerName: "Priya Patel",
      mobile: "+91 9876543212",
      email: "priya@modernhome.com",
    },
  ]);

  const [products] = useState([
    {
      id: "PGS-STEEL-4-BRASS",
      name: "Premium Gas Stove",
      price: 15000,
      stock: 25,
    },
    {
      id: "CGS-GLASS-2-ALLOY",
      name: "Compact Gas Stove",
      price: 8500,
      stock: 45,
    },
    {
      id: "STD-STEEL-3-BRASS",
      name: "Standard 3 Burner",
      price: 12000,
      stock: 8,
    },
    {
      id: "LUX-GLASS-1-ALLOY",
      name: "Luxury Single Burner",
      price: 6500,
      stock: 5,
    },
    {
      id: "FAM-STEEL-4-ALLOY",
      name: "Family Size Stove",
      price: 13500,
      stock: 32,
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      dealerId: "RAJ-001",
      dealerName: "Rajesh Kumar",
      firmName: "Raj Kitchen Appliances",
      items: [
        {
          productId: "PGS-STEEL-4-BRASS",
          productName: "Premium Gas Stove",
          quantity: 2,
          price: 15000,
          total: 30000,
        },
        {
          productId: "CGS-GLASS-2-ALLOY",
          productName: "Compact Gas Stove",
          quantity: 1,
          price: 8500,
          total: 8500,
        },
      ],
      totalAmount: 38500,
      status: "Pending",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-22",
    },
    {
      id: "ORD-002",
      dealerId: "SUN-002",
      dealerName: "Sunil Sharma",
      firmName: "Sunshine Gas Equipment",
      items: [
        {
          productId: "STD-STEEL-3-BRASS",
          productName: "Standard 3 Burner",
          quantity: 3,
          price: 12000,
          total: 36000,
        },
      ],
      totalAmount: 36000,
      status: "Completed",
      orderDate: "2024-01-12",
      deliveryDate: "2024-01-19",
    },
  ]);

  const [orderForm, setOrderForm] = useState({
    dealerId: "",
    items: [],
    newItem: {
      productId: "",
      quantity: 1,
    },
  });

  const handleDealerSelect = (dealerId) => {
    setOrderForm((prev) => ({
      ...prev,
      dealerId,
    }));
  };

  const addItemToOrder = () => {
    const { productId, quantity } = orderForm.newItem;
    if (!productId || quantity <= 0) return;

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newItem = {
      productId,
      productName: product.name,
      quantity: parseInt(quantity),
      price: product.price,
      total: product.price * parseInt(quantity),
    };

    setOrderForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      newItem: { productId: "", quantity: 1 },
    }));
  };

  const removeItemFromOrder = (index) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateOrderTotal = () => {
    return orderForm.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!orderForm.dealerId || orderForm.items.length === 0) return;

    const dealer = dealers.find((d) => d.id === orderForm.dealerId);
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      dealerId: orderForm.dealerId,
      dealerName: dealer.dealerName,
      firmName: dealer.firmName,
      items: orderForm.items,
      totalAmount: calculateOrderTotal(),
      status: "Pending",
      orderDate: new Date().toISOString().split("T")[0],
      deliveryDate: "",
    };

    setOrders([newOrder, ...orders]);
    setOrderForm({
      dealerId: "",
      items: [],
      newItem: { productId: "", quantity: 1 },
    });
    setShowCreateForm(false);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.firmName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const selectedDealer = dealers.find((d) => d.id === orderForm.dealerId);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600 mt-2">Create and manage customer orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Package className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Calendar className="text-yellow-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Orders
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "Pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completed Orders
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "Completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <IndianRupee className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹
                {orders
                  .reduce((sum, order) => sum + order.totalAmount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Order
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dealer Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p className="font-medium">{order.dealerName}</p>
                      <p className="text-gray-500">{order.firmName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      {order.items.map((item, index) => (
                        <div key={index} className="mb-1">
                          <span className="font-medium">
                            {item.productName}
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No orders found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Order
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Order Form */}
                <div className="space-y-6">
                  {/* Dealer Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Dealer <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={orderForm.dealerId}
                      onChange={(e) => handleDealerSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a dealer...</option>
                      {dealers.map((dealer) => (
                        <option key={dealer.id} value={dealer.id}>
                          {dealer.id} - {dealer.firmName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dealer Info Display */}
                  {selectedDealer && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Dealer Information
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Firm:</span>{" "}
                          {selectedDealer.firmName}
                        </p>
                        <p>
                          <span className="font-medium">Contact:</span>{" "}
                          {selectedDealer.dealerName}
                        </p>
                        <p>
                          <span className="font-medium">Mobile:</span>{" "}
                          {selectedDealer.mobile}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {selectedDealer.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Add Product */}
                  <div className="border-t pt-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Add Products
                    </h3>
                    <div className="flex gap-3">
                      <select
                        value={orderForm.newItem.productId}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            newItem: {
                              ...prev.newItem,
                              productId: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select product...</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ₹{product.price.toLocaleString()}{" "}
                            (Stock: {product.stock})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={orderForm.newItem.quantity}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            newItem: {
                              ...prev.newItem,
                              quantity: e.target.value,
                            },
                          }))
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Qty"
                      />
                      <button
                        type="button"
                        onClick={addItemToOrder}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Receipt */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-4">
                    Order Summary
                  </h3>

                  {orderForm.items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No items added yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orderForm.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-3 rounded border"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{item.price.toLocaleString()} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              ₹{item.total.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItemFromOrder(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="font-bold text-lg">
                            ₹{calculateOrderTotal().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!orderForm.dealerId || orderForm.items.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
