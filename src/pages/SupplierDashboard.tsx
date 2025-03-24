
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Uploads from './Uploads';
import SupplierHome from './SupplierHome';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';

// These would be implemented as needed
const ProductsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Products</h1></div>;
const OrdersPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Orders</h1></div>;
const EnquiriesPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Enquiries</h1></div>;
const SettingsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>;

const SupplierDashboard = () => {
  return (
    <Layout sidebar={<SupplierSidebar />}>
      <Routes>
        <Route path="/" element={<Navigate to="/supplier/dashboard" replace />} />
        <Route path="/dashboard" element={<SupplierHome />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/enquiries" element={<EnquiriesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
};

export default SupplierDashboard;
