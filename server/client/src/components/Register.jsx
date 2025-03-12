import { useState } from "react";
import api from "../api";
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post(
        "/api/auth/register",
        {
          username,
          email,
          password,
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="relative bg-emerald-800/40 p-8 rounded-xl shadow-xl backdrop-blur-sm border border-emerald-700/30 text-white w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl"></div>
        
        <h1 className="text-3xl font-bold mb-2 text-center tracking-tight">Create Account</h1>
        <p className="text-emerald-200/70 text-center mb-8">Join our community today</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-100 block mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pl-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
                border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                focus:outline-none transition-colors duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-100 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
                border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                focus:outline-none transition-colors duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-100 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
                border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                focus:outline-none transition-colors duration-200"
                required
              />
            </div>
            <p className="text-xs text-emerald-200/60 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="text-emerald-100/80 text-center">
            <p>
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 px-4 
            rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none 
            focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-emerald-800 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <div className="mt-6 text-center">
            <p className="text-emerald-100 bg-emerald-400/10 py-2 px-4 rounded-lg inline-block border border-emerald-400/20">
              {message}
            </p>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-emerald-700/30 text-center">
          <p className="text-xs text-emerald-200/60">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
