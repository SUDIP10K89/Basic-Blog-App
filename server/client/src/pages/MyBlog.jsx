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

  const handleEditClick = (blogId) => {
    navigate(`/edit/${blogId}`);
  };
  const handleShowFull = (blogId) => {
    navigate(`/show/${blogId}`);
  };

  //To delete
  const handleDelete = async (blogId) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/posts/${blogId}`, {
        headers: { Authorization: `${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.log("Failed to Delete", error);
      setError("Failed to delete blog");
    }
  };

  return (
    <div className="bg-emerald-900/95 min-h-screen text-emerald-50 flex flex-col items-center py-12 px-4">
    <h1 className="text-4xl font-bold mb-12 tracking-tight">Your Blog Posts</h1>
    
    {error && (
      <div className="w-full max-w-4xl mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    )}
    
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <div 
          key={blog._id} 
          className="bg-emerald-800/40 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-700/30 backdrop-blur-sm"
        >
          <div 
            onClick={() => handleShowFull(blog._id)}
            className="cursor-pointer mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-white tracking-tight line-clamp-2 hover:text-emerald-300 transition-colors">
              {blog.title}
            </h2>
            <p className="text-emerald-100/80 leading-relaxed h-40 overflow-hidden">
              {blog.content.substring(0, 100)}...
            </p>
          </div>
   
          <div className="flex space-x-3 mt-4 pt-4 border-t border-emerald-700/30">
            <button
              onClick={() => handleEditClick(blog._id)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 
              rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Edit
            </button>
            
            <button
              onClick={() => handleDelete(blog._id)}
              className="flex-1 bg-red-500/80 hover:bg-red-500 text-white font-medium py-2 px-4 
              rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
   
    {blogs.length === 0 && (
      <div className="text-center text-emerald-200/70 mt-8">
        <p className="text-lg">No blog posts yet. Create your first post!</p>
      </div>
    )}
   </div>
  );
}

export default Home;
