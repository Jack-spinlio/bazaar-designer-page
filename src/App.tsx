import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DesignStudio from './pages/DesignStudio';
import Marketplace from './pages/Marketplace';
import ProducerProfile from './pages/ProducerProfile';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import SupplierPage from './pages/supplier/SupplierPage';
import Edit from './pages/Edit';
import Prefabs from './pages/Prefabs';
import './App.css';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import * as THREE from 'three';
import SupplierProfilePage from './pages/SupplierProfilePage';

declare global {
  interface Window {
    THREE: typeof THREE;
  }
}

function App() {
  if (import.meta.env.DEV) {
    window.THREE = THREE;
  }
  
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        <Route path="/design" element={<DesignStudio />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/prefabs" element={<Prefabs />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
        <Route path="/producer/:id" element={<ProducerProfile />} />
        
        <Route path="/supplier/:id" element={<SupplierProfilePage />} />
        
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/supplier/*" element={<SupplierPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SonnerToaster position="top-right" richColors closeButton />
      <Toaster />
    </div>
  );
}

export default App;
