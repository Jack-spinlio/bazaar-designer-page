
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DesignStudio from './pages/DesignStudio';
import Marketplace from './pages/Marketplace';
import ProducerProfile from './pages/ProducerProfile';
import ExhibitorProfile from './pages/ExhibitorProfile';
import ExhibitorListings from './pages/ExhibitorListings';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import SupplierPage from './pages/supplier/SupplierPage';
import Edit from './pages/Edit';
import Prefabs from './pages/Prefabs';
import './App.css';
import * as THREE from 'three';
import SupplierProfilePage from './pages/SupplierProfilePage';

declare global {
  interface Window {
    THREE: typeof THREE;
  }
}

// Simple debug component to help troubleshoot rendering issues
const DebugComponent: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Debug Page</h1>
      <p className="text-gray-700 mb-4">
        If you can see this message, React is rendering correctly.
        Check the console for any errors that might be preventing your routes from working.
      </p>
      <div className="mt-4 bg-gray-100 p-4 rounded">
        <p className="font-mono text-sm">Current URL: {window.location.href}</p>
      </div>
    </div>
  </div>
);

function App() {
  // Log rendering to help debug
  useEffect(() => {
    console.log('App component rendered');
  }, []);

  if (import.meta.env.DEV) {
    window.THREE = THREE;
  }
  
  return (
    <div className="w-screen h-screen overflow-y-auto">
      <Routes>
        {/* Debug route - temporary */}
        <Route path="/debug" element={<DebugComponent />} />
        
        {/* Default route */}
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        
        <Route path="/design" element={<DesignStudio />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/prefabs" element={<Prefabs />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
        <Route path="/producer/:id" element={<ProducerProfile />} />
        <Route path="/exhibitor/:slug" element={<ExhibitorProfile />} />
        <Route path="/supplier/:slug" element={<ExhibitorProfile />} />
        <Route path="/exhibitors" element={<ExhibitorListings />} />
        <Route path="/admin" element={<Admin />} />
        
        <Route path="/supplier/:id" element={<SupplierProfilePage />} />
        
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/supplier/*" element={<SupplierPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
