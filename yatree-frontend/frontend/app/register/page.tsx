"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    // VALIDATION
    if (!form.name || !form.email || !form.phone || !form.password) {
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/register", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMessage(data.detail || "Something went wrong.");
      }
    } catch {
      setMessage("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </h1>

        {/* NAME */}
        <input
          name="name"
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-3 rounded-lg w-full mb-4"
        />

        {/* EMAIL */}
        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="border p-3 rounded-lg w-full mb-4"
          type="email"
        />

        {/* PHONE */}
        <input
          name="phone"
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-3 rounded-lg w-full mb-4"
          type="text"
        />

        {/* PASSWORD */}
        <input
          name="password"
          onChange={handleChange}
          placeholder="Password"
          className="border p-3 rounded-lg w-full mb-4"
          type="password"
        />

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-blue-600 text-white w-full p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="text-center text-red-600 mt-3">{message}</p>
        )}

        {/* FOOTER */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
