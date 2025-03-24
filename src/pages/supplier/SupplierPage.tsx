
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';
import { ProductsList } from './ProductsList';
import { UploadProduct } from './UploadProduct';
import { EditProfile } from './EditProfile';
import { EditProduct } from './EditProduct';
import { ProductParameters } from './ProductParameters';
import { Header } from '@/components/Header/Header';
import { ProtectedRoute } from '@/auth/ProtectedRoute';

const SupplierPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <SupplierSidebar />
          <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<ProductsList />} />
              <Route path="/upload" element={<UploadProduct />} />
              <Route path="/parameters" element={<ProductParameters />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/edit/:id" element={<EditProduct />} />
              <Route path="*" element={<Navigate to="/supplier" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SupplierPage;
