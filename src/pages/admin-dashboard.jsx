import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Activity,
  LogOut,
  LayoutDashboard,
  Layers,
  UserPlus,
  FileText,
  Search,
  RefreshCw,
  X,
  Clock,
  MessageSquare,
  Sparkles,
  Send,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { API_URL } from "../config/config";
import toast, { Toaster } from "react-hot-toast";

const AdminDashboard = () => {
  const [data, setData] = useState({ totalLeads: 0, workerBreakdown: [] });
  const [leadsData, setLeadsData] = useState([]);
  const [fetchingLeads, setFetchingLeads] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Tabs: 'overview', 'team', 'leads', 'view-lead'
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // States for Timeline and Detail View
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // For Timeline
  const [selectedLeadForView, setSelectedLeadForView] = useState({}); // For Full Page View
  const [newNote, setNewNote] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/admin-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      toast.error("Stats sync failed!");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeads = async () => {
    setFetchingLeads(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/get-all-leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setLeadsData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch leads from database!");
    } finally {
      setFetchingLeads(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "leads") {
      fetchAllLeads();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Admin Logout Successful!");
    setTimeout(() => navigate("/login"), 1000);
  };

  const handleAddAdminNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/admin/add-note/${selectedLead._id}`,
        {
          note: newNote,
          addedBy: "Admin",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("Official Note added successfully!");
        setNewNote("");
        setSelectedLead((prev) => ({
          ...prev,
          timeline: res.data.timeline,
        }));
        fetchAllLeads();
      }
    } catch (err) {
      toast.error("Note save nahi hua bhai!");
    }
  };

  // Pehle se mojud states ke niche ye add kar:
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [adminFormData, setAdminFormData] = useState({});

  // Edit handler function (Worker dashboard jaisa hi hai)
  const handleAdminUpdateLead = async (e) => {
    e.preventDefault();
    if (!adminFormData._id) return toast.error("Lead ID missing!");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/workers/update-lead/${adminFormData._id}`,
        adminFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        toast.success("Lead updated by Admin!");
        setIsAdminEditMode(false);
        setSelectedLeadForView(res.data.lead); // UI refresh
        fetchAllLeads(); // Table refresh
      }
    } catch (err) {
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // Input change handler
  const handleAdminInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdminFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredWorkers = data.workerBreakdown.filter((worker) =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredLeads = leadsData.filter(
    (lead) =>
      lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.workerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 relative">
      <Toaster position="top-right" />

      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-[#0F172A] text-slate-300 flex flex-col fixed left-0 top-0 h-screen shadow-2xl z-50">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Layers size={22} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              IM<span className="text-blue-500">GLOBAL</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] ml-1">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <label className="text-[10px] font-bold text-slate-600 uppercase ml-4 mb-2 block tracking-widest text-opacity-50">
            Main Menu
          </label>
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === "overview" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-white/5"}`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === "team" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-white/5"}`}
          >
            <Users size={18} /> Team Members
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === "leads" || activeTab === "view-lead" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-white/5"}`}
          >
            <Briefcase size={18} /> Leads Pipeline
          </button>
        </nav>

        <div className="p-8 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-sm group"
          >
            <LogOut
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />{" "}
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-80 p-12 transition-all duration-500">
        {/* =========================================
            TAB 1 & 2: OVERVIEW & TEAM 
            ========================================= */}
        {(activeTab === "overview" || activeTab === "team") && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Same Code As Before for Overview & Team */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {activeTab === "overview"
                    ? "Performance Analytics"
                    : "Team Management"}
                </h1>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <Activity size={16} className="text-green-500" /> Real-time
                  tracking active
                </p>
              </div>
              <button
                onClick={fetchStats}
                className="group flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:border-blue-500 transition-all shadow-sm"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />{" "}
                Sync Database
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group cursor-pointer"
                onClick={() => setActiveTab("leads")}
              >
                <FileText size={28} className="text-blue-600 mb-6" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Total System Leads
                </p>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                  {data.totalLeads}
                </h3>
              </div>
              <div
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group cursor-pointer"
                onClick={() => setActiveTab("team")}
              >
                <UserPlus size={28} className="text-indigo-600 mb-6" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  Active Team
                </p>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                  {data.workerBreakdown.length}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
              <div className="p-10 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  Worker Details
                </h2>
                <div className="relative w-full max-w-sm">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Find a member..."
                    className="w-full bg-white pl-12 pr-6 py-4 rounded-2xl text-sm border border-slate-200 outline-none font-bold shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-8 py-4">Personnel</th>
                      <th className="px-6 py-4 text-center">Efficiency</th>
                      {activeTab === "overview" && (
                        <>
                          <th className="px-6 py-4 text-center">FDI</th>
                          <th className="px-6 py-4 text-center">CIP</th>
                          <th className="px-6 py-4 text-center">Nat. PMU</th>
                          <th className="px-6 py-4 text-center">Rep.</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkers.map((worker, idx) => (
                      <tr
                        key={idx}
                        className="group bg-white hover:bg-blue-50/50 transition-all shadow-sm"
                      >
                        <td className="px-8 py-6 rounded-l-3xl border-y border-l border-slate-50">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center font-black uppercase shadow-inner">
                              {worker.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-lg leading-none mb-1 uppercase">
                                {worker.name}
                              </p>
                              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                                Authorized
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center border-y border-slate-50">
                          <span className="px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-sm">
                            {worker.total || 0} Leads
                          </span>
                        </td>
                        {activeTab === "overview" && (
                          <>
                            <td className="px-6 py-6 text-center border-y border-slate-50 font-black">
                              {worker.fdi || 0}
                            </td>
                            <td className="px-6 py-6 text-center border-y border-slate-50 font-black">
                              {worker.cip || 0}
                            </td>
                            <td className="px-6 py-6 text-center border-y border-slate-50 font-black">
                              {worker.pmu || 0}
                            </td>
                            <td className="px-6 py-6 rounded-r-3xl text-center border-y border-r border-slate-50 font-black">
                              {worker.representation || 0}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 3: LEADS PIPELINE TABLE
            ========================================= */}
        {activeTab === "leads" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
                  Lead <span className="text-blue-600">Surveillance</span>
                </h1>
                <p className="text-slate-500 font-medium italic">
                  Track every move made by workers on leads.
                </p>
              </div>
              <div className="relative w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by Company or Name..."
                  className="w-full bg-white pl-12 pr-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-6">Lead Entity</th>
                    <th className="px-6 py-6">Contact Person</th>
                    <th className="px-6 py-6 text-center">Category</th>
                    <th className="px-6 py-6">Handler (Worker)</th>
                    <th className="px-6 py-6 text-right">Access Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fetchingLeads ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-20 text-center text-blue-600 font-bold"
                      >
                        <RefreshCw className="animate-spin inline mr-2" />{" "}
                        Fetching Database...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-20 text-center text-slate-400 font-bold"
                      >
                        No leads found in database.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, idx) => (
                      // 🔥 YAHAN ROW CLICK PAR FULL DETAILS PAGE KHULEGA
                      <tr
                        key={idx}
                        onClick={() => {
                          setSelectedLeadForView(lead);
                          setActiveTab("view-lead");
                        }}
                        className="hover:bg-blue-50/30 cursor-pointer transition-all group"
                      >
                        <td className="px-10 py-6">
                          <p className="font-black text-slate-800 text-lg uppercase leading-none mb-1">
                            {lead.companyName || "N/A"}
                          </p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                            {lead.country || "N/A"}
                          </p>
                        </td>
                        <td className="px-6 py-6">
                          <span className="font-bold text-slate-700">
                            {lead.firstName} {lead.lastName}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {lead.category || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black uppercase">
                              {lead.workerName?.charAt(0) || "W"}
                            </div>
                            <span className="font-bold text-slate-700 text-sm uppercase">
                              {lead.workerName || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // 🔥 Row click ko rokne ke liye
                              setSelectedLead(lead);
                              setIsTimelineOpen(true);
                            }}
                            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95 font-bold text-xs flex items-center gap-2 ml-auto"
                          >
                            <Clock size={14} /> Timeline
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================
            🔥 TAB 4: VIEW FULL LEAD DETAILS (READ ONLY)
            (EXACT COPY OF WORKER FORM BUT DISABLED)
            ========================================= */}
        {activeTab === "view-lead" && (
          <div className="animate-in fade-in duration-500 pb-10">
            {/* --- TOP HEADER --- */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  {isAdminEditMode ? "Edit Lead Details" : "Lead Information"}
                </h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  {isAdminEditMode
                    ? "You are editing this lead as Administrator"
                    : `Viewing details for ${selectedLeadForView.companyName}`}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsAdminEditMode(false);
                    setActiveTab("leads");
                  }}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back to Pipeline
                </button>

                {/* 🔥 ADMIN EDIT/SAVE TOGGLE BUTTONS */}
                {!isAdminEditMode ? (
                  <button
                    onClick={() => {
                      setAdminFormData(selectedLeadForView); // Data populate karo edit form mein
                      setIsAdminEditMode(true);
                    }}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                  >
                    Edit Lead
                  </button>
                ) : (
                  <button
                    onClick={handleAdminUpdateLead}
                    className="px-8 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            {/* --- DYNAMIC FORM --- */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <form className="p-10 space-y-12">
                {/* --- SECTION 1: ADDRESS INFORMATION --- */}
                <section className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-3">
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Address Information
                    </h3>
                  </div>

                  <div className="max-w-3xl space-y-5 ml-4">
                    {[
                      { label: "Company Name", name: "companyName" },
                      { label: "Continent", name: "continent" },
                      { label: "Country / Region", name: "country" },
                      {
                        label: "Flat / House No. / Building",
                        name: "flatHouseNo",
                      },
                      { label: "Street Address", name: "streetAddress" },
                      { label: "City", name: "city" },
                      { label: "State / Province", name: "state" },
                      { label: "Zip / Postal Code", name: "zipCode" },
                    ].map((field) => (
                      <div key={field.name} className="flex items-center gap-6">
                        <label className="w-64 text-sm font-bold text-slate-500">
                          {field.label}
                        </label>
                        <input
                          name={field.name}
                          readOnly={!isAdminEditMode}
                          value={
                            isAdminEditMode
                              ? adminFormData[field.name] || ""
                              : selectedLeadForView[field.name] || "-"
                          }
                          onChange={handleAdminInputChange}
                          type="text"
                          className={`flex-1 p-2.5 rounded-md text-sm font-semibold outline-none transition-all ${
                            isAdminEditMode
                              ? "bg-white border border-blue-500 shadow-sm ring-2 ring-blue-50"
                              : "bg-slate-50 border-transparent cursor-not-allowed text-slate-700"
                          }`}
                        />
                      </div>
                    ))}

                    {/* Special case for Coordinates (Lat/Long) */}
                    <div className="flex items-center gap-6">
                      <label className="w-64 text-sm font-bold text-slate-500">
                        Coordinates
                      </label>
                      <div className="flex flex-1 gap-4">
                        <input
                          name="latitude"
                          readOnly={!isAdminEditMode}
                          value={
                            isAdminEditMode
                              ? adminFormData.latitude || ""
                              : selectedLeadForView.latitude || "-"
                          }
                          onChange={handleAdminInputChange}
                          type="text"
                          placeholder="Latitude"
                          className={`w-1/2 p-2.5 rounded-md text-sm font-semibold outline-none transition-all ${isAdminEditMode ? "bg-white border border-blue-500 shadow-sm ring-2 ring-blue-50" : "bg-slate-50 border-transparent cursor-not-allowed text-slate-700"}`}
                        />
                        <input
                          name="longitude"
                          readOnly={!isAdminEditMode}
                          value={
                            isAdminEditMode
                              ? adminFormData.longitude || ""
                              : selectedLeadForView.longitude || "-"
                          }
                          onChange={handleAdminInputChange}
                          type="text"
                          placeholder="Longitude"
                          className={`w-1/2 p-2.5 rounded-md text-sm font-semibold outline-none transition-all ${isAdminEditMode ? "bg-white border border-blue-500 shadow-sm ring-2 ring-blue-50" : "bg-slate-50 border-transparent cursor-not-allowed text-slate-700"}`}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* --- SECTION 2: LEAD INFORMATION --- */}
                <section>
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-3">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Lead Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-5">
                    {/* Left & Right columns managed via map for cleaner code */}
                    {[
                      { label: "First Name", name: "firstName" },
                      { label: "Last Name", name: "lastName" },
                      { label: "Title", name: "title" },
                      { label: "Phone", name: "phone" },
                      { label: "Mobile", name: "mobile" },
                      { label: "Email", name: "email", type: "email" },
                      { label: "Website", name: "website" },
                      { label: "Industry", name: "industry" },
                      { label: "Annual Revenue", name: "annualRevenue" },
                      { label: "Lead Status", name: "leadStatus" },
                      { label: "No. of Employees", name: "noOfEmployees" },
                      { label: "Lead Source", name: "leadSource" },
                      { label: "Rating", name: "rating" },
                      { label: "Category", name: "category" },
                    ].map((field) => (
                      <div key={field.name} className="flex items-center gap-4">
                        <label className="w-48 text-sm font-bold text-slate-500">
                          {field.label}
                        </label>
                        <input
                          name={field.name}
                          readOnly={!isAdminEditMode}
                          value={
                            isAdminEditMode
                              ? adminFormData[field.name] || ""
                              : selectedLeadForView[field.name] || "-"
                          }
                          onChange={handleAdminInputChange}
                          type={field.type || "text"}
                          className={`flex-1 p-2.5 rounded-md text-sm font-semibold outline-none transition-all ${
                            isAdminEditMode
                              ? "bg-white border border-blue-500 shadow-sm ring-2 ring-blue-50"
                              : "bg-slate-50 border-transparent cursor-not-allowed text-slate-700"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* --- SECTION 3: DESCRIPTION INFORMATION --- */}
                <section>
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                    <div className="w-1.5 h-5 bg-slate-400 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      Description Information
                    </h3>
                  </div>
                  <textarea
                    name="description"
                    readOnly={!isAdminEditMode}
                    value={
                      isAdminEditMode
                        ? adminFormData.description || ""
                        : selectedLeadForView.description ||
                          "No description provided."
                    }
                    onChange={handleAdminInputChange}
                    rows="4"
                    className={`w-full p-4 rounded-lg text-sm font-medium outline-none transition-all resize-none ${
                      isAdminEditMode
                        ? "bg-white border border-blue-500 shadow-inner ring-2 ring-blue-50"
                        : "bg-slate-50 border-transparent cursor-not-allowed text-slate-700"
                    }`}
                  ></textarea>
                </section>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================
          🔥 TIMELINE SLIDE-OVER DRAWER (ADMIN)
          ================================================== */}
      {isTimelineOpen && selectedLead && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/20 backdrop-blur-[1px] transition-all">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  {selectedLead.companyName}
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                  <User size={14} /> {selectedLead.firstName}{" "}
                  {selectedLead.lastName}
                </p>
              </div>
              <button
                onClick={() => setIsTimelineOpen(false)}
                className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors shadow-sm border border-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock size={14} /> Activity History
              </h3>

              {!selectedLead.timeline || selectedLead.timeline.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare
                    size={32}
                    className="mx-auto text-slate-300 mb-3"
                  />
                  <p className="text-sm text-slate-500">
                    No activity recorded yet.
                  </p>
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                  {selectedLead.timeline.map((item, index) => {
                    const isAdminNote =
                      item.type === "admin_instruction" ||
                      item.addedBy?.includes("Admin");
                    return (
                      <div key={index} className="relative pl-6">
                        <div
                          className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isAdminNote ? "bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-blue-100 border-blue-500"}`}
                        >
                          {isAdminNote && (
                            <Sparkles size={8} className="text-white" />
                          )}
                        </div>
                        <div
                          className={`p-4 rounded-2xl shadow-sm border ${isAdminNote ? "bg-blue-50/50 border-blue-200" : "bg-white border-slate-100"}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span
                              className={`text-xs font-bold ${isAdminNote ? "text-blue-700 flex items-center gap-1" : "text-slate-700"}`}
                            >
                              {isAdminNote && <Sparkles size={12} />}{" "}
                              {item.addedBy}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                              {new Date(
                                item.timestamp || item.createdAt,
                              ).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>
                          <p
                            className={`text-sm leading-relaxed whitespace-pre-wrap ${isAdminNote ? "text-blue-900 font-medium" : "text-slate-600"}`}
                          >
                            {item.note || item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgb(0,0,0,0.03)]">
              <form onSubmit={handleAddAdminNote} className="relative">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write an official admin instruction..."
                  rows="3"
                  className="w-full p-4 pr-14 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                ></textarea>
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="absolute right-3 bottom-4 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-200"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
