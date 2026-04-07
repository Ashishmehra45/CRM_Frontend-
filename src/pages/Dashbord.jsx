import React, { useState } from "react";
import {
  Search,
  Bell,
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
  Folder, // New icon for Categories
  ChevronDown, // New icon for dropdown open
  ChevronRight, // New icon for dropdown closed
} from "lucide-react";

const FDIDashboard = () => {
  const [activeTab, setActiveTab] = useState("add-lead");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // New state for Dropdown
  const [formData, setFormData] = useState({});

  // 1. Continents Array (Antarctica excluded)
  const continents = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "Oceania",
    "South America",
  ];

  // 2. Countries Array (195+ Countries list)
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

  const subCategories = ["FDI", "CDP", "National PMU", "Repnsonate"];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen shadow-2xl z-50 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-extrabold tracking-tighter text-blue-400">
            IM<span className="text-white">GLOBAL</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
            CRM
          </p>
        </div>

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
            {
              id: "countries",
              icon: <Globe size={20} />,
              label: "Foreign Markets",
            },
            {
              id: "companies",
              icon: <Building2 size={20} />,
              label: "Enterprises",
            },
            {
              id: "reports",
              icon: <BarChart3 size={20} />,
              label: "Investment Analytics",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
          <div className="pt-2">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isCategoryOpen
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <Folder
                  size={20}
                  className={isCategoryOpen ? "text-blue-400" : ""}
                />
                <span className="font-medium">Categories</span>
              </div>
              {isCategoryOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {/* Sub-categories List */}
            {isCategoryOpen && (
              <div className="mt-2 ml-5 pl-4 border-l border-slate-700 space-y-1">
                {subCategories.map((subItem) => {
                  const subId = subItem.toLowerCase();
                  return (
                    <button
                      key={subId}
                      onClick={() => setActiveTab(subId)}
                      className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === subId
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {subItem}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800 mt-4">
          <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-72 p-10 bg-[#f8fafc] min-h-screen font-sans">
        {/* --- TOP HEADER --- */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Create Lead
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Enter new investor details into the system.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
              Cancel
            </button>
            <button className="px-8 py-2.5 bg-[#0f62fe] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95">
              Save Lead
            </button>
          </div>
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
                    type="text"
                    placeholder="Enter company name"
                    className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* 2. CONTINENT */}
                <div className="flex items-center gap-6">
                  <label className="w-64 text-sm font-medium text-slate-600">
                    Continent
                  </label>
                  <select className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
                    <option value="">-None-</option>
                    {continents.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. COUNTRY / REGION */}
                <div className="flex items-center gap-6">
                  <label className="w-64 text-sm font-medium text-slate-600">
                    Country / Region
                  </label>
                  <select className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
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
                    type="text"
                    className="flex-1 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* 9. COORDINATES */}
                <div className="flex items-center gap-6">
                  <label className="w-64 text-sm font-medium text-slate-600">
                    Coordinates
                  </label>
                  <div className="flex flex-1 gap-4">
                    <input
                      type="text"
                      placeholder="Latitude"
                      className="w-1/2 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Longitude"
                      className="w-1/2 p-2.5 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
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
                      Lead Owner
                    </label>
                    <input
                      type="text"
                      value="Ashish Mehra"
                      disabled
                      className="flex-1 p-2.5 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="-None-"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Title
                    </label>
                    <input
                      type="text"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Mobile
                    </label>
                    <input
                      type="text"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Lead Source
                    </label>
                    <select className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
                      <option>-None-</option>
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
                    <select className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
                      <option>-None-</option>
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
                      type="text"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Email
                    </label>
                    <input
                      type="email"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Fax
                    </label>
                    <input
                      type="text"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Website
                    </label>
                    <input
                      type="text"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Lead Status
                    </label>
                    <select className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
                      <option>-None-</option>
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
                      type="text"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Rating
                    </label>
                    <select className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
                      <option>-None-</option>
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
                      type="text"
                      className="flex-1 p-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-sm font-medium text-slate-600">
                      Secondary Email
                    </label>
                    <input
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
                  Description Information
                </h3>
              </div>
              <textarea
                rows="4"
                className="w-full p-4 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none bg-slate-50 hover:bg-white"
                placeholder="Enter additional information..."
              ></textarea>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
};

export default FDIDashboard;
