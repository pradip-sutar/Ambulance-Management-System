import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- REGISTER ----------------
export const registerUser = async (data) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

// ---------------- LOGIN ----------------
export const loginUser = async (data) => {
  const res = await API.post("/users/login", data);
  return res.data;
};