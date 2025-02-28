import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/posts");
        setBlogs(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleShowFull = (blogId) => {
    navigate(`/show/${blogId}`);
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 min-h-screen text-emerald-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-200">
            Explore Our Blog
          </h1>
          <p className="text-emerald-300 text-xl max-w-2xl mx-auto">
            Discover thoughtful articles and insights on various topics
          </p>
        </header>
        
        {error && (
          <div className="w-full mb-12 bg-red-500/20 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-red-300 text-lg flex items-center justify-center">
              <span className="mr-2">⚠️</span> {error}
            </p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-t-emerald-300 border-emerald-700/30 animate-spin"></div>
              <p className="mt-4 text-emerald-400">Loading articles...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? blogs.map((blog) => (
              <div 
                key={blog._id} 
                onClick={() => handleShowFull(blog._id)}
                className="group bg-emerald-800/30 hover:bg-emerald-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-emerald-700/30 backdrop-blur-sm flex flex-col h-full"
              >
                {blog.image && (
                  <div className="mb-4 rounded-lg overflow-hidden h-40 bg-emerald-900/50">
                    <img 
                      src="/api/placeholder/400/320" 
                      alt="Blog cover" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="mb-2 flex items-center">
                  <span className="text-xs uppercase tracking-wider text-emerald-400 bg-emerald-900/40 px-3 py-1 rounded-full">
                    {blog.category || "Article"}
                  </span>
                  {blog.date && (
                    <span className="text-emerald-400/70 text-sm ml-auto">
                      {formatDate(blog.date)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-white tracking-tight line-clamp-2 group-hover:text-emerald-300 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-emerald-100/80 leading-relaxed flex-grow mb-4">
                  {blog.content.substring(0, 120)}...
                </p>
                <div className="mt-auto pt-4 border-t border-emerald-700/30 flex items-center justify-between">
                  <span className="text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors duration-200 flex items-center">
                    Read more 
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                  {blog.author && (
  <span className="text-emerald-400/70 text-sm">
    By {typeof blog.author === 'object' ? blog.author.username || 'Anonymous' : blog.author}
  </span>
)}
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-emerald-400/70">No blog posts available at the moment.</p>
                <p className="mt-2 text-emerald-400/50">Check back soon for new content!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;