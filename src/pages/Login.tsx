import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { loginUser } from "../services/UserServices";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault(); 
   setError(""); 

   const trimmedEmail = email.trim(); 
   const trimmedPassword = password.trim();

   if (!trimmedEmail) return setError("Email or Username is required."); 
   if (!trimmedPassword) return setError("Password is required."); 
   if (trimmedPassword.length < 6) return setError("Password must be at least 6 characters long."); 
   try { 
    const response = await loginUser(trimmedEmail.toLowerCase(), trimmedPassword); 
    console.log("Login response:", response.data); 
    if (response.data && response.data.id) { 
      localStorage.setItem("user", JSON.stringify(response.data)); 
      localStorage.setItem("token", response.data.token); 
      const role = response.data.role.toLowerCase(); 
      if (role === "user") { navigate("/dashboard"); } 
      else if (role === "admin") { navigate("/admin"); } 
      else { setError("Invalid role received from server."); }
     } else { 
      setError("Login successful, but response is missing user data."); } 
    }catch (err) { 
      if (axios.isAxiosError(err) && err.response) { 
        setError(err.response.data?.message || "Something went wrong."); 
      } 
      else { setError("Something went wrong. Please try again later."); }
     } 
    };
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

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">
              Username 
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your username (admin) or email (user)"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6 text-center">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            Register
          </a>
        </p>
      </motion.div>
    </section>
  );
}
