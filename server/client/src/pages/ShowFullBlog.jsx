import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function ShowFullBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://blog-app-4j8r.onrender.com/api/posts/${id}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError("Failed to fetch blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  return (
    <div className="bg-gray-700 min-h-screen text-white flex flex-col items-center py-8">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p className="text-red-400 text-lg mb-4">{error}</p>}
          <div class="w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold mb-4">{title}</h2>
            <p class="text-gray-400 mb-4">
              {content}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default ShowFullBlog;
