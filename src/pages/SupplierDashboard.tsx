
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Uploads from './Uploads';
import SupplierHome from './SupplierHome';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';

const SupplierDashboard = () => {
  const location = useLocation();
  
  return (
    <Layout sidebar={<SupplierSidebar />}>
      <Routes>
        <Route path="/" element={<Navigate to="/supplier/dashboard" replace />} />
        <Route path="/dashboard" element={<SupplierHome />} />
        <Route path="/uploads" element={<Uploads />} />
      </Routes>
    </Layout>
  );
};

export default SupplierDashboard;
