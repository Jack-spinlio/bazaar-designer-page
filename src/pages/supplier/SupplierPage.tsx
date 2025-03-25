
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
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* Content area below fixed header */}
      <div className="flex flex-1 overflow-hidden pt-1">
        {/* Fixed sidebar on the left */}
        <div className="sticky top-[68px] self-start h-[calc(100vh-68px)]">
          <SupplierSidebar />
        </div>
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-y-auto">
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
