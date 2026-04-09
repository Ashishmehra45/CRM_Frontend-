const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://crm-back-end-q15d.onrender.com/api";
   

export const API_URL = BASE_URL;