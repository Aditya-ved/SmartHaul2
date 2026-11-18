
import axios from "axios";

const configuredApiUrl = (import.meta.env.API_URL || "").replace(/\/+$/, "");

const api = axios.create({
    baseURL: configuredApiUrl
        ? `${configuredApiUrl}/api`
        : "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("smarthaul_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
