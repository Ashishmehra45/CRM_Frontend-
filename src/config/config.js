
const isLocal = window.location.hostname === "localhost";


const BASE_URL = isLocal 
    ? "http://localhost:5000/api" 
    : "https://crm-back-end-q15d.onrender.com/api"; 

export const API_URL = BASE_URL;