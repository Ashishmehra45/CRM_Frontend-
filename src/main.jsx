import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
console.log("MODE:", import.meta.env.MODE);
console.log("API:", import.meta.env.VITE_API_URL);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
    <App />
  </BrowserRouter>
)

