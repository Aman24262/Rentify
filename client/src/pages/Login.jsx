import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import useAuth from "../context/useAuth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Email and password are required");
    setSubmitting(true);
    try {
      const payload = { ...form, email: form.email.trim().toLowerCase() };
      const { data } = await api.post("/auth/login", payload);
      login({ user: data, token: data.token });
      toast.success("Welcome back!");
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main px-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-3xl bg-background-card p-8 shadow-card"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">Welcome Back</h2>
          <p className="mt-2 text-text-secondary">Sign in to your Rentify account</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              id="email"
              className="peer w-full rounded-2xl border border-border-default bg-background-card px-4 py-3 text-text-primary placeholder-transparent focus:border-primary-indigo focus:outline-none focus:ring-2 focus:ring-primary-indigo/20 transition-all duration-300"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-3 text-text-secondary text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary-indigo"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              className="peer w-full rounded-2xl border border-border-default bg-background-card px-4 py-3 text-text-primary placeholder-transparent focus:border-primary-indigo focus:outline-none focus:ring-2 focus:ring-primary-indigo/20 transition-all duration-300"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-3 text-text-secondary text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary-indigo"
            >
              Password
            </label>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-primary-purple to-primary-indigo py-3 text-white font-semibold shadow-soft hover:shadow-glow-purple transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </motion.button>

        <div className="text-center">
          <p className="text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-indigo hover:text-primary-purple font-medium transition-colors duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
}
