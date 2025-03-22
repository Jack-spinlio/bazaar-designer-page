
import { useState } from 'react';
import { Layout } from './components/Layout';
import './App.css';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Layout />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
