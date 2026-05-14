import axios from "axios";

const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  "https://rentify-backend-kf5o.onrender.com";
const normalizedBaseURL = rawBaseURL.replace(/\/+$/, "");
const apiBaseURL = normalizedBaseURL.endsWith("/api")
  ? normalizedBaseURL
  : `${normalizedBaseURL}/api`;

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rentify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
