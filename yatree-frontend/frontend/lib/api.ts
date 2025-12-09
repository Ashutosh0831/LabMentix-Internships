import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: false,
});


api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;


export const login = (data: Record<string, unknown>) =>
  api.post("/auth/login", data);

export const register = (data: Record<string, unknown>) =>
  api.post("/auth/register", data);


export const createBooking = (data: Record<string, unknown>) =>
  api.post("/booking/create", data);

export const getUserBookings = () =>
  api.get("/booking/my");


export const getFare = (data: Record<string, unknown>) =>
  api.post("/fare/estimate", data);


export const getRideStatus = (params: Record<string, unknown>) =>
  api.get("/ride/status", { params });

export const updateRideStatus = (data: Record<string, unknown>) =>
  api.post("/ride/update", data);
