import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ExhibitorProvider } from './contexts/ExhibitorContext.tsx'
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ExhibitorProvider>
        <App />
      </ExhibitorProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
