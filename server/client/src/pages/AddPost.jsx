import { useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFormat, setCurrentFormat] = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const contentEditableRef = useRef(null);

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
          content: contentEditableRef.current.innerHTML,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setTitle("");
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = "";
      }
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

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    contentEditableRef.current.focus();
    setCurrentFormat(command);
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      formatText("createLink", linkUrl);
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-emerald-900 to-teal-900 min-h-screen text-white flex items-center justify-center px-4 py-16">
      <div className="relative bg-gradient-to-br from-emerald-800/60 to-teal-800/60 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-emerald-700/30 w-full max-w-3xl">
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
              
              {/* Rich Text Toolbar */}
              <div className="bg-emerald-800/70 rounded-t-lg border border-emerald-600/30 border-b-0 p-2 flex flex-wrap gap-1 md:gap-2">
                <button 
                  type="button" 
                  onClick={() => formatText('bold')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentFormat === 'bold' ? 'bg-emerald-600' : ''}`}
                  title="Bold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => formatText('italic')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentFormat === 'italic' ? 'bg-emerald-600' : ''}`}
                  title="Italic"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="4" x2="10" y2="4"></line>
                    <line x1="14" y1="20" x2="5" y2="20"></line>
                    <line x1="15" y1="4" x2="9" y2="20"></line>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => formatText('underline')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentFormat === 'underline' ? 'bg-emerald-600' : ''}`}
                  title="Underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                    <line x1="4" y1="21" x2="20" y2="21"></line>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => formatText('strikeThrough')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentFormat === 'strikeThrough' ? 'bg-emerald-600' : ''}`}
                  title="Strike Through"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <path d="M16 6a4 4 0 0 0-8 0v6">
                    </path><path d="M8 18a4 4 0 0 0 8 0">
                    </path>
                  </svg>
                </button>
                <div className="h-6 mx-1 my-auto w-px bg-emerald-600/50"></div>
                <button 
                  type="button" 
                  onClick={() => formatText('insertUnorderedList')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentFormat === 'insertUnorderedList' ? 'bg-emerald-600' : ''}`}
                  title="Bullet List"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => formatText('insertOrderedList')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentFormat === 'insertOrderedList' ? 'bg-emerald-600' : ''}`}
                  title="Numbered List"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="6" x2="21" y2="6"></line>
                    <line x1="10" y1="12" x2="21" y2="12"></line>
                    <line x1="10" y1="18" x2="21" y2="18"></line>
                    <path d="M4 6h1v4"></path>
                    <path d="M4 10h2"></path>
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => formatText('formatBlock', '<blockquote>')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentFormat === 'formatBlock' ? 'bg-emerald-600' : ''}`}
                  title="Quote"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => formatText('formatBlock', '<h2>')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors`}
                  title="Heading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h8"></path>
                    <path d="M4 18V6"></path>
                    <path d="M12 18V6"></path>
                    <path d="M17 10h3"></path>
                    <path d="M17 6v12"></path>
                  </svg>
                </button>
                <div className="h-6 mx-1 my-auto w-px bg-emerald-600/50"></div>
                <button 
                  type="button" 
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${showLinkInput ? 'bg-emerald-600' : ''}`}
                  title="Insert Link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => formatText('insertHorizontalRule')}
                  className="p-2 rounded hover:bg-emerald-700 transition-colors"
                  title="Horizontal Line"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
              
              {/* Link Input */}
              {showLinkInput && (
                <div className="flex p-2 bg-emerald-800/90 border-x border-emerald-600/30">
                  <input
                    type="text"
                    placeholder="Enter URL..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 p-2 rounded-l-lg bg-emerald-900/50 text-white placeholder-emerald-300/40 
                    border border-emerald-600/30 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20
                    focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleInsertLink}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-r-lg transition-colors"
                  >
                    Insert
                  </button>
                </div>
              )}
              
              {/* Rich Text Editor Area */}
              <div
                ref={contentEditableRef}
                contentEditable
                className="w-full p-4 rounded-b-lg bg-emerald-900/50 text-white 
                border border-emerald-600/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20
                focus:outline-none transition-colors min-h-[250px] max-h-[600px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: content }}
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                style={{ lineHeight: '1.5' }}
              ></div>
              <div className="text-xs text-emerald-400/60 mt-2 pl-2">
                Tip: You can paste formatted content or use the toolbar above to format your text
              </div>
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
              <p claemerald-200 bg-emerald-500/20 py-3 px-6 rounded-lg inline-block border border-emerald-500/30">
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
