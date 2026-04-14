import React, { useState } from "react";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react"; // ArrowLeft add kiya hai
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config/config";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 NEW: Forgot Password States
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/workers/login`, formData);

      if (res.data.success) {
        const token = res.data.token;

        // ✅ JWT decode karke expiry nikaalo
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = payload.exp * 1000;

        // ✅ Store everything
        localStorage.setItem("token", token);
        localStorage.setItem("expiry", expiryTime);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Toast clean + show
        toast.dismiss();
        toast.success(`Welcome ${res.data.user.fullName}! Redirecting...`);

        // ✅ Redirect
        setTimeout(() => {
          if (res.data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Invalid Credentials!");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Forgot Password API Call
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error("Please enter your email!");

    setLoading(true);
    try {
      // Ye API backend me banani padegi
      const res = await axios.post(`${API_URL}/forgot/forgot-password`, {
        email: forgotEmail,
      });
      if (res.data.success) {
        toast.success("Password reset link sent. Check inbox/spam.");
        setIsForgotView(false); // Link bhejne ke baad wapas login dikhao
        setForgotEmail("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        <div className="bg-[#031942] p-12 text-center relative">
          <h2 className="text-4xl font-black text-white tracking-tighter italic">
            IM<span className="text-blue-200">GLOBAL</span>
          </h2>
          <p className="text-blue-100 text-xs mt-2 font-bold uppercase tracking-widest">
            {isForgotView ? "Password Recovery" : "Authorized Personnel Only"}
          </p>
        </div>

        <div className="p-10">
          {/* ================================================= */}
          {/* LOGIN VIEW */}
          {/* ================================================= */}
          {!isForgotView ? (
            <form
              onSubmit={handleLogin}
              className="space-y-6 animate-in fade-in slide-in-from-left-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Password
                  </label>
                  {/* 🔥 FORGOT PASSWORD LINK */}
                  <button
                    type="button"
                    onClick={() => setIsForgotView(true)}
                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#072151] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Sign In Account"}{" "}
                <ArrowRight size={18} />
              </button>

              <p className="text-center text-sm text-slate-500 font-medium">
                New worker?{" "}
                <Link
                  to="/register"
                  className="text-[#0f62fe] font-bold hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </form>
          ) : (
            /* ================================================= */
            /* FORGOT PASSWORD VIEW */
            /* ================================================= */
            <form
              onSubmit={handleForgotPassword}
              className="space-y-6 animate-in fade-in slide-in-from-right-4"
            >
              <p className="text-sm text-slate-500 font-medium text-center mb-4">
                Enter your registered email address and we'll send you a link to
                reset your password.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={forgotEmail}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Reset Link"} <Mail size={18} />
              </button>

              <button
                type="button"
                onClick={() => setIsForgotView(false)}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 font-bold hover:text-slate-800 transition-colors mt-2"
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
