import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-emerald-800 shadow-lg fixed top-0 w-full z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* App Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Blogging App
            </h1>
          </div>
          
          {/* Mobile menu button - for responsive design */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <Link 
                to="/" 
                className="text-emerald-100 hover:text-white font-medium transition-colors duration-200 ease-in-out"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/myblog" 
                className="text-emerald-100 hover:text-white font-medium transition-colors duration-200 ease-in-out"
              >
                My Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/add-post" 
                className="text-emerald-100 hover:text-white font-medium transition-colors duration-200 ease-in-out"
              >
                Create
              </Link>
            </li>
            {isLoggedIn ? (
              <li>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile menu - toggleable */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            onClick={toggleMobileMenu}
            className="block px-3 py-2 text-emerald-100 hover:text-white font-medium transition-colors duration-200 ease-in-out"
          >
            Home
          </Link>
          <Link 
            to="/myblog" 
            onClick={toggleMobileMenu}
            className="block px-3 py-2 text-emerald-100 hover:text-white font-medium transition-colors duration-200 ease-in-out"
          >
            My Blog
          </Link>
          <Link 
            to="/add-post" 
            onClick={toggleMobileMenu}
            className="block px-3 py-2 text-emerald-100 hover:text-white font-medium transition-colors duration-200 ease-in-out"
          >
            Create
          </Link>
          {isLoggedIn ? (
            <button 
              onClick={() => { handleLogout(); toggleMobileMenu(); }}
              className="block w-full text-left px-3 py-2 text-emerald-100 hover:text-white font-medium transition-colors duration-200 ease-in-out"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={toggleMobileMenu}
              className="block px-3 py-2 text-emerald-100 hover:text-white font-medium transition-colors duration-200 ease-in-out"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
