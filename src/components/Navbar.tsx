// src/components/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaBell,
  FaMoon,
  FaSun,
  FaLock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const profileRef = useRef<HTMLDivElement>(null);

  const role = user?.role?.toLowerCase() || null;
  const username = user?.username || null;
  const points = user?.points || 0;
  const isLoggedIn = !!role;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
    setUser(null);
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
    links.push({ to: "/leaderboard", label: "Leaderboard" });
  } else {
    links.push({ to: "/dashboard", label: "Dashboard" });
    links.push({ to: "/scan", label: "Scans" });
    links.push({ to: "/centers", label: "Centres" });
    links.push({ to: "/rewards", label: "Rewards" });
  }

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg sticky top-0 z-50 font-sans transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="flex items-center text-3xl font-bold tracking-wide hover:text-green-500 dark:hover:text-green-300 transition"
        >
          🌱 EcoSort
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 font-medium items-center">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`py-2 px-4 rounded-md transition duration-300 ${
                location.pathname === link.to
                  ? "bg-green-700 text-green-300 font-semibold"
                  : "hover:bg-green-700 dark:hover:bg-green-600 hover:text-green-100"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && (
            <div className="flex items-center space-x-6 relative" ref={profileRef}>
              {/* Notifications */}
              <div className="relative">
                <FaBell className="text-2xl cursor-pointer hover:text-green-500 dark:hover:text-green-300 transition" />
                {points > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {points}
                  </span>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  localStorage.setItem("darkMode", (!darkMode).toString());
                }}
                className="text-lg p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 w-auto px-2 py-1 rounded-full bg-green-700 hover:bg-green-600 transition shadow-md"
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="hidden md:block font-medium">{username}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 flex flex-col z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-black dark:text-white hover:bg-green-700 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <FaUserCircle className="mr-2" /> Profile
                      </Link>
                      <Link
                        to={role === "admin" ? "/update-password-admin" : "/update-password"}
                        className="flex items-center px-4 py-2 text-black dark:text-white hover:bg-green-700 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <FaLock className="mr-2" /> Update Password
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-left text-black dark:text-white hover:bg-green-700 dark:hover:bg-gray-700 w-full transition"
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
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
            className="md:hidden bg-white dark:bg-gray-800 px-6 py-5 space-y-4 rounded-b-lg shadow-inner overflow-hidden"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block text-lg py-2 px-4 rounded-md transition ${
                  location.pathname === link.to
                    ? "bg-green-700 text-green-100 font-semibold"
                    : "hover:bg-green-700 dark:hover:bg-green-600 hover:text-green-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn && (
              <div className="border-t border-green-700 pt-2 flex flex-col space-y-2">
                <span className="block px-4 py-2 text-black dark:text-white font-medium">{username}</span>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-black dark:text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md transition"
                >
                  <FaUserCircle className="mr-2" /> Profile
                </Link>
                <Link
                  to={role === "admin" ? "/update-password-admin" : "/update-password"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-black dark:text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md transition"
                >
                  <FaLock className="mr-2" /> Update Password
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-black dark:text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md transition"
                >
                  Logout
                </button>
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    localStorage.setItem("darkMode", (!darkMode).toString());
                  }}
                  className="flex items-center px-4 py-2 text-black dark:text-white hover:bg-green-700 dark:hover:bg-gray-700 rounded-md transition"
                >
                  {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
