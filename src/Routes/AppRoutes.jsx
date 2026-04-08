import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashbord'
import Header from '../components/Header'
import Register from '../pages/Register'
import Login from '../pages/Login'
import AdminDashboard from '../pages/admin-dashboard'
import WelcomeLoader from '../components/WelcomeLoader' // 🔥 Naya loader import kiya

function AppRoutes() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2.5 second tak loader dikhayenge
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Agar loading true hai toh sirf Welcome Screen dikhao
  if (loading) {
    return <WelcomeLoader />;
  }

  return (
    /* ml-72: Sidebar ke liye gap (Ye dhyan rakhna ki AdminDashboard ke andar apna sidebar hai, 
      toh agar double gap aa raha ho toh 'ml-72' ko condition ke hisab se hatana pad sakta hai)
    */
    <div className="flex-1 h-screen overflow-y-auto bg-[#f8fafc] flex flex-col animate-in fade-in duration-1000">
      
      {/* Global Header */}
      <Header />

      {/* Page Content */}
      <main className="p-8 flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Dashboard Page */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      
    </div>
  )
}

export default AppRoutes