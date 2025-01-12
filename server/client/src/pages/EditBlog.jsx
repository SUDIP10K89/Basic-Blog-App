import { useState, useEffect } from 'react';
import axios from 'axios';
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
        const response = await axios.get(`https://blog-app-4j8r.onrender.com/api/posts/${id}`, {
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
      await axios.put(
        `http://localhost:5000/api/posts/${id}`,
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
    <div className="bg-gray-700 min-h-screen text-white flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Blog</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p className="text-red-400 text-lg mb-4">{error}</p>}
          <div className="w-full max-w-2xl">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full mb-4 p-2 text-gray-800 rounded"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="w-full mb-4 p-2 text-gray-800 rounded"
            ></textarea>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EditBlog;
