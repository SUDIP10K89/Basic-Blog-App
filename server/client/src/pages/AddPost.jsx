import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://blog-app-4j8r.onrender.com/api/posts",
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
      navigate("/");
    } catch (error) {
      console.log(error);
      setMessage("Failed to create blog post.");
    }
  };

  return (
    <div className="bg-gray-700 min-h-screen text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Add a New Blog Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
          />
          <textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
          >
            Create Blog
          </button>
        </form>
        {message && (
          <p className="text-center text-green-400 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}

export default AddPost;
