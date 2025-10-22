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
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            🐛 BugTrace
          </Link>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  Welcome, {user?.username}
                </span>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Projects
                </Link>
                <Link
                  to="/issues"
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Issues
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium"
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
