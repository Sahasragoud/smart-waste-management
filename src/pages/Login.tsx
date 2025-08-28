// src/pages/Login.tsx
import { motion } from "framer-motion";

export default function Login() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Login to EcoSort 🌱
        </h2>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Button */}
          <button className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition">
            Login
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-600 font-semibold hover:underline">
            Register
          </a>
        </p>
      </motion.div>
    </section>
  );
}
