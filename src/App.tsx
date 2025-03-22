
import React from 'react';
import { Layout } from './components/Layout';
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
      <Layout />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
