import { useState } from "react";
import api from "../api";
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post(
        "/api/auth/login",
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="relative bg-emerald-800/40 p-8 rounded-xl shadow-xl backdrop-blur-sm border border-emerald-700/30 text-white w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl"></div>
        
        <h1 className="text-3xl font-bold mb-2 text-center tracking-tight">Welcome Back</h1>
        <p className="text-emerald-200/70 text-center mb-8">Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-emerald-100">Password</label>
              <Link to="/forgot-password" className="text-xs text-emerald-300 hover:text-emerald-200 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50
                border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          <div className="text-emerald-100/80 text-center">
            <p>
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
              >
                Create Account
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
            {isLoading ? "Signing in..." : "Sign In"}
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
            Protected by industry standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
