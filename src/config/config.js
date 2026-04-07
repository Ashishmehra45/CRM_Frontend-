// window.location.hostname se check karo ki hum localhost pe hain ya nahi
const isLocal = window.location.hostname === "localhost";

// Agar local hai toh localhost wala URL, varna live server ki IP wala URL
const BASE_URL = isLocal 
    ? "http://localhost:5000/api" 
    : "https://crm-back-end-q15d.onrender.com/api"; // Yahan apni live IP daal dena bas

export const API_URL = BASE_URL;