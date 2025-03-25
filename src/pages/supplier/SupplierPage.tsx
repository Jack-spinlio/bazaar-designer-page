
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { Header } from '@/components/Header/Header';
import { SupplierDashboard } from './SupplierDashboard';
import OrdersPage from './OrdersPage';
import MessagingPage from './MessagingPage';

const SupplierPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SupplierSidebar />
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<SupplierDashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/messaging" element={<MessagingPage />} />
            <Route path="*" element={<Navigate to="/supplier" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;
