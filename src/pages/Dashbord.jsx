import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Ye zaroori hai
import imglogo from "../assets/im global.png"; // Logo ke liye image import karo
import {
  Edit2,
  Trash2,
  Search,
  Bell,
  Menu,
  Flame,
  Target,
  XCircle,
  Sparkles,
  LayoutDashboard,
  UserPlus,
  Globe,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Mail,
  Phone,
  MapPin,
  AlignLeft,
  User,
  DollarSign,
  Briefcase,
  Hash,
  Folder,
  ChevronDown,
  ChevronRight,
  X,
  MessageSquare,
  Clock,
  Send,
  Activity,
} from "lucide-react";
import { API_URL } from "../config/config"; // Apne config file se URL import karo
import { ArrowLeft } from 'lucide-react'; 



const FDIDashboard = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard"); // Default "dashboard" (Table) view
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  // NEW STATES FOR FETCHING LEADS
  const [leadsData, setLeadsData] = useState([]);
  const [fetching, setFetching] = useState(false);

  // Timeline States
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 2. Component ke andar apni existing Timeline states ke niche ye daal de
  const [noteLoading, setNoteLoading] = useState(false); // Double submit rokne ke liye
  const [editingNoteId, setEditingNoteId] = useState(null); // Edit mode track karne ke liye
  const [editNoteText, setEditNoteText] = useState("");

  const renderBackButton = () => (
    <button
      type="button" 
      onClick={(e) => {
        e.preventDefault(); 
        setActiveTab("dashboard"); // 🔥 Tere code me default tab "dashboard" hai, "overview" nahi!
      }} 
      className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group cursor-pointer focus:outline-none"
    >
      <span className="p-1.5 rounded-full bg-slate-100 group-hover:bg-blue-50 transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
      </span>
      Back to Dashboard
    </button>
  );

 const handleUpdateLead = async (e) => {
    e.preventDefault();

    // 1. Pehle check karo ki ID hai bhi ya nahi
    if (!formData._id) {
      console.error("❌ ERROR: Lead ID missing in formData!");
      return toast.error("Lead ID nahi mili, page refresh karke try karo.");
    }

    // 🔥 NEW LOGIC: Check karo ki data change hua bhi hai ya nahi?
    const isUnchanged = JSON.stringify(formData) === JSON.stringify(selectedLeadForEdit);
    
    if (isUnchanged) {
      // Agar kuch change nahi hua, toh API call mat karo aur wapas table pe bhej do (ya wahi rehne do)
      return toast("No update required. ", {
        icon: 'ℹ️', // Information icon
        style: {
          background: '#f8fafc',
          color: '#334155',
          border: '1px solid #cbd5e1'
        }
      });
    }

    setLoading(true);

    // 2. Exact URL jo hit ho rahi hai usko pehle hi check karlo
    const targetUrl = `${API_URL}/workers/update-lead/${formData._id}`;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token missing! ");

      const res = await axios.put(targetUrl, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Details updated successfully!");
        setIsEditMode(false);
        setFormData({}); // Form clear karo
        setSelectedLeadForEdit(null); // 🔥 State ko wapas khali kar do
        fetchLeads(activeTab); // Table refresh
       setActiveTab("dashboard"); 
        fetchLeads("dashboard"); //
      }
    } catch (err) {
      // 3. Detailed Error Logging
      console.error("❌ API Error Details:", err);
      toast.error(err.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // API Call: Add Timeline Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/workers/add-note/${selectedLead._id}`,
        { note: newNote },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("Note added successfully!");
        setNewNote("");

        setSelectedLead((prev) => ({
          ...prev, // Purani fields (Company, Name, etc.) bacha ke rakho
          timeline: res.data.timeline, // Sirf timeline update karo
        }));

        fetchLeads(activeTab);
      }
    } catch (err) {
      toast.error("Note save nahi hua bhai!");
    }
  };

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Worker",
  };
  const navigate = useNavigate(); // Navigation initialize karo

  const handleLogout = () => {
    // 1. Local storage khali karo
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔥 NAYI LINE: Purane saare toasts clear karo
    toast.dismiss();

    // 2. Sunder sa notification
    toast.success("Logged out successfully see you again!");

    // 3. Login page par bhej do
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // 🔥 UPDATE: Prevent double submit logic
  const handleaddNote = async (e) => {
    e?.preventDefault(); // ? isliye taki Enter key se call ho toh error na aaye
    if (!newNote.trim() || noteLoading) return; // Agar pehle se load ho raha hai toh ruk jao

    setNoteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/workers/add-note/${selectedLead._id}`,
        { note: newNote },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("Note added successfully!");
        setNewNote("");
        setSelectedLead((prev) => ({ ...prev, timeline: res.data.timeline }));
        fetchLeads(activeTab);
      }
    } catch (err) {
      toast.error("Note save nahi hua bhai!");
    } finally {
      setNoteLoading(false);
    }
  };

  // 🔥 NEW: Enter key se submit karne ka logic (Shift+Enter se new line aayegi)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleaddNote();
    }
  };

  // 🔥 NEW: Delete Note Function
  // 🔥 NEW: Delete Note Function with Custom Toast Alert
  const handleDeleteNote = (noteId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-slate-800">Delete this note?</p>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id); // Pehle toast hatao
                try {
                  const token = localStorage.getItem("token");
                  const res = await axios.delete(
                    `${API_URL}/workers/delete-note/${selectedLead._id}/${noteId}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    },
                  );

                  if (res.data.success) {
                    toast.success("Note deleted successfully!");
                    setSelectedLead((prev) => ({
                      ...prev,
                      timeline: res.data.timeline,
                    }));
                    fetchLeads(activeTab);
                  }
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Failed to delete note!",
                  );
                }
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Jab tak user action na le, ye toast gayab nahi hoga
        position: "top-center",
      },
    );
  };

  // 🔥 NEW: Edit Note Function
  const handleEditNoteSubmit = async (noteId) => {
    if (!editNoteText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      // Note: Backend me ye route banana padega
      const res = await axios.put(
        `${API_URL}/workers/edit-note/${selectedLead._id}/${noteId}`,
        { note: editNoteText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        toast.success("Note updated!");
        setEditingNoteId(null);
        setSelectedLead((prev) => ({ ...prev, timeline: res.data.timeline }));
        fetchLeads(activeTab);
      }
    } catch (err) {
      toast.error("Failed to update note!");
    }
  };
  // 🔥 NEW: Delete Lead Function with Custom Confirmation Toast
  const handleDeleteLead = (e) => {
    e.preventDefault();

    if (!formData._id) {
      return toast.error("Lead ID not found!");
    }

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-slate-800">
            Delete this entire lead?
          </p>
          <p className="text-xs text-slate-500">
            This action cannot be undone. All timeline notes will also be
            deleted.
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id); // Pehle toast hatao
                setLoading(true);
                try {
                  const token = localStorage.getItem("token");
                  // Backend call (Tera backend delete route)
                  const res = await axios.delete(
                    `${API_URL}/workers/delete-lead/${formData._id}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    },
                  );

                  if (res.data.success) {
                    toast.success("Lead deleted successfully!");
                    setIsEditMode(false);
                    setFormData({}); // Form clear
                    setActiveTab("dashboard"); // Wapas table pe bhejo
                    fetchLeads("dashboard"); // List refresh karo
                  }
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Failed to delete lead!",
                  );
                } finally {
                  setLoading(false);
                }
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Yes, Delete Lead
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
  };

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const subCategories = ["FDI", "CIP", "National PMU", "Representation"];

  // ==========================================
  // API CALL: FETCH LEADS
  // ==========================================
  const fetchLeads = async (currentTab) => {
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      let categoryQuery = "All";

      if (currentTab === "fdi") categoryQuery = "FDI";
      else if (currentTab === "cip") categoryQuery = "CIP";
      else if (currentTab === "national pmu") categoryQuery = "National PMU";
      else if (currentTab === "representation")
        categoryQuery = "Representation";

      const res = await axios.get(
        `${API_URL}/workers/get-leads?category=${categoryQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        setLeadsData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Leads are not fetching! Try again.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const tableViews = [
      "dashboard",
      "fdi",
      "cip",
      "national pmu",
      "representation",
    ];
    if (tableViews.includes(activeTab)) {
      fetchLeads(activeTab);
    }
  }, [activeTab]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Agar token nahi hai toh bhaga do
    }
  }, []);

  // ==========================================
  // API CALL: SAVE LEAD (Tere form ka code)
  // ==========================================
  // FDIDashboard.jsx mein handleInputChange ko aise update kar:
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 🔥 Debugging ke liye check kar data sahi aa raha hai ya nahi
    console.log(`Field Name: ${name}, Value: ${value}`);

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveLead = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.lastName) {
      return toast.error("Company Name and Last Name are required fields!");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API_URL}/workers/add-lead`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Lead Mast Save Ho Gayi!");
        setFormData({});
        setActiveTab("dashboard"); // Save hone ke baad table par bhej do
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Kuch lafda ho gaya backend mein!",
      );
    } finally {
      setLoading(false);
    }
  };

  const isTableView = [
    "dashboard",
    "fdi",
    "cip",
    "national pmu",
    "representation",
  ].includes(activeTab);

  let pageTitle = "All Leads Overview";
  if (activeTab !== "dashboard" && isTableView) {
    const catName = subCategories.find((c) => c.toLowerCase() === activeTab);
    pageTitle = `${catName} Leads`;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* <Toaster position="top-center" /> */}
      {/* --- SIDEBAR --- */}
      {/* 🔥 MOBILE HEADER (Sirf choti screen par dikhega) */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-[60] flex justify-between items-center px-6 py-4 shadow-md">
        <div className="flex items-center gap-2">
          <img className="h-8 w-8 object-contain" src={imglogo} alt="Logo" />
          <p className="text-xs font-extrabold text-slate-100 uppercase tracking-widest mt-1">
            CRM <span className="text-blue-500">Portal</span>
          </p>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🔥 SIDEBAR OVERLAY (Mobile ke liye jab menu khula ho) */}
      {isSidebarOpen && (
        <div
         
          className="fixed inset-0 bg-black/60 z-[40] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-[50] w-72 bg-slate-900 text-white flex flex-col h-screen shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Desktop Logo Area (Mobile pe hide kiya hai kyunki top header me hai) */}
        <div className="p-8 hidden md:block">
          <img
            className="h-20 w-20 mt-[-30px]"
            src={imglogo}
            alt="IMGLOBAL Logo"
          />
          <p className="text-xs font-extrabold mt-[-5px] ml-[10px] text-slate-100 uppercase tracking-widest">
            CRM <span className="text-blue-500">Portal</span>
          </p>
        </div>

        {/* Mobile Spacing */}
        <div className="h-20 md:hidden"></div>

        <nav className="flex-1 px-4 space-y-2">
          {/* Main Menu Items */}
          {[
            {
              id: "dashboard",
              icon: <LayoutDashboard size={20} />,
              label: "Overview",
            },
            {
              id: "add-lead",
              icon: <UserPlus size={20} />,
              label: "Add New Lead",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false); // Mobile pe click karne ke baad menu band ho jayega
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          {/* --- CATEGORIES DROPDOWN --- */}
          <div className="pt-2 space-y-1">
            {subCategories.map((subItem) => {
              const subId = subItem.toLowerCase();
              return (
                <button
                  key={subId}
                  onClick={() => {
                    setActiveTab(subId);
                    setIsSidebarOpen(false); // Click pe menu band
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === subId
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Folder
                    size={20}
                    className={
                      activeTab === subId ? "text-blue-200" : "text-slate-500"
                    }
                  />
                  <span className="font-medium">{subItem}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-72 p-10 bg-[#f8fafc] min-h-screen font-sans">
        {/* =========================================
            TAB 1: TABLE VIEW (OVERVIEW & CATEGORIES)
            ========================================= */}
        {isTableView && (
          <div className="animate-in fade-in duration-500">

           

            {/* --- TOP HEADER --- */}
            {renderBackButton()}

            <div className="flex justify-between items-center mb-8">
              
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  {pageTitle}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Viewing data for{" "}
                  {activeTab === "dashboard" ? "all categories" : pageTitle}.
                </p>
              </div>
              <button
                onClick={() => fetchLeads(activeTab)}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
              >
                <Activity size={16} className="text-blue-500" /> Refresh Data
              </button>
            </div>

            {/* --- STATS CARDS SECTION --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              {/* 1. Total Leads */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Total Leads
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">
                    {leadsData.length}
                  </h3>
                </div>
              </div>

              {/* 2. Contacted (Active) */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Contacted
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">
                    {
                      leadsData.filter((l) => l.leadStatus === "Contacted")
                        .length
                    }
                  </h3>
                </div>
              </div>

              {/* 3. Attempted to Contact */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Attempted
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">
                    {
                      leadsData.filter(
                        (l) => l.leadStatus === "Attempted to contact",
                      ).length
                    }
                  </h3>
                </div>
              </div>

              {/* 4. 🔥 Hot Leads */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <Flame size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Hot Leads
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">
                    {/* 🔥 FIX: Exact match for 'Hot Leads' ensuring no typo issues */}
                    {
                      leadsData.filter(
                        (l) =>
                          l.leadStatus === "Hot Leads" ||
                          l.leadStatus === "Hot Lead" ||
                          l.leadStatus === "Pre Qualified",
                      ).length
                    }
                  </h3>
                </div>
              </div>

              {/* 5. 🎯 Acquired */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Target size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Acquired
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">
                    {/* Rating me Acquired check ho raha hai */}
                    {
                      leadsData.filter(
                        (l) =>
                          l.rating === "Acquired" ||
                          l.leadStatus === "Acquired",
                      ).length
                    }
                  </h3>
                </div>
              </div>

              {/* 6. ❌ Lost Leads */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                  <XCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Lost Leads
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">
                    {
                      leadsData.filter((l) => l.leadStatus === "Lost Lead")
                        .length
                    }
                  </h3>
                </div>
              </div>
            </div>

            {/* --- TABLE SECTION --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="p-5">Company Name</th>
                      <th className="p-5">Contact Person</th>
                      <th className="p-5">Country</th>
                      <th className="p-5">Category</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetching ? (
                      <tr>
                        <td colSpan="6" className="p-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-medium">
                              Fetching leads...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : leadsData.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-20 text-center text-slate-400 font-medium"
                        >
                          No leads found for this category.
                        </td>
                      </tr>
                    ) : (
                      leadsData.map((lead) => (
                        <tr
                          key={lead._id}
                          onClick={() => {
                            setFormData(lead);
                            setSelectedLeadForEdit(lead); // 🔥 ADDED: Original data yahan save kar liya
                            setIsEditMode(true);
                            setActiveTab("add-lead");
                          }}
                          className="border-b border-slate-100 hover:bg-blue-50/50 cursor-pointer transition-colors group"
                        >
                          <td className="p-5 font-semibold text-slate-800">
                            {lead.companyName}
                          </td>
                          <td className="p-5 text-slate-600">
                            {lead.firstName} {lead.lastName}
                          </td>
                          <td className="p-5 text-slate-600">
                            {lead.country || "-"}
                          </td>
                          <td className="p-5">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] uppercase font-black tracking-wider rounded-full">
                              {lead.category || "None"}
                            </span>
                          </td>
                          <td className="p-4 md:p-5">
                            <span
                              className={`px-3 py-1 text-[10px] uppercase font-black tracking-wider rounded-full ${
                                lead.leadStatus === "Contacted"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : lead.leadStatus === "Lost Lead"
                                    ? "bg-red-100 text-red-700"
                                    : // 🔥 NAYE COLORS ADD KIYE HAIN:
                                      lead.leadStatus === "Hot Leads"
                                      ? "bg-orange-100 text-orange-700"
                                      : lead.leadStatus === "Acquired"
                                        ? "bg-purple-100 text-purple-700"
                                        : lead.leadStatus === "Junk Lead" ||
                                            lead.leadStatus === "Not Qualified"
                                          ? "bg-slate-200 text-slate-600"
                                          : "bg-amber-100 text-amber-700" // Default for Attempted, Pre Qualified, etc.
                              }`}
                            >
                              {lead.leadStatus || "New"}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(lead);
                                setIsTimelineOpen(true);
                              }}
                              className="px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold rounded-lg text-xs transition-all flex items-center gap-2 ml-auto shadow-sm"
                            >
                              <Activity size={14} /> Timeline
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 2: ADD NEW LEAD (FORM)
            ========================================= */}
        {activeTab === "add-lead" && (
          <div className="animate-in fade-in duration-500">
            {renderBackButton()}
            {/* --- TOP HEADER --- */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  {isEditMode ? "Edit Lead Details" : "Create Lead"}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  {isEditMode
                    ? `Updating information for ${formData.companyName || "this lead"}`
                    : "Enter new investor details into the system."}
                </p>
              </div>
              {/* Buttons yahan se hata diye gaye hain */}
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 overflow-hidden">
              <form className="p-10 space-y-12">
                {/* --- SECTION 1: ADDRESS INFORMATION --- */}
                <section className="bg-slate-50/50 p-8 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-3">
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                      Address Information
                    </h3>
                  </div>

                  <div className="max-w-3xl space-y-5 ml-4">
                    {/* 1. COMPANY NAME */}
                    <div className="flex items-center gap-6">
                      <label className="w-64 text-sm font-medium text-slate-600">
                        Company Name
                      </label>
                      <input
                        name="companyName"
                        value={formData.companyName || ""}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Enter company name"
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    {/* 3. COUNTRY / REGION */}
                    <div className="flex items-center gap-6">
                      <label className="w-64 text-sm font-medium text-slate-600">
                        Country / Region
                      </label>
                      <select
                        name="country"
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                      >
                        <option value="">-None-</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 4. FLAT / HOUSE NO. */}
                    <div className="flex items-start gap-6">
                      <label className="w-64 text-sm font-medium text-slate-600 pt-2 leading-tight">
                        Flat / House No. / Building / Apartment Name
                      </label>
                      <input
                        name="flatHouseNo"
                        value={formData.flatHouseNo || ""}
                        onChange={handleInputChange}
                        type="text"
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    {/* 5. STREET ADDRESS */}
                    <div className="flex items-center gap-6">
                      <label className="w-64 text-sm font-medium text-slate-600">
                        Street Address
                      </label>
                      <input
                        name="streetAddress"
                        value={formData.streetAddress || ""}
                        onChange={handleInputChange}
                        type="text"
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    {/* 6. CITY */}
                    <div className="flex items-center gap-6">
                      <label className="w-64 text-sm font-medium text-slate-600">
                        City
                      </label>
                      <input
                        name="city"
                        value={formData.city || ""}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Enter city"
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    {/* 7. STATE / PROVINCE */}
                    <div className="flex items-center gap-6">
                      <label className="w-64 text-sm font-medium text-slate-600">
                        State / Province
                      </label>
                      <input
                        name="state"
                        value={formData.state || ""}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Enter state or province"
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    {/* 8. ZIP / POSTAL CODE */}
                    <div className="flex items-center gap-6">
                      <label className="w-64 text-sm font-medium text-slate-600">
                        Zip / Postal Code
                      </label>
                      <input
                        name="zipCode"
                        value={formData.zipCode || ""}
                        onChange={handleInputChange}
                        type="text"
                        className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>

                   
                  </div>
                </section>

                {/* --- SECTION 2: LEAD INFORMATION --- */}
                <section>
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-3">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                      Lead Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-5">
                    {/* Left Column */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Title
                        </label>
                        <input
                          name="title"
                          value={formData.title || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          First Name
                        </label>
                        <input
                          name="firstName"
                          value={formData.firstName || ""}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="-None-"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Phone
                        </label>
                        <input
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Mobile
                        </label>
                        <input
                          name="mobile"
                          value={formData.mobile || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Lead Source
                        </label>
                        <select
                          name="leadSource"
                          value={formData.leadSource || ""}
                          onChange={handleInputChange}
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">-None-</option>
                          <option>Cold Call</option>
                          <option>Existing Customer</option>
                          <option>Self Generated</option>
                          <option>Employee Referral</option>
                          <option>External Referral</option>
                          <option>online store</option>
                          <option>Sales Email Alias</option>
                          <option>Seminar Partner</option>
                          <option>Internal Seminar</option>
                          <option>Chat</option>
                          <option>Partner</option>
                          <option>Public Relations</option>
                          <option>Web Download</option>
                          <option>Web Research</option>
                          <option>Facebook</option>
                          <option>Trade Show</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Industry
                        </label>
                        <select
                          name="industry"
                          value={formData.industry || ""}
                          onChange={handleInputChange}
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">-None-</option>
                          <option>ASP (Application Service Provider)</option>
                          <option>Data/Telecom OEM</option>
                          <option>ERP (Enterprise Resource Planning)</option>
                          <option>Government/Military</option>
                          <option>Large Enterprise</option>
                          <option>ManagementISV</option>
                          <option>MSP (Management Service Provider)</option>
                          <option>Network Equipment Enterprise</option>
                          <option>Non-management ISV</option>
                          <option>Optical Networking</option>
                          <option>Service Provider</option>
                          <option>Small/Medium Enterprise</option>
                          <option>Storage Equipment</option>
                          <option>Storage Service Provider</option>
                          <option>Systems Integrator</option>
                          <option>Wireless Industry</option>
                          <option>ERP</option>
                          <option>Management ISV</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-4 relative">
                        <div className="absolute -left-3 w-1 h-8 bg-red-500 rounded-r"></div>
                        <label className="w-48 text-sm font-medium text-slate-800">
                          Annual Revenue
                        </label>
                        <input
                          name="annualRevenue"
                          value={formData.annualRevenue || ""}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="Rs."
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Email Opt Out
                        </label>
                        <input
                          name="emailOptOut"
                          checked={formData.emailOptOut || false}
                          onChange={handleInputChange}
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category || ""}
                          onChange={handleInputChange}
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">-None-</option>
                          {subCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-4 relative">
                        <div className="absolute -left-3 w-1 h-8 bg-red-500 rounded-r"></div>
                        <label className="w-48 text-sm font-medium text-slate-800">
                          Company
                        </label>
                        <input
                          name="company"
                          value={formData.company || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4 relative">
                        <div className="absolute -left-3 w-1 h-8 bg-red-500 rounded-r"></div>
                        <label className="w-48 text-sm font-medium text-slate-800">
                          Last Name
                        </label>
                        <input
                          name="lastName"
                          value={formData.lastName || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Email
                        </label>
                        <input
                          name="email"
                          value={formData.email || ""}
                          onChange={handleInputChange}
                          type="email"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Fax
                        </label>
                        <input
                          name="fax"
                          value={formData.fax || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Website
                        </label>
                        <input
                          name="website"
                          value={formData.website || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Lead Status
                        </label>
                        <select
                          name="leadStatus"
                          value={formData.leadStatus || ""}
                          onChange={handleInputChange}
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">-None-</option>
                          <option>Acquired</option>
                          <option>Hot Leads</option>
                          <option>Attempted to contact</option>
                          <option>Contact in future</option>
                          <option>Contacted</option>
                          <option>Junk Lead</option>
                          <option>Lost Lead</option>
                          <option>Not Contacted</option>
                          <option>Pre Qualified</option>
                          <option>Not Qualified</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          No. of Employees
                        </label>
                        <input
                          name="noOfEmployees"
                          value={formData.noOfEmployees || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Rating
                        </label>
                        <select
                          name="rating"
                          value={formData.rating || ""}
                          onChange={handleInputChange}
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">-None-</option>
                          <option>Acquired</option>
                          <option>Active</option>
                          <option>Market Failed</option>
                          <option>Project Cancelled</option>
                          <option>Shutdown</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Skype ID
                        </label>
                        <input
                          name="skypeId"
                          value={formData.skypeId || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Secondary Email
                        </label>
                        <input
                          name="secondaryEmail"
                          value={formData.secondaryEmail || ""}
                          onChange={handleInputChange}
                          type="text"
                          className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-48 text-sm font-medium text-slate-600">
                          Twitter
                        </label>
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                            @
                          </span>
                          <input
                            name="twitter"
                            value={formData.twitter || ""}
                            onChange={handleInputChange}
                            type="text"
                            className="w-full p-2.5 pl-8 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* --- SECTION 3: DESCRIPTION INFORMATION --- */}
                <section>
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
                    <div className="w-1.5 h-5 bg-slate-400 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                      Description
                    </h3>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-4 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none bg-slate-50 hover:bg-white"
                    placeholder="Enter additional information..."
                  ></textarea>
                </section>

                {/* 🔥 ACTION BUTTONS (MOVED TO THE BOTTOM) 🔥 */}
                <div className="flex justify-end gap-4 pt-4 mt-8 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditMode(false);
                      setFormData({});
                      setActiveTab("dashboard");
                    }}
                    className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
                  >
                    Cancel
                  </button>

                  {/* --- DYNAMIC BUTTON (SAVE OR UPDATE/DELETE) --- */}
                  {isEditMode ? (
                    <div className="flex gap-4">
                      {/* 🔥 NEW: Delete Button */}
                      <button
                        type="button"
                        onClick={handleDeleteLead}
                        disabled={loading}
                        className="px-8 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all shadow-md shadow-red-200 active:scale-95 disabled:opacity-70"
                      >
                        Delete Lead
                      </button>

                      {/* Purana Update Button */}
                      <button
                        type="button"
                        onClick={handleUpdateLead}
                        disabled={loading}
                        className="px-8 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-all shadow-md shadow-orange-200 active:scale-95 disabled:opacity-70"
                      >
                        {loading ? "Updating..." : "Update Changes"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveLead}
                      disabled={loading}
                      className="px-8 py-2.5 bg-[#0f62fe] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95 disabled:opacity-70"
                    >
                      {loading ? "Saving..." : "Save Lead"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {isTimelineOpen && selectedLead && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/20 backdrop-blur-[1px] transition-all">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
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

              {/* Timeline List (Scrollable Area) */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Clock size={14} /> Activity History
                </h3>

                {!selectedLead.timeline ||
                selectedLead.timeline.length === 0 ? (
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
                      const isAdminInstruction =
                        item.type === "admin_instruction" ||
                        item.addedBy?.toLowerCase().includes("admin");

                      return (
                        <div
                          key={item._id || index}
                          className="relative pl-6 group"
                        >
                          <div
                            className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isAdminInstruction ? "bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] z-10" : "bg-blue-100 border-blue-500"}`}
                          >
                            {isAdminInstruction && (
                              <Sparkles size={8} className="text-white" />
                            )}
                          </div>

                          <div
                            className={`p-4 rounded-2xl shadow-sm border ${isAdminInstruction ? "bg-blue-50/50 border-blue-200" : "bg-white border-slate-100"}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span
                                className={`text-xs font-bold flex items-center gap-1 ${isAdminInstruction ? "text-blue-700" : "text-slate-700"}`}
                              >
                                {isAdminInstruction && (
                                  <Sparkles
                                    size={12}
                                    className="text-blue-600"
                                  />
                                )}
                                {isAdminInstruction ? " Ravi K Tiwari (Admin)" : item.addedBy}
                              </span>

                              <div className="flex items-center gap-3">
                                {/* 🔥 EDIT / DELETE BUTTONS (Hover on card to see) */}
                                {!isAdminInstruction && (
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingNoteId(item._id);
                                        setEditNoteText(item.note || item.text);
                                      }}
                                      className="text-blue-400 hover:text-blue-600 transition-colors"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNote(item._id)}
                                      className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                )}

                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                  {new Date(
                                    item.timestamp || item.createdAt,
                                  ).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* 🔥 TOGGLE BETWEEN TEXT AND EDIT INPUT */}
                            {editingNoteId === item._id ? (
                              <div className="mt-2 animate-in fade-in zoom-in-95 duration-200">
                                <textarea
                                  value={editNoteText}
                                  onChange={(e) =>
                                    setEditNoteText(e.target.value)
                                  }
                                  className="w-full p-3 bg-white border border-blue-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                  rows="3"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    onClick={() => setEditingNoteId(null)}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleEditNoteSubmit(item._id)
                                    }
                                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-200 transition-all"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p
                                className={`text-sm leading-relaxed whitespace-pre-wrap ${isAdminInstruction ? "text-blue-900 font-medium" : "text-slate-600"}`}
                              >
                                {item.note || item.text}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Note Input Area (Fixed at bottom) */}
              <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgb(0,0,0,0.03)]">
                {/* Enter key form submission */}
                <form onSubmit={handleAddNote} className="relative">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={handleKeyDown} // 🔥 NEW: Enter key listener
                    placeholder="Write an update... (Press Enter to send)"
                    rows="3"
                    className="w-full p-4 pr-14 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={!newNote.trim() || noteLoading} // 🔥 NEW: Disable during load
                    className="absolute right-3 bottom-4 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md shadow-blue-200"
                  >
                    {noteLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FDIDashboard;
