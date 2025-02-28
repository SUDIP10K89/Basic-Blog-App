import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";


function Home() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/api/posts");
        setBlogs(response.data);
      } catch (err) {
        setError("Failed to fetch blogs. Please try again later.");
      }
    };

    fetchBlogs();
  }, []);

  const handleShowFull = (blogId) => {
    navigate(`/show/${blogId}`);
  };


  return (
    <div className="bg-emerald-900/95 min-h-screen text-emerald-50 flex flex-col items-center py-12 px-4">
  <h1 className="text-4xl font-bold mb-12 tracking-tight">Blog Posts</h1>
  
  {error && (
    <div className="w-full max-w-4xl mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
      <p className="text-red-400 text-lg">{error}</p>
    </div>
  )}
  
  <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {blogs.map((blog) => (
      <div 
        key={blog._id} 
        onClick={() => handleShowFull(blog._id)}
        className="bg-emerald-800/40 hover:bg-emerald-800/60 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-emerald-700/30 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-white tracking-tight line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-emerald-100/80 leading-relaxed h-40 overflow-hidden">
          {blog.content.substring(0, 100)}...
        </p>
        <div className="mt-4 pt-4 border-t border-emerald-700/30">
          <span className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors duration-200">
            Read more →
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}

export default Home;
