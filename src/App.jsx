import React, { useEffect } from 'react'
import AppRoutes from './Routes/AppRoutes'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

// ==========================================
// 🔥 REQUEST INTERCEPTOR (Token bhejne ke liye)
// ==========================================
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// 🔥 RESPONSE INTERCEPTOR (Session expire handle)
// ==========================================
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      localStorage.clear();

      if (window.location.pathname !== "/login") {
        toast.error("Session expired! Please login again.");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================
// 🔥 APP COMPONENT
// ==========================================
function App() {

  // 🔥 Token expiry check (auto logout after 1h)
  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiry = localStorage.getItem("expiry");

      if (expiry && Date.now() > expiry) {
        localStorage.clear();
        window.location.href = "/login";
      }
    };

    // run on load
    checkTokenExpiry();

    // run every 1 min
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Toaster position="top-right" />
      <AppRoutes />
    </div>
  )
}

export default App;