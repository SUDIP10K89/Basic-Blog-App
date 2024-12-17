import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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
              to="/login" 
              className="hover:text-gray-300 transition duration-300 ease-in-out"
            >
              Login
            </Link>
          </li>
          <li>
            <Link 
              to="/register" 
              className="hover:text-gray-300 transition duration-300 ease-in-out"
            >
              Register
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
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;