import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/scan", label: "Scan" },
    { to: "/centers", label: "Centers" },
    { to: "/rewards", label: "Rewards" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },

  ];

  return (
    <nav className="bg-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-300"
        >
          🌍 EcoSort
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-yellow-300 font-semibold"
                  : "hover:text-yellow-300"
              }`}
            >
              {link.label}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] w-full bg-yellow-300 transform scale-x-0 transition-transform duration-300 ${
                  location.pathname === link.to ? "scale-x-100" : "group-hover:scale-x-100"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-green-600 px-6 py-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block text-lg transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-yellow-300 font-semibold"
                  : "hover:text-yellow-300"
              }`}
              onClick={() => setIsOpen(false)} // close menu after click
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
