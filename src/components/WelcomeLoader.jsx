import React from "react";
import { ShieldCheck } from "lucide-react";
import logo from "../assets/im global.png"; // 🔥 Naya logo import kiya

const WelcomeLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F172A]">
      {/* Background Glow Effect */}
      <div className="absolute w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
      
      <div className="relative text-center space-y-8 animate-in fade-in zoom-in duration-700">
        {/* Floating Icon Wrapper */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
           
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-3">
          <img className="ml-[60px] mt-[-80px] h-50 w-50" src={logo} alt="IMGLOBAL Logo" />
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 bg-blue-500/30"></div>
            <p className="text-blue-200/50 font-black text-[10px] uppercase tracking-[0.5em]">
              CRM Portal Secure Access
            </p>
            <div className="h-[1px] w-8 bg-blue-500/30"></div>
          </div>
        </div>

        {/* High-End Progress Bar */}
        <div className="relative w-64 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-white/5"></div>
          <div className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 animate-[progress_2.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        </div>
      </div>

      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default WelcomeLoader;