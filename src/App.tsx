
import { useState } from 'react';
import { Layout } from './components/Layout';
import './App.css';
import { Toaster } from 'sonner';

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
