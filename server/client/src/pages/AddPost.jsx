import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      setMessage("Failed to create blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-emerald-900 to-teal-900 min-h-screen text-white flex items-center justify-center px-4 py-16">
      <div className="relative bg-gradient-to-br from-emerald-800/60 to-teal-800/60 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-emerald-700/30 w-full max-w-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-emerald-300 hover:text-emerald-200 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to posts
            </button>
            
            <div className="h-8 w-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg opacity-80"></div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
            Create New Blog Post
          </h1>
          <p className="text-emerald-300/80 mb-8">Share your thoughts with the world</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-emerald-200 mb-2 font-medium">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter your blog title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-300/40 
                border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                focus:outline-none transition-colors duration-200 text-lg"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-emerald-200 mb-2 font-medium">Content</label>
              <textarea
                id="content"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                className="w-full p-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-300/40 
                border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                focus:outline-none transition-colors duration-200 resize-y min-h-[250px]"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 
                hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3 px-8 
                rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 focus:outline-none 
                focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-emerald-800
                text-lg ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Publish Blog Post
                  </>
                )}
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-6 text-center animate-fade-in">
              <p className="text-emerald-200 bg-emerald-500/20 py-3 px-6 rounded-lg inline-block border border-emerald-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 -mt-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddPost;