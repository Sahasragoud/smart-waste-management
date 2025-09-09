// src/components/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import type { User } from "../types/user";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState<User>();

  const role = user?.role?.toLowerCase() || null;
  const username = user?.username || null;
  const isLoggedIn = !!role;

  // Sync user state with localStorage on mount and storage events
  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    // Initial sync
    syncUser();

    // Listen to storage events (even from other tabs)
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(undefined); // Immediately update state
    navigate("/login");
  };

  // Links
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
    <nav className="bg-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide">
          🌍 EcoSort
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex space-x-8 font-medium items-center">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative group ${
                location.pathname === link.to
                  ? "text-yellow-300 font-semibold"
                  : "hover:text-yellow-300"
              }`}
            >
              {link.label}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] w-full bg-yellow-300 transform scale-x-0 transition-transform ${
                  location.pathname === link.to
                    ? "scale-x-100"
                    : "group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}

          {isLoggedIn && (
            <div className="flex items-center space-x-4 ml-6">
              <div className="w-10 h-10 rounded-full bg-yellow-400 text-green-900 flex items-center justify-center font-bold">
                {username?.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold">{username}</span>
              <button
                onClick={handleLogout}
                className="ml-2 bg-yellow-400 text-green-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-green-600 px-6 py-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block text-lg ${
                location.pathname === link.to
                  ? "text-yellow-300 font-semibold"
                  : "hover:text-yellow-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-400 text-green-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
