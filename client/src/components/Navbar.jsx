import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold hover:text-blue-200 transition-colors flex items-center space-x-2"
          >
            <span className="text-2xl">🐛</span>
            <span className="hidden sm:inline">BugTrace</span>
          </Link>
          <div className="flex items-center space-x-3 md:space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-xs md:text-sm bg-white/20 px-2 md:px-3 py-1 rounded-full hidden sm:inline">
                  Welcome, {user?.username}
                </span>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-200 transition-colors font-medium text-sm md:text-base"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="hover:text-blue-200 transition-colors font-medium text-sm md:text-base"
                >
                  Projects
                </Link>
                <Link
                  to="/issues"
                  className="hover:text-blue-200 transition-colors font-medium text-sm md:text-base"
                >
                  Issues
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 md:px-4 py-2 rounded-lg transition-colors font-medium text-sm md:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition-colors font-medium text-sm md:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-3 md:px-4 py-2 rounded-lg transition-colors font-medium text-sm md:text-base"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
