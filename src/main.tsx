
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error('Root element not found')

const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
