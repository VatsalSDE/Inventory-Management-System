import { apiFetch } from './api.js';

export const billingAPI = {
  // Get all bills
  getAll: async () => {
    return await apiFetch('/billing');
  },

  // Get bill by ID
  getById: async (id) => {
    return await apiFetch(`/billing/${id}`);
  },

  // Create new bill
  create: async (billData) => {
    return await apiFetch('/billing', {
      method: 'POST',
      body: JSON.stringify(billData)
    });
  },

  // Update bill
  update: async (id, billData) => {
    return await apiFetch(`/billing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(billData)
    });
  },

  // Delete bill
  delete: async (id) => {
    return await apiFetch(`/billing/${id}`, {
      method: 'DELETE'
    });
  },

  // Get bill payments
  getPayments: async (billId) => {
    return await apiFetch(`/billing/${billId}/payments`);
  },

  // Add payment to bill
  addPayment: async (billId, paymentData) => {
    return await apiFetch(`/billing/${billId}/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  // Delete payment
  deletePayment: async (billId, paymentId) => {
    return await apiFetch(`/billing/${billId}/payments/${paymentId}`, {
      method: 'DELETE'
    });
  },

  // Get bill templates
  getTemplates: async () => {
    return await apiFetch('/billing/templates/all');
  },

  // Get bill settings
  getSettings: async () => {
    return await apiFetch('/billing/settings/all');
  },

  // Update bill setting
  updateSetting: async (key, value) => {
    return await apiFetch(`/billing/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value })
    });
  },

  // Generate bill PDF
  generatePDF: async (id) => {
    return await apiFetch(`/billing/${id}/pdf`);
  },

  // Get bill statistics
  getStats: async () => {
    const bills = await billingAPI.getAll();
    
    const stats = {
      totalBills: bills.length,
      totalAmount: bills.reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0),
      paidBills: bills.filter(bill => bill.payment_status === 'paid').length,
      pendingBills: bills.filter(bill => bill.payment_status === 'pending').length,
      partialBills: bills.filter(bill => bill.payment_status === 'partial').length,
      overdueBills: bills.filter(bill => {
        if (bill.payment_status === 'paid') return false;
        const dueDate = new Date(bill.due_date);
        const today = new Date();
        return dueDate < today;
      }).length,
      totalPaid: bills.reduce((sum, bill) => sum + parseFloat(bill.paid_amount || 0), 0),
      totalBalance: bills.reduce((sum, bill) => sum + parseFloat(bill.balance_amount || 0), 0)
    };

    return stats;
  },

  // Get overdue bills
  getOverdueBills: async () => {
    const bills = await billingAPI.getAll();
    const today = new Date();
    
    return bills.filter(bill => {
      if (bill.payment_status === 'paid') return false;
      const dueDate = new Date(bill.due_date);
      return dueDate < today;
    });
  },

  // Get bills by status
  getBillsByStatus: async (status) => {
    const bills = await billingAPI.getAll();
    return bills.filter(bill => bill.payment_status === status);
  },

  // Search bills
  searchBills: async (query) => {
    const bills = await billingAPI.getAll();
    const searchTerm = query.toLowerCase();
    
    return bills.filter(bill => 
      bill.bill_number.toLowerCase().includes(searchTerm) ||
      bill.dealer_name.toLowerCase().includes(searchTerm) ||
      bill.dealer_email.toLowerCase().includes(searchTerm) ||
      bill.dealer_mobile.includes(searchTerm)
    );
  },

  // Get bills by date range
  getBillsByDateRange: async (startDate, endDate) => {
    const bills = await billingAPI.getAll();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return bills.filter(bill => {
      const billDate = new Date(bill.bill_date);
      return billDate >= start && billDate <= end;
    });
  },

  // Get dealer bills
  getDealerBills: async (dealerId) => {
    const bills = await billingAPI.getAll();
    return bills.filter(bill => bill.dealer_id === dealerId);
  },

  // Calculate bill totals
  calculateBillTotals: (items, cgstRate = 9.0, sgstRate = 9.0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const cgstAmount = (subtotal * cgstRate) / 100;
    const sgstAmount = (subtotal * sgstRate) / 100;
    const total = subtotal + cgstAmount + sgstAmount;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      cgstAmount: parseFloat(cgstAmount.toFixed(2)),
      sgstAmount: parseFloat(sgstAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  },

  // Generate bill number (client-side fallback)
  generateBillNumber: () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    
    return `BL-${year}${month}${day}-${timestamp}`;
  },

  // Convert amount to words (client-side fallback)
  amountToWords: (amount) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convertNumber = (num) => {
      if (num === 0) return '';
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        if (num % 10 === 0) return tens[Math.floor(num / 10)];
        return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
      }
      if (num < 1000) {
        if (num % 100 === 0) return ones[Math.floor(num / 1000)] + ' Hundred';
        return ones[Math.floor(num / 1000)] + ' Hundred and ' + convertNumber(num % 100);
      }
      return 'Number too large for conversion';
    };
    
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    
    let result = '';
    if (rupees > 0) {
      result = convertNumber(rupees) + ' Rupees';
    }
    if (paise > 0) {
      if (result.length > 0) result += ' and ';
      result += convertNumber(paise) + ' Paise';
    }
    
    return result + ' Only';
  }
};
