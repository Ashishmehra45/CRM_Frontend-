import React, { useState, useEffect } from "react";
import { Search, Bell } from 'lucide-react';
import img from "../assets/im global.png";

function Header() {
  const [userData, setUserData] = useState({ fullName: "Guest User" });

  // 1. Data load karne ka common function
  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        setUserData({ fullName: "Guest User" });
      }
    } else {
      setUserData({ fullName: "Guest User" });
    }
  };

  useEffect(() => {
    // 2. Pehli baar load karo
    loadUserData();

    // 3. 🔥 MAGIC: Jab bhi localStorage badle, ye automatic chalega
    const handleStorageChange = () => {
      loadUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Safety interval
    const interval = setInterval(loadUserData, 1000); 

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getInitials = (name) => {
    if (!name || name === "Guest User") return "GU";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex flex-wrap justify-between items-center bg-white/70 backdrop-blur-xl px-4 md:px-10 py-3 md:py-5 border-b border-slate-200/60 shadow-sm gap-y-4">

      {/* --- Left Section (Logo) --- */}
      <div className="flex items-center">
        <img 
          className="h-8 md:h-12 w-auto bg-black p-1 rounded shadow-sm" 
          src={img} 
          alt="Global Logo" 
        />
      </div>

      {/* --- Middle Section (Search Bar) --- */}
      {/* Mobile pe ye niche aayega full width, Desktop pe center me */}
      <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-md relative group px-1 sm:px-4">
        <div className="absolute inset-y-0 left-4 sm:left-7 pl-1 flex items-center pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        </div>
        <input
          type="text"
          placeholder="Quick search leads..."
          className="w-full bg-slate-100/50 pl-11 pr-4 py-2.5 rounded-2xl outline-none border border-transparent focus:border-blue-500/40 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
        />
      </div>

      {/* --- Right Section (Bell & Profile) --- */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative group cursor-pointer p-2 md:p-2.5 hover:bg-slate-100 rounded-2xl transition-all">
          <Bell size={20} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
          <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-4 border-l border-slate-200/80 group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">
              {userData.fullName}
            </p>
            <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mt-1 ${userData.fullName === "Guest User" ? "text-slate-400" : "text-blue-600"}`}>
              {userData.fullName === "Guest User" ? "Offline" : "Active Now"}
            </p>
          </div>

          <div className="relative">
            <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl border-2 border-white transition-transform duration-300 group-hover:scale-105 ${userData.fullName === "Guest User" ? "bg-slate-400" : "bg-gradient-to-br from-blue-600 to-indigo-700"}`}>
              <span className="text-xs md:text-sm font-black uppercase tracking-wider">
                {getInitials(userData.fullName)}
              </span>
            </div>
            {userData.fullName !== "Guest User" && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            )}
          </div>
        </div>
      </div>
      
    </header>
  );
}

export default Header;