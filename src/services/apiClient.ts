import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "../config/env";

const apiClient: AxiosInstance = axios.create({
  baseURL: env.BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.request && !error.response) {
      console.error("Network or connection error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
