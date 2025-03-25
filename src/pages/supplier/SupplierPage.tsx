
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
      {/* Fixed header at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Header />
      </div>
      {/* Content area below fixed header with padding for header height */}
      <div className="flex flex-1 pt-[68px]">
        {/* Fixed sidebar on the left */}
        <div className="fixed left-0 top-[68px] h-[calc(100vh-68px)] z-40">
          <SupplierSidebar />
        </div>
        {/* Main content area with appropriate padding for sidebar */}
        <div className="ml-20 flex-1 p-6 w-full">
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
