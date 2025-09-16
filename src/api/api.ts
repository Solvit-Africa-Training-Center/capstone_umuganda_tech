import axios from "axios";

const api = axios.create({
  baseURL: "https://umuganda-tech-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
