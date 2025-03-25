
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DesignStudio from './pages/DesignStudio';
import Marketplace from './pages/Marketplace';
import ProducerProfile from './pages/ProducerProfile';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import SupplierPage from './pages/supplier/SupplierPage';
import './App.css';
import { Toaster } from 'sonner';
import * as THREE from 'three';

// Augment the window interface to include THREE
declare global {
  interface Window {
    THREE: typeof THREE;
  }
}

function App() {
  // Enable THREE.js debugging
  if (import.meta.env.DEV) {
    window.THREE = THREE;
  }
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        <Route path="/design" element={<DesignStudio />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/producer/:id" element={<ProducerProfile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/supplier/*" element={<SupplierPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
