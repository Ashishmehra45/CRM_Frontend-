import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../config/config";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend API Call (Check kar lena server 5000 pe chal raha hai ya nahi)
      const res = await axios.post(`${API_URL}/workers/register`, formData);
      
      if (res.data) {
        toast.success("Worker Account Created! Redirecting to Login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-[#031840] p-12 text-center relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">
            IM<span className="text-blue-200">GLOBAL</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-blue-100 text-xs font-bold uppercase tracking-[0.2em]">
             <ShieldCheck size={14} /> CRM Portal
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-10 space-y-5">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                placeholder="Enter your name"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Official Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                placeholder="worker@imglobal.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#03183f] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register Now"} <ArrowRight size={18} />
          </button>

          <div className="pt-4 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already a worker? 
              <Link to="/login" className="text-[#0f62fe] font-bold ml-1 hover:underline underline-offset-4">
                Login Here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;