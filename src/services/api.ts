import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ✅ Attach token to every request
API.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const token = JSON.parse(user).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle expired/invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or invalid
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // in case you store separately
      window.location.href = "/login"; // force redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;
