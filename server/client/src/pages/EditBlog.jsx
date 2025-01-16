import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="bg-emerald-900/95 min-h-screen text-white flex flex-col items-center py-12 px-4">
 <h1 className="text-4xl font-bold mb-12 tracking-tight">Edit Blog Post</h1>
 
 {loading ? (
   <div className="flex items-center justify-center">
     <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
     <span className="ml-3 text-emerald-200">Loading...</span>
   </div>
 ) : (
   <>
     {error && (
       <div className="w-full max-w-2xl mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
         <p className="text-red-400 text-lg">{error}</p>
       </div>
     )}
     
     <div className="w-full max-w-2xl space-y-6">
       <div>
         <input
           type="text"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           placeholder="Enter blog title..."
           className="w-full p-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
           border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
           focus:outline-none transition-colors duration-200 text-lg"
         />
       </div>

       <div>
         <textarea
           value={content}
           onChange={(e) => setContent(e.target.value)}
           placeholder="Write your blog content here..."
           rows="12"
           className="w-full p-4 rounded-lg bg-emerald-900/50 text-white placeholder-emerald-200/50 
           border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
           focus:outline-none transition-colors duration-200 resize-y min-h-[300px]"
         />
       </div>

       <div className="flex justify-end space-x-4">
         <button
           onClick={handleSave}
           disabled={loading}
           className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-8 
           rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none 
           focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-emerald-800
           disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {loading ? (
             <span className="flex items-center">
               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Saving...
             </span>
           ) : (
             'Save Changes'
           )}
         </button>
       </div>
     </div>
   </>
 )}
</div>
  );
}

export default EditBlog;
