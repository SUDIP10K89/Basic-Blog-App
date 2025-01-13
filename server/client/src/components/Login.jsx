import { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://blog-app-4j8r.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );
      const { token } = response.data;
      localStorage.setItem('token', token);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Invalid Credentials!");
    }
  };

  return (
    <div className="bg-gray-700 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded shadow-md text-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
          />
          <div>
            <p>
              Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-green-300 transition duration-300 ease-in-out"
              >
              Register
            </Link>
              </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
          >
            Login
          </button>
        </form>
        {message && <p className="text-center text-green-400 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
