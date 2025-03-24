
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import Edit from './pages/Edit';
import Prefabs from './pages/Prefabs';
import Components from './pages/Components';
import Saved from './pages/Saved';
import Timeline from './pages/Timeline';
import BOM from './pages/BOM';
import Uploads from './pages/Uploads';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Marketplace from './pages/Marketplace';
import ProducerProfile from './pages/ProducerProfile';
import DesignStudio from './pages/DesignStudio';
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
        <Route path="/edit" element={<Edit />} />
        <Route path="/prefabs" element={<Prefabs />} />
        <Route path="/components" element={<Components />} />
        <Route path="/bom" element={<BOM />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/producer/:id" element={<ProducerProfile />} />
        <Route path="/studio" element={<DesignStudio />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
