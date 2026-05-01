import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
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