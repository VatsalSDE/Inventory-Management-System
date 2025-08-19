import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Calendar,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddPayment, setShowAddPayment] = useState(false);

  // Mock data
  const [payments, setPayments] = useState([
    {
      id: "PAY-001",
      dealerId: "RAJ-001",
      dealerName: "Rajesh Kumar",
      firmName: "Raj Kitchen Appliances",
      orderId: "ORD-001",
      totalAmount: 38500,
      paidAmount: 20000,
      pendingAmount: 18500,
      paymentDate: "2024-01-16",
      paymentMethod: "Bank Transfer",
      status: "Partial",
      transactionId: "TXN123456789",
    },
    {
      id: "PAY-002",
      dealerId: "SUN-002",
      dealerName: "Sunil Sharma",
      firmName: "Sunshine Gas Equipment",
      orderId: "ORD-002",
      totalAmount: 36000,
      paidAmount: 36000,
      pendingAmount: 0,
      paymentDate: "2024-01-13",
      paymentMethod: "Cash",
      status: "Completed",
      transactionId: "CASH001",
    },
    {
      id: "PAY-003",
      dealerId: "MOD-003",
      dealerName: "Priya Patel",
      firmName: "Modern Home Solutions",
      orderId: "ORD-003",
      totalAmount: 45000,
      paidAmount: 0,
      pendingAmount: 45000,
      paymentDate: null,
      paymentMethod: null,
      status: "Pending",
      transactionId: null,
    },
  ]);

  const [dealers] = useState([
    {
      id: "RAJ-001",
      firmName: "Raj Kitchen Appliances",
      dealerName: "Rajesh Kumar",
    },
    {
      id: "SUN-002",
      firmName: "Sunshine Gas Equipment",
      dealerName: "Sunil Sharma",
    },
    {
      id: "MOD-003",
      firmName: "Modern Home Solutions",
      dealerName: "Priya Patel",
    },
  ]);

  const [orders] = useState([
    { id: "ORD-001", dealerId: "RAJ-001", amount: 38500 },
    { id: "ORD-002", dealerId: "SUN-002", amount: 36000 },
    { id: "ORD-003", dealerId: "MOD-003", amount: 45000 },
    { id: "ORD-004", dealerId: "RAJ-001", amount: 25000 },
  ]);

  const [paymentForm, setPaymentForm] = useState({
    dealerId: "",
    orderId: "",
    paidAmount: "",
    paymentMethod: "Bank Transfer",
    transactionId: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();

    const order = orders.find((o) => o.id === paymentForm.orderId);
    const dealer = dealers.find((d) => d.id === paymentForm.dealerId);

    if (!order || !dealer) return;

    const paidAmount = parseFloat(paymentForm.paidAmount);
    const pendingAmount = order.amount - paidAmount;

    const newPayment = {
      id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
      dealerId: paymentForm.dealerId,
      dealerName: dealer.dealerName,
      firmName: dealer.firmName,
      orderId: paymentForm.orderId,
      totalAmount: order.amount,
      paidAmount: paidAmount,
      pendingAmount: pendingAmount,
      paymentDate: paymentForm.paymentDate,
      paymentMethod: paymentForm.paymentMethod,
      status: pendingAmount > 0 ? "Partial" : "Completed",
      transactionId: paymentForm.transactionId,
    };

    setPayments([newPayment, ...payments]);
    setPaymentForm({
      dealerId: "",
      orderId: "",
      paidAmount: "",
      paymentMethod: "Bank Transfer",
      transactionId: "",
      paymentDate: new Date().toISOString().split("T")[0],
    });
    setShowAddPayment(false);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      payment.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const dealerOrders = paymentForm.dealerId
    ? orders.filter((order) => order.dealerId === paymentForm.dealerId)
    : [];

  const selectedOrder = orders.find((o) => o.id === paymentForm.orderId);

  // Summary calculations
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.paidAmount,
    0,
  );
  const totalPending = payments.reduce(
    (sum, payment) => sum + payment.pendingAmount,
    0,
  );
  const completedPayments = payments.filter(
    (p) => p.status === "Completed",
  ).length;
  const pendingPayments = payments.filter((p) => p.status === "Pending").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Payments Management
        </h1>
        <p className="text-gray-600 mt-2">
          Track payments and manage outstanding amounts
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <TrendingUp className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <TrendingDown className="text-red-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <DollarSign className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedPayments}
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingPayments}
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
            placeholder="Search payments..."
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
          <option value="completed">Completed</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
        </select>
        <button
          onClick={() => setShowAddPayment(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Payment
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dealer Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p className="font-medium">{payment.dealerName}</p>
                      <p className="text-gray-500">{payment.firmName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {payment.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p>
                        Total:{" "}
                        <span className="font-medium">
                          ₹{payment.totalAmount.toLocaleString()}
                        </span>
                      </p>
                      <p>
                        Paid:{" "}
                        <span className="font-medium text-green-600">
                          ₹{payment.paidAmount.toLocaleString()}
                        </span>
                      </p>
                      {payment.pendingAmount > 0 && (
                        <p>
                          Pending:{" "}
                          <span className="font-medium text-red-600">
                            ₹{payment.pendingAmount.toLocaleString()}
                          </span>
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p>{payment.paymentMethod || "-"}</p>
                      {payment.transactionId && (
                        <p className="text-xs text-gray-500">
                          ID: {payment.transactionId}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "Partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.paymentDate || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No payments found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Add Payment
              </h2>
              <button
                onClick={() => setShowAddPayment(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
              {/* Dealer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Dealer <span className="text-red-500">*</span>
                </label>
                <select
                  name="dealerId"
                  value={paymentForm.dealerId}
                  onChange={handleInputChange}
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

              {/* Order Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Order <span className="text-red-500">*</span>
                </label>
                <select
                  name="orderId"
                  value={paymentForm.orderId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!paymentForm.dealerId}
                >
                  <option value="">Choose an order...</option>
                  {dealerOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.id} - ₹{order.amount.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Amount Display */}
              {selectedOrder && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    Order Total: ₹{selectedOrder.amount.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Paid Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  value={paymentForm.paidAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  max={selectedOrder?.amount}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={paymentForm.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={paymentForm.transactionId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentForm.paymentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
