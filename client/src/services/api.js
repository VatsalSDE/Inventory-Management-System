import { apiFetch } from '../apiClient';

// Authentication
export const authAPI = {
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
};

// Products
export const productsAPI = {
  getAll: () => apiFetch('/products'),
  create: (product) => apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(product)
  }),
  update: (id, product) => apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  }),
  delete: (id) => apiFetch(`/products/${id}`, {
    method: 'DELETE'
  })
};

// Dealers
export const dealersAPI = {
  getAll: () => apiFetch('/dealers'),
  create: (dealer) => apiFetch('/dealers', {
    method: 'POST',
    body: JSON.stringify(dealer)
  }),
  update: (id, dealer) => apiFetch(`/dealers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dealer)
  }),
  delete: (id) => apiFetch(`/dealers/${id}`, {
    method: 'DELETE'
  })
};

// Orders
export const ordersAPI = {
  getAll: () => apiFetch('/orders'),
  getItems: (id) => apiFetch(`/orders/${id}/items`),
  create: (order) => apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(order)
  }),
  updateStatus: (id, status) => apiFetch(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ order_status: status })
  }),
  delete: (id) => apiFetch(`/orders/${id}`, {
    method: 'DELETE'
  })
};

// Payments
export const paymentsAPI = {
  getAll: () => apiFetch('/payments'),
  create: (payment) => apiFetch('/payments', {
    method: 'POST',
    body: JSON.stringify(payment)
  }),
  update: (id, payment) => apiFetch(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payment)
  }),
  delete: (id) => apiFetch(`/payments/${id}`, {
    method: 'DELETE'
  })
};

// Dashboard Statistics
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [products, orders, payments] = await Promise.all([
        productsAPI.getAll(),
        ordersAPI.getAll(),
        paymentsAPI.getAll()
      ]);

      // Calculate statistics
      const totalProducts = products.length;
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.order_status === 'Pending').length;
      const completedOrders = orders.filter(o => o.order_status === 'Completed').length;
      
      const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.paid_amount), 0);
      const totalInventoryValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * p.quantity), 0);
      
      // Get low stock products (quantity < 10)
      const lowStockProducts = products.filter(p => p.quantity < 10).length;

      return {
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        totalInventoryValue,
        lowStockProducts,
        products,
        orders,
        payments
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getSalesData: async () => {
    try {
      const orders = await ordersAPI.getAll();
      const payments = await paymentsAPI.getAll();
      
      // Group by date and calculate daily sales
      const salesByDate = {};
      
      payments.forEach(payment => {
        const date = new Date(payment.payment_date).toLocaleDateString('en-US', { weekday: 'short' });
        if (!salesByDate[date]) {
          salesByDate[date] = { sales: 0, target: 0 };
        }
        salesByDate[date].sales += parseFloat(payment.paid_amount);
        salesByDate[date].target = salesByDate[date].sales * 0.8; // 80% target
      });

      // Convert to array format for charts
      return Object.entries(salesByDate).map(([name, data]) => ({
        name,
        sales: Math.round(data.sales),
        target: Math.round(data.target)
      }));
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return [];
    }
  },

  getTopSellingProducts: async () => {
    try {
      const orders = await ordersAPI.getAll();
      const products = await productsAPI.getAll();
      
      // Calculate product sales
      const productSales = {};
      
      for (const order of orders) {
        const items = await ordersAPI.getItems(order.order_id);
        items.forEach(item => {
          const product = products.find(p => p.product_id === item.product_id);
          if (product) {
            if (!productSales[product.product_id]) {
              productSales[product.product_id] = {
                name: product.product_name,
                quantity: 0,
                value: 0
              };
            }
            productSales[product.product_id].quantity += item.quantity;
            productSales[product.product_id].value += item.quantity * parseFloat(item.unit_price);
          }
        });
      }

      // Sort by value and return top 5
      return Object.values(productSales)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map(item => ({
          ...item,
          value: `₹${item.value.toLocaleString()}`,
          trend: `+${Math.floor(Math.random() * 15) + 1}%` // Mock trend for now
        }));
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      return [];
    }
  },

  getLowStockProducts: async () => {
    try {
      const products = await productsAPI.getAll();
      
      // Get products with low stock (quantity <= min_stock_level or default 10)
      return products
        .filter(p => p.quantity <= (p.min_stock_level || 10))
        .map(product => ({
          product_id: product.product_id,
          product_name: product.product_name,
          product_code: product.product_code,
          quantity: product.quantity,
          min_stock_level: product.min_stock_level || 10,
          price: product.price
        }))
        .slice(0, 10); // Limit to 10 items
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  },

  getRecentActivities: async () => {
    try {
      const [orders, products, payments] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll(),
        paymentsAPI.getAll()
      ]);
      
      const activities = [];
      
      // Add recent orders
      orders.slice(0, 5).forEach(order => {
        activities.push({
          type: 'order',
          description: `New order #${order.order_code} received`,
          timestamp: new Date(order.created_at).toLocaleString()
        });
      });
      
      // Add recent payments
      payments.slice(0, 3).forEach(payment => {
        activities.push({
          type: 'payment',
          description: `Payment received: ₹${payment.paid_amount}`,
          timestamp: new Date(payment.payment_date).toLocaleString()
        });
      });
      
      // Add product updates
      products.slice(0, 2).forEach(product => {
        if (product.quantity < 10) {
          activities.push({
            type: 'product',
            description: `Low stock alert: ${product.product_name}`,
            timestamp: new Date().toLocaleString()
          });
        }
      });
      
      // Sort by timestamp and return recent activities
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 8);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }
};
