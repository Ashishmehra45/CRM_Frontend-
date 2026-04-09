import React, { useState } from "react";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../config/config";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { token } = useParams(); // URL se token nikalne ke liye
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long!");
    }

    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/forgot/reset-password/${token}`, { password });
      
      if (res.data.success) {
        toast.success("Password updated successfully!");
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired token!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        <div className="bg-[#031942] p-12 text-center relative">
          <h2 className="text-4xl font-black text-white tracking-tighter italic">
            IM<span className="text-blue-200">GLOBAL</span>
          </h2>
          <p className="text-blue-100 text-xs mt-2 font-bold uppercase tracking-widest">
            Create New Password
          </p>
        </div>

        <div className="p-10">
          {!isSuccess ? (
            <form onSubmit={handleReset} className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" required placeholder="Enter new password"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" required placeholder="Confirm new password"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#072151] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-70">
                {loading ? "Updating..." : "Save Password"} <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className="text-center animate-in zoom-in duration-500">
              <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Password Reset Successful!</h3>
              <p className="text-sm text-slate-500 mb-6">You will be redirected to the login page.</p>
              <Link to="/login" className="text-blue-600 font-bold hover:underline">Click here if not redirected</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;