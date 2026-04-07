import React from "react";
import { Search, Bell, User, LogOut } from 'lucide-react';

function Header() {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-200 shadow-sm">
      
      {/* Left Section: Search Bar */}
      <div className="relative ml-70     w-full max-w-md group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Search leads, investors or markets..."
          className="w-full bg-slate-100/50 pl-10 pr-4 py-2.5 rounded-xl outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
        />
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Notification Bell */}
        <div className="relative group cursor-pointer p-2 hover:bg-slate-100 rounded-xl transition-all">
          <Bell
            size={20}
            className="text-slate-600 group-hover:text-blue-600"
          />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-2 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
              Ashish Mehra
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              System Admin
            </p>
          </div>

          {/* Avatar with Status */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-100 border-2 border-white transition-transform group-hover:scale-105">
              AM
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </div>

        {/* Optional: Logout Button in Header */}
        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;