"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Try User Login first
      let res = await fetch("http://127.0.0.1:8000/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password,
        }),
      });

      let data = await res.json();

      // If User login fails, try Admin Login with phone
      if (!res.ok) {
        res = await fetch("http://127.0.0.1:8000/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: form.phone,           // Using phone for admin
            password: form.password,
          }),
        });
        data = await res.json();
      }

      // If still fails, try Driver Login (using phone as username)
      if (!res.ok) {
        res = await fetch("http://127.0.0.1:8000/auth/driver-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.phone,        // Driver uses username = phone
            password: form.password,
          }),
        });
        data = await res.json();
      }

      if (res.ok && data?.token) {
        localStorage.setItem("token", data.token);

        // Decode JWT to get role
        const payload = JSON.parse(atob(data.token.split(".")[1]));

        alert(`Login Successful as ${payload.role.toUpperCase()}`);

        // Redirect based on role
        switch (payload.role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "driver":
            router.push("/driver/dashboard");
            break;
          default:
            router.push("/"); // Normal User
        }
      } else {
        setError(data?.detail || "Invalid phone number or password");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2">Login</h2>
        <p className="text-gray-500 text-center mb-8">
          Enter your phone number and password
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Admin, Driver, and User can login here
        </p>
      </div>
    </div>
  );
}