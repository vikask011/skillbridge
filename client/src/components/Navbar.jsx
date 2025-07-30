"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/128/1077/1077114.png";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
              SkillBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-zinc-700 hover:text-zinc-900 transition px-2"
                >
                  Dashboard
                </Link>
                <Link
                  to="/search"
                  className="text-sm text-zinc-700 hover:text-zinc-900 transition px-2"
                >
                  Search
                </Link>
                <Link
                  to="/bookings"
                  className="text-sm text-zinc-700 hover:text-zinc-900 transition px-2"
                >
                  Bookings
                </Link>
                <Link
                  to="/about"
                  className="text-sm text-zinc-700 hover:text-zinc-900 transition px-2"
                >
                  About Us
                </Link>

                <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-100 rounded-full">
                  <span className="text-sm font-medium text-indigo-800">
                    {user.points || 0} pts
                  </span>
                </div>

                <Link to="/profile" className="ml-2">
                  <img
                    src={user.profilePic || defaultAvatar}
                    alt="Profile"
                    className="w-10 h-10 p-1 rounded-full object-cover border-2 border-indigo-300 shadow-sm"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-zinc-700 hover:text-zinc-900 transition px-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white rounded-lg text-sm hover:from-zinc-800 hover:to-zinc-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-zinc-700 text-2xl focus:outline-none"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-2 flex flex-col space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-sm text-zinc-700 hover:text-zinc-900"
                >
                  Dashboard
                </Link>
                <Link
                  to="/search"
                  className="block text-sm text-zinc-700 hover:text-zinc-900"
                >
                  Search
                </Link>
                <Link
                  to="/bookings"
                  className="block text-sm text-zinc-700 hover:text-zinc-900"
                >
                  Bookings
                </Link>
                <Link
                  to="/about"
                  className="block text-sm text-zinc-700 hover:text-zinc-900"
                >
                  About us
                </Link>
                <div className="px-3 py-1 bg-indigo-100 rounded-full inline-block">
                  <span className="text-sm font-medium text-indigo-800">
                    {user.points || 0} pts
                  </span>
                </div>
                <Link to="/profile">
                  <img
                    src={user.profilePic || defaultAvatar}
                    alt="Profile"
                    className="w-10 h-10 p-1 rounded-full object-cover border-2 border-indigo-300 mt-2"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-sm text-zinc-700 hover:text-zinc-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white rounded-lg text-sm hover:from-zinc-800 hover:to-zinc-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
