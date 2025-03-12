import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get(`/api/posts/my-blogs`, {
          headers: { Authorization: `${token}` },
        });
        setBlogs(response.data);
      } catch (err) {
        setError("Failed to fetch blogs. Please try again later.");
        console.log("Failed to fetch blogs", err);
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
    <div className="bg-gradient-to-b from-emerald-900 to-teal-900 min-h-screen text-emerald-50 flex flex-col items-center py-16 px-4">
      <h1 className="text-5xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-200">Your Blog Posts</h1>
      <p className="text-emerald-300 mb-12 italic">Manage your creative space</p>
      
      {error && (
        <div className="w-full max-w-4xl mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm animate-pulse">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      )}
      
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-gradient-to-br from-emerald-800/40 to-teal-800/40 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-emerald-700/30 backdrop-blur-sm hover:translate-y-[-5px]"
          >
            <div
              onClick={() => handleShowFull(blog._id)}
              className="cursor-pointer mb-6 group"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight line-clamp-2 group-hover:text-emerald-300 transition-colors">
                {blog.title}
              </h2>
              <div className="h-40 overflow-hidden relative">
                <p className="text-emerald-100/80 leading-relaxed">
                  {blog.content.substring(0, 150)}...
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-800/80 to-transparent"></div>
              </div>
              <p className="text-emerald-400 mt-4 text-sm">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex space-x-3 mt-4 pt-4 border-t border-emerald-700/50">
              <button
                onClick={() => handleEditClick(blog._id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 
                rounded-lg transition-all duration-200 shadow-sm hover:shadow-emerald-400/20 hover:shadow-lg flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              
              <button
                onClick={() => handleDelete(blog._id)}
                className="flex-1 bg-red-500/80 hover:bg-red-500 text-white font-medium py-2 px-4 
                rounded-lg transition-all duration-200 shadow-sm hover:shadow-red-400/20 hover:shadow-lg flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {blogs.length === 0 && (
        <div className="text-center mt-16 p-10 bg-emerald-800/20 rounded-xl border border-emerald-700/30 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-emerald-400 mb-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-xl text-emerald-200 mb-2">No blog posts yet</p>
          <p className="text-emerald-300/70">Start your writing journey by creating your first post!</p>
          <button 
            onClick={() => navigate('/add-post')} 
            className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-400/30"
          >
            Create New Post
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;