import React, { useState } from "react";
import axios from "axios";

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === "login" ? "login" : "register";

    try {
      const res = await axios.post(
        `http://localhost:3333/auth/${endpoint}`,
        form
      );
      const { token, dentist } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("dentistId", dentist._id);
      onAuth(dentist);
    } catch (err) {
      setError(
        mode === "login" ? "Invalid credentials." : "Email already registered."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed transition-all duration-500"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="w-full max-w-md p-8 bg-white/80 border border-gray-200 rounded-2xl shadow-2xl backdrop-blur-md ring ring-white/40 hover:scale-[1.01] transition-transform duration-300">
        <h2 className="text-3xl font-extrabold text-center text-neutral-800 mb-6 tracking-tight">
          {mode === "login" ? "Sign In" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Rami BG"
                className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-neutral-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-olive-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-neutral-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-olive-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-neutral-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-olive-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-emerald-600 hover:underline font-medium"
                onClick={() => setMode("register")}
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                className="text-emerald-600 hover:underline font-medium"
                onClick={() => setMode("login")}
              >
                Login here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
