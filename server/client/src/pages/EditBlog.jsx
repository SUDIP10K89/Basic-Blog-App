import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/posts/${id}`, {
          headers: { Authorization: `${token}` },
        });
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError('Failed to fetch blog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(
        `/api/posts/${id}`,
        { title, content },
        { headers: { Authorization: `${token}` } }
      );
      navigate('/'); // Redirect back to the homepage
    } catch (err) {
      setError('Failed to update blog. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-emerald-900 to-teal-900 min-h-screen text-white flex flex-col items-center py-16 px-4">
      <div className="relative w-full max-w-3xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-emerald-300 hover:text-emerald-200 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          
          <div className="h-8 w-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg opacity-80"></div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
          Edit Blog Post
        </h1>
        <p className="text-emerald-300/80 mb-8">Refine your thoughts and ideas</p>
      
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-300 text-lg font-medium">Loading your blog...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="w-full mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-red-400 text-lg font-medium">{error}</p>
                    <p className="text-red-300/70 mt-1">Try refreshing the page or check your connection.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-emerald-800/60 to-teal-800/60 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-emerald-700/30 w-full">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-emerald-200 mb-2 font-medium">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter blog title..."
                    className="w-full p-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-300/40 
                    border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                    focus:outline-none transition-colors duration-200 text-lg"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-emerald-200 mb-2 font-medium">Content</label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your blog content here..."
                    rows="12"
                    className="w-full p-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-300/40 
                    border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                    focus:outline-none transition-colors duration-200 resize-y min-h-[300px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => navigate(`/show/${id}`)}
                    className="text-emerald-300 hover:text-emerald-200 font-medium"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 
                    text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-emerald-500/20 
                    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 
                    focus:ring-offset-2 focus:ring-offset-emerald-800 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Changes...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Save Changes
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditBlog;