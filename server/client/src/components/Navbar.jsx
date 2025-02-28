import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const isLoggedIn = !!localStorage.getItem("token");
  
  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`transition-all duration-300 ${
      scrollPosition > 50 
        ? 'bg-emerald-800/95 backdrop-blur-sm shadow-lg py-2' 
        : 'bg-gradient-to-r from-emerald-900 to-emerald-800 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* App Logo and Title */}
          <Link to="/" className="flex items-center group">
            <div className="mr-3 bg-emerald-600 text-white rounded-lg p-2 shadow-md group-hover:bg-emerald-500 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2V9a2 2 0 00-2-2h-1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight group-hover:text-emerald-200 transition-colors duration-200">
              Blogging<span className="text-emerald-300 font-light ml-1">App</span>
            </h1>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-2 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center space-x-1">
            <li>
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-emerald-700/80 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-700/40 hover:text-white'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/myblog" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/myblog') 
                    ? 'bg-emerald-700/80 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-700/40 hover:text-white'
                }`}
              >
                My Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/add-post" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/add-post') 
                    ? 'bg-emerald-700/80 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-700/40 hover:text-white'
                }`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create
                </span>
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="ml-2">
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </li>
            ) : (
              <li className="ml-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile menu - with animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-2 bg-emerald-800/90 backdrop-blur-sm border-t border-emerald-700/50">
          <Link 
            to="/" 
            onClick={toggleMobileMenu}
            className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/') 
                ? 'bg-emerald-700/80 text-white' 
                : 'text-emerald-100 hover:bg-emerald-700/40 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/myblog" 
            onClick={toggleMobileMenu}
            className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/myblog') 
                ? 'bg-emerald-700/80 text-white' 
                : 'text-emerald-100 hover:bg-emerald-700/40 hover:text-white'
            }`}
          >
            My Blog
          </Link>
          <Link 
            to="/add-post" 
            onClick={toggleMobileMenu}
            className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/add-post') 
                ? 'bg-emerald-700/80 text-white' 
                : 'text-emerald-100 hover:bg-emerald-700/40 hover:text-white'
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Post
            </span>
          </Link>
          {isLoggedIn ? (
            <button 
              onClick={() => { handleLogout(); toggleMobileMenu(); }}
              className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={toggleMobileMenu}
              className="block w-full mt-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium rounded-lg transition-all duration-300 text-center"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;