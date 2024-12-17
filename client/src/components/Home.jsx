import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setBlogs(response.data);
      } catch (err) {
        setError('Failed to fetch blogs. Please try again later.');
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-700 min-h-screen text-white flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      {error && <p className="text-red-400 text-lg mb-4">{error}</p>}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
            <p className="text-gray-300">{blog.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
