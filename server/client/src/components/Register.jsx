import { useState } from "react";
import api from "../api";
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="bg-emerald-900/95 min-h-screen flex items-center justify-center px-4 py-16">
 <div className="bg-emerald-800/40 p-8 rounded-xl shadow-xl backdrop-blur-sm border border-emerald-700/30 text-white w-full max-w-md">
   <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">Register</h1>
   
   <form onSubmit={handleSubmit} className="space-y-6">
     <div className="space-y-2">
       <input
         type="text"
         placeholder="Username"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
         className="w-full p-3 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
         border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
         focus:outline-none transition-colors duration-200"
       />
     </div>

     <div className="space-y-2">
       <input
         type="email"
         placeholder="Email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         className="w-full p-3 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
         border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
         focus:outline-none transition-colors duration-200"
       />
     </div>

     <div className="space-y-2">
       <input
         type="password"
         placeholder="Password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         className="w-full p-3 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
         border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
         focus:outline-none transition-colors duration-200"
       />
     </div>

     <div className="text-emerald-100/80">
       <p>
         Already have an account?{" "}
         <Link 
           to="/login" 
           className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
         >
           Login
         </Link>
       </p>
     </div>

     <button
       type="submit"
       className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 
       rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none 
       focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-emerald-800"
     >
       Register
     </button>
   </form>

   {message && (
     <div className="mt-6 text-center">
       <p className="text-emerald-400 bg-emerald-400/10 py-2 px-4 rounded-lg inline-block">
         {message}
       </p>
     </div>
   )}
 </div>
</div>
  );
};

export default Register;
