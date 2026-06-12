import axios from "axios";

const authStorageKey = "rentify_token";

const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");
const normalizedBaseURL = rawBaseURL.replace(/\/+$/, "");
const apiBaseURL = normalizedBaseURL.endsWith("/api")
  ? normalizedBaseURL
  : `${normalizedBaseURL}/api`;

const api = axios.create({
  baseURL: apiBaseURL,
});

export const syncAuthHeader = (token = localStorage.getItem(authStorageKey)) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }

  return token;
};

export const clearAuthHeader = () => {
  delete api.defaults.headers.common.Authorization;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(authStorageKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
