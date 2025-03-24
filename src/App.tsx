
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import DesignStudio from './pages/DesignStudio';
import Marketplace from './pages/Marketplace';
import ProducerProfile from './pages/ProducerProfile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
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
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        <Route path="/index" element={<Index />} />
        <Route path="/studio" element={<DesignStudio />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/producer/:id" element={<ProducerProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
