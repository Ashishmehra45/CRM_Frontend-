import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './Routes/AppRoutes'  
import axios from 'axios'; // 🔥 Axios import kiya
import toast, { Toaster } from 'react-hot-toast'; // 🔥 Toast import kiya

// ==========================================
// 🔥 GLOBAL AXIOS INTERCEPTOR (Chowkidaar)
// ==========================================
axios.interceptors.response.use(
  (response) => {
    // Agar sab sahi hai, toh response aage badhne do
    return response;
  },
  (error) => {
    // Agar backend se 401 ya 403 error aata hai (Token Expired)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // 1. LocalStorage saaf karo
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 2. Screen par error message dikhao
      toast.error("Session expired! Please login again.");

      // 3. User ko Login page par bhej do
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
// ==========================================

function App() {
  return (
    <div>
      {/* 🔥 Toaster lagana zaroori hai taaki error message screen par pop-up ho */}
      <Toaster position="top-right" /> 
      <AppRoutes />
    </div>
  )
}

export default App