import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Home() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://blog-app-4j8r.onrender.com/api/posts");
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
      await axios.delete(`https://blog-app-4j8r.onrender.com/api/posts/${blogId}`, {
        headers: { Authorization: `${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.log("Failed to Delete", error);
      setError("Failed to delete blog");
    }
  };

  return (
    <div className="bg-gray-700 min-h-screen text-white flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-8">Blog 3 Posts</h1>
      {error && <p className="text-red-400 text-lg mb-4">{error}</p>}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
            <div onClick={() => handleShowFull(blog._id)}>
              <p className="text-xl font-semibold mb-2">{blog.title}</p>
              <p className="text-gray-300 mb-2 h-40">
                {blog.content.substring(0, 100)}...
              </p>
            </div>
            <button
              onClick={() => handleEditClick(blog._id)}
              className="bg-green-500 text-gray-900 px-4 py-2 mx-3 rounded hover:bg-green-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              className="bg-red-500 text-gray-900 px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
