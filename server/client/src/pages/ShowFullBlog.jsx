import { useState, useEffect } from "react";
import api from "../api";
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
        const response = await api.get(
          `/api/posts/${id}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError("Failed to fetch blog. Please login.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  return (
    <div className="bg-emerald-900/95 min-h-screen text-emerald-50 flex flex-col items-center py-12 px-4">
  {loading ? (
    <p className="text-emerald-300 text-lg font-medium animate-pulse">Loading...</p>
  ) : (
    <>
      {error && (
        <div className="w-full max-w-4xl mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-lg font-semibold">{error}</p>
        </div>
      )}
      <div className="w-full max-w-3xl bg-emerald-800/40 p-6 rounded-xl shadow-lg border border-emerald-700/30 backdrop-blur-sm">
        <p className="text-emerald-400 font-medium mb-2">Username</p>
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-emerald-100/80 text-base leading-relaxed">
          {content}
        </p>
      </div>
    </>
  )}
</div>


  );
}

export default ShowFullBlog;
