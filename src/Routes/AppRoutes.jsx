import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashbord'
import Header from '../components/Header'
import Register from '../pages/Register'
import Login from '../pages/Login'

function AppRoutes() {
  return (
    /* ml-72: Sidebar ke liye 18rem ka gap chhodega.
      h-screen: Poori screen ki height lega.
      overflow-y-auto: Taki scroll sirf is area mein chale.
    */
    <div className="flex-1  h-screen overflow-y-auto bg-[#f8fafc] flex flex-col">
      
      {/* Global Header: Ab ye Sidebar ke side se start hoga aur hamesha top par rahega */}
      <Header />

      {/* Page Content: Dashboard aur baaki pages yahan render honge */}
      <main className="p-8 flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      
    </div>
  )
}

export default AppRoutes