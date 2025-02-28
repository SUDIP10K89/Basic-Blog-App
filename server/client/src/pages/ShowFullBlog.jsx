import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";

function ShowFullBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("User");
  const [createdAt, setCreatedAt] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/posts/${id}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setTitle(response.data.title);
        setContent(response.data.content);
        // Set author if available in API response
        if (response.data.author) setAuthor(response.data.author);
        // Set date if available in API response
        if (response.data.createdAt) {
          const date = new Date(response.data.createdAt);
          setCreatedAt(date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }));
        } else {
          setCreatedAt(new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }));
        }
      } catch (err) {
        setError("Failed to fetch blog. Please login.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  return (
    <div className="bg-gradient-to-b from-emerald-900 to-teal-900 min-h-screen text-emerald-50 flex flex-col items-center py-16 px-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-emerald-300 text-lg font-medium">Loading your blog...</p>
        </div>
      ) : (
        <>
          {error ? (
            <div className="w-full max-w-4xl mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-red-400 text-lg font-semibold">{error}</p>
              <button 
                onClick={() => navigate('/login')}
                className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <div className="w-full max-w-3xl">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-emerald-300 hover:text-emerald-200 mb-8 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to posts
                </button>
                
                <div className="bg-gradient-to-br from-emerald-800/60 to-teal-800/60 rounded-xl shadow-xl border border-emerald-700/30 backdrop-blur-sm overflow-hidden">
                  <div className="p-8 pb-0">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold mr-3">
                        {author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-emerald-200 font-medium">{author}</p>
                        <p className="text-emerald-400/80 text-sm">{createdAt}</p>
                      </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
                      {title}
                    </h1>
                  </div>
                  
                  <div className="px-8 pt-4 pb-8">
                    <div className="prose prose-lg prose-invert prose-emerald max-w-none">
                      {content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-emerald-100/90 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 flex justify-center space-x-4">
                  <button 
                    onClick={() => navigate(`/edit/${id}`)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-emerald-400/20 hover:shadow-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Post
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-teal-400/20 hover:shadow-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    All Posts
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ShowFullBlog;