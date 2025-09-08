// src/pages/Register.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { registerUser } from "../services/UserServices";
import type { RegisterRequest } from "../types/user";

type UserSession = {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
};

const saveUserSession = (userData: UserSession) => {
  localStorage.setItem("userId", String(userData.id));
  localStorage.setItem("userName", userData.name);
  localStorage.setItem("userEmail", userData.email);
  localStorage.setItem("userRole", userData.role);
  localStorage.setItem("authToken", userData.token);
  localStorage.setItem("user", JSON.stringify(userData));
};
export default function Register() {
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    address: "",
    role: "user"
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    message: "",
    percent: 0,
    color: "red",
  });
  const [apiError, setApiError] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Password strength checker
  const getPasswordStrength = (password: string) => {
        let strength = 0;
    let message = "";
    let color = "red";

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (/\s/.test(password)) {
      message = "Password should not contain spaces";
      strength = 0;
    } else if (password.length < 8) {
      message = "At least 8 characters";
      strength = 0;
    } else {
      switch (strength) {
        case 1:
        case 2:
          message = "Weak";
          color = "red";
          break;
        case 3:
          message = "Fair";
          color = "orange";
          break;
        case 4:
          message = "Good";
          color = "goldenrod";
          break;
        case 5:
          message = "Strong";
          color = "green";
          break;
      }
    }
    return { message, percent: (strength / 5) * 100, color };

  };

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }

    if (name === "password" || name === "confirmPassword") {
      const pwd = name === "password" ? value : formData.password;
      const confirmPwd =
        name === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordError(
        pwd && confirmPwd && pwd !== confirmPwd
          ? "Passwords do not match!"
          : ""
      );
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dob: "",
      address: "",
      role: "user"
    });
    setPasswordError("");
    setPasswordStrength({ message: "", percent: 0, color: "red" });
    setApiError("");
  };



  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    setApiError("");
    try {
        const payload: RegisterRequest = {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phone,
          dateOfBirth: formData.dob,
          address: formData.address,
          role: formData.role.toUpperCase() as "USER" | "ADMIN",
        };
      const response = await registerUser(payload)

      const newUser = response.data;

saveUserSession(newUser);
clearForm();
setIsSubmitted(true);
setTimeout(() => {
  navigate("/dashboard"); // ✅ consistent
}, 2000);
} catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.status === 400
            ? "Registration failed. Please check your inputs."
            : "Something went wrong. Try again later.";
        setApiError(msg);
      } else {
        setApiError("Unexpected error occurred");
      }
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      navigate("/login");
    }, 2000);
  };

  
  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !passwordError &&
    passwordStrength.percent >= 50;


  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Create an Account 🌍
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}

            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                name="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
            {/* Strength Indicator */}
          {formData.password && (
            <div>
              <small style={{ color: passwordStrength.color }}>
                {passwordStrength.message}
              </small>
              <div className="w-full bg-gray-200 h-1 rounded mt-1">
                <div
                  style={{
                    width: `${passwordStrength.percent}%`,
                    backgroundColor: passwordStrength.color,
                  }}
                  className="h-1 rounded"
                ></div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                name="confirmPassword"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>


          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
              max={new Date().toISOString().split("T")[0]} // prevent future dates
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input
              type="text"
              placeholder="123 Green Street"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition ${
              isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Register
          </button>

        </form>

        {/* Success Popup */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-md font-medium"
          >
            ✅ Account Created Successfully! Redirecting...
          </motion.div>
        )}

        <p className="text-gray-600 text-sm mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </section>
  );
}

