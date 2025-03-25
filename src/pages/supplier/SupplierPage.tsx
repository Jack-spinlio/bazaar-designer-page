
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { ProductsList } from './ProductsList';
import { Header } from '@/components/Header/Header';
import { SupplierDashboard } from './SupplierDashboard';

const SupplierPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SupplierSidebar />
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<SupplierDashboard />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="*" element={<Navigate to="/supplier" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;
