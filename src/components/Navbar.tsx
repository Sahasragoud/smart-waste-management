import { Link, useLocation, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaUserCircle, FaCog, FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
=======
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import type { User } from "../types/user";
>>>>>>> e69a72c2a8210cde7259783bb1bc18f0c1f1b0cb

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
<<<<<<< HEAD
  const [user, setUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
=======

  const [user, setUser] = useState<User>();
>>>>>>> e69a72c2a8210cde7259783bb1bc18f0c1f1b0cb

  const role = user?.role?.toLowerCase() || null;
  const username = user?.username || null;
  const points = user?.points || 0; // Example points property
  const isLoggedIn = !!role;

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
<<<<<<< HEAD
    setUser(null);
=======
    setUser(undefined); // Immediately update state
>>>>>>> e69a72c2a8210cde7259783bb1bc18f0c1f1b0cb
    navigate("/login");
  };

  const links = [{ to: "/", label: "Home" }];
  if (!isLoggedIn) {
    links.push({ to: "/login", label: "Login" });
    links.push({ to: "/register", label: "Register" });
  } else if (role === "admin") {
    links.push({ to: "/admin", label: "Dashboard" });
    links.push({ to: "/admin/users", label: "Users" });
    links.push({ to: "/admin/uploads", label: "Uploads" });
    links.push({ to: "/admin/rewards", label: "Rewards" });
  } else {
    links.push({ to: "/dashboard", label: "Dashboard" });
    links.push({ to: "/scan", label: "Scans" });
    links.push({ to: "/centers", label: "Centres" });
    links.push({ to: "/rewards", label: "Rewards" });
  }

  return (
    <nav className="bg-green-900 text-white shadow-lg sticky top-0 z-50 font-sans">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-3xl font-bold tracking-wide hover:text-green-300 transition"
        >
          🌱 EcoSort
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 font-medium items-center">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`py-2 px-4 rounded-md transition duration-300 ${
                location.pathname === link.to
                  ? "bg-green-700 text-green-100 font-semibold"
                  : "hover:bg-green-700 hover:text-green-100"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && (
            <div className="flex items-center space-x-4 relative" ref={profileRef}>
              {/* Points/Notifications */}
              <div className="relative">
                <FaBell className="text-lg cursor-pointer hover:text-green-300 transition" />
                {points > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {points}
                  </span>
                )}
              </div>

              {/* Avatar with tooltip */}
              <div className="relative group">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 w-auto px-2 py-1 rounded-full bg-green-700 hover:bg-green-600 transition shadow-md"
                >
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block font-medium">{username}</span>
                </button>

                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-green-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  View Profile
                </span>

                {/* Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-44 bg-green-800 rounded-md shadow-lg py-2 flex flex-col z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-white hover:bg-green-700 transition"
                      >
                        <FaUserCircle className="mr-2" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-white hover:bg-green-700 transition"
                      >
                        <FaCog className="mr-2" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-left text-white hover:bg-green-700 w-full transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl p-2 rounded-md hover:bg-green-700 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-green-800 px-6 py-5 space-y-4 rounded-b-lg shadow-inner overflow-hidden"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block text-lg py-2 px-4 rounded-md transition ${
                  location.pathname === link.to
                    ? "bg-green-700 text-green-100 font-semibold"
                    : "hover:bg-green-700 hover:text-green-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn && (
              <div className="border-t border-green-700 pt-2">
                <span className="block px-4 py-2 text-white font-medium">{username}</span>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-white hover:bg-green-700 rounded-md transition"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-white hover:bg-green-700 rounded-md transition"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-white hover:bg-green-700 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
