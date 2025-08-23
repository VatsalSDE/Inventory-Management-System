import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Mail, Eye, Edit, Trash2, DollarSign, Calendar, User, FileText, CreditCard, CheckCircle, AlertTriangle, Clock, X } from 'lucide-react';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for now
    setBills([
      {
        bill_id: 1,
        bill_number: 'BL-2024-0001',
        dealer_name: 'ABC Traders',
        dealer_email: 'abc@example.com',
        dealer_mobile: '+91 98765 43210',
        total_amount: 25000,
        payment_status: 'pending',
        bill_date: '2024-01-15',
        due_date: '2024-02-15'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Billing System</h1>
        <p className="text-gray-600 mt-2">Professional billing and invoicing</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <select className="px-4 py-2 border rounded-lg">
            <option>All Status</option>
            <option>Pending</option>
            <option>Paid</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Bill
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dealer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bills.map((bill) => (
              <tr key={bill.bill_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{bill.bill_number}</div>
                  <div className="text-sm text-gray-500">{bill.bill_date}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{bill.dealer_name}</div>
                  <div className="text-sm text-gray-500">{bill.dealer_email}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{bill.total_amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {bill.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
