import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/api/posts",
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setTitle("");
      setContent("");
      navigate("/");
    } catch (error) {
      console.log(error);
      setMessage("Failed to create blog post.");
    }
  };

  return (
    <div className="pt-25 bg-emerald-900/95 min-h-screen text-white flex items-center justify-center px-4 py-16">
 <div className="bg-emerald-800/40 p-8 rounded-xl shadow-xl backdrop-blur-sm border border-emerald-700/30 w-full max-w-2xl">
   <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">
     Create New Blog Post
   </h1>

   <form onSubmit={handleSubmit} className="space-y-6">
     <div>
       <input
         type="text"
         placeholder="Enter your blog title..."
         value={title}
         onChange={(e) => setTitle(e.target.value)}
         className="w-full p-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
         border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
         focus:outline-none transition-colors duration-200 text-lg"
       />
     </div>

     <div>
       <textarea
         placeholder="Write your blog content here..."
         value={content}
         onChange={(e) => setContent(e.target.value)}
         rows="8"
         className="w-full p-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
         border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
         focus:outline-none transition-colors duration-200 resize-y min-h-[200px]"
       />
     </div>

     <button
       type="submit"
       className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 px-6 
       rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none 
       focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-emerald-800
       text-lg"
     >
       Publish Blog Post
     </button>
   </form>

   {message && (
     <div className="mt-6 text-center">
       <p className="text-emerald-400 bg-emerald-400/10 py-3 px-6 rounded-lg inline-block">
         {message}
       </p>
     </div>
   )}
 </div>
</div>
  );
}

export default AddPost;
