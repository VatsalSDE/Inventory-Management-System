import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout.jsx";
import Login from "../auth/login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Products from "../pages/Products.jsx";
import Inventory from "../pages/Inventory.jsx";
import Dealers from "../pages/Dealers.jsx";
import Orders from "../pages/Orders.jsx";
import Payments from "../pages/Payments.jsx";
import React from "react";

import { isAuthenticated } from "../apiClient";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
}

const Adminroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="dealers" element={<Dealers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="payments" element={<Payments />} />
      </Route>
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  );
};

export default Adminroutes;
