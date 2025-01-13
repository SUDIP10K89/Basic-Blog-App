import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  }
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blogging App</h1>
        <ul className="flex space-x-4">
          <li>
            <Link 
              to="/" 
              className="hover:text-gray-300 transition duration-300 ease-in-out"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/myblog" 
              className="hover:text-gray-300 transition duration-300 ease-in-out"
            >
              My Blog
            </Link>
          </li>
          <li>
            <Link 
              to="/add-post" 
              className="hover:text-gray-300 transition duration-300 ease-in-out"
            >
              Create
            </Link>
          </li>

          
          <li>
            <Link 
              to="/login" 
              className="hover:text-gray-300 transition duration-300 ease-in-out"
            >
              Login
            </Link>
          </li>
          {/* <li>
            <button 
              onClick={handleLogout}
              className="hover:text-gray-300 transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </li> */}
          
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;