import { useState, useRef, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromHTML, ContentState, Modifier } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "draft-js/dist/Draft.css";

function AddPost() {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkSelection, setLinkSelection] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);
  const [showFormatTooltip, setShowFormatTooltip] = useState(false);
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const editorContainerRef = useRef(null);

  const navigate = useNavigate();

  // Focus the editor when the page loads
  useEffect(() => {
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  }, []);

  // Update word count whenever editor content changes
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [editorState]);

  // Handle sticky toolbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (toolbarRef.current && editorContainerRef.current) {
        const toolbarRect = toolbarRef.current.getBoundingClientRect();
        const editorRect = editorContainerRef.current.getBoundingClientRect();
        
        if (toolbarRect.top <= 0 && editorRect.bottom > 0) {
          setIsToolbarSticky(true);
        } else {
          setIsToolbarSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const content = editorState.getCurrentContent();
      if (!content.hasText()) return;
      
      const htmlContent = stateToHTML(content);
      localStorage.setItem('draftTitle', title);
      localStorage.setItem('draftContent', htmlContent);
      
      // Show temporary save message
      setMessage("Draft auto-saved");
      setTimeout(() => setMessage(""), 1500);
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [editorState, title]);

  // Check for saved draft on load
  useEffect(() => {
    const savedTitle = localStorage.getItem('draftTitle');
    const savedContent = localStorage.getItem('draftContent');
    
    if (savedTitle || savedContent) {
      const shouldRestore = window.confirm("We found a saved draft. Would you like to restore it?");
      
      if (shouldRestore) {
        if (savedTitle) setTitle(savedTitle);
        
        if (savedContent) {
          const blocksFromHTML = convertFromHTML(savedContent);
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          setEditorState(EditorState.createWithContent(contentState));
        }
      } else {
        // Clear saved draft if user chooses not to restore
        localStorage.removeItem('draftTitle');
        localStorage.removeItem('draftContent');
      }
    }
  }, []);

  // Show format tooltip on text selection
  useEffect(() => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed() && editorRef.current) {
      setShowFormatTooltip(true);
    } else {
      setShowFormatTooltip(false);
    }
  }, [editorState]);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (title.trim() === '') {
      setMessage("Please enter a title for your blog post");
      return;
    }
    
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      setMessage("Please add some content to your blog post");
      return;
    }
    
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    
    // Convert the Draft.js content to HTML
    const htmlContent = stateToHTML(contentState);
    
    try {
      const response = await api.post(
        "/api/posts",
        {
          title,
          content: htmlContent,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setMessage(response.data.message);
      // Clear the saved draft after successful submission
      localStorage.removeItem('draftTitle');
      localStorage.removeItem('draftContent');
      setTitle("");
      setEditorState(EditorState.createEmpty());
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Failed to create blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const onAddLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setLinkSelection(selection);
      setShowLinkInput(true);
      
      // Pre-fill link URL if text looks like a URL
      const contentState = editorState.getCurrentContent();
      const selectedText = contentState.getBlockForKey(selection.getStartKey())
        .getText().slice(selection.getStartOffset(), selection.getEndOffset());
      
      if (selectedText.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/)) {
        if (!selectedText.startsWith('http')) {
          setLinkUrl(`https://${selectedText}`);
        } else {
          setLinkUrl(selectedText);
        }
      }
    } else {
      setMessage("Please select text to create a link.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const confirmLink = () => {
    if (linkUrl && linkSelection) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        { url: linkUrl }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      
      let newEditorState = EditorState.push(
        editorState,
        contentStateWithEntity,
        'create-entity'
      );
      
      newEditorState = RichUtils.toggleLink(
        newEditorState,
        linkSelection,
        entityKey
      );
      
      setEditorState(newEditorState);
      setShowLinkInput(false);
      setLinkUrl("");
    }
  };

  const insertTemplate = (template) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    
    // Insert template text at current cursor position
    const newContentState = Modifier.insertText(
      contentState,
      selection,
      template
    );
    
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-characters'
    );
    
    setEditorState(newEditorState);
  };

  // Define styles for the content blocks
  const styleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
      borderRadius: 4,
    },
    HIGHLIGHT: {
      backgroundColor: 'rgba(255, 235, 59, 0.3)',
    }
  };

  // Get the current block type
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  // Check if a given inline style is currently active
  const isStyleActive = (style) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(style);
  };

  // Templates for quick insertion
  const templates = [
    {
      name: "Introduction",
      text: "In this blog post, I'll discuss the important aspects of this topic and why you should care."
    },
    {
      name: "Conclusion",
      text: "To summarize the key points discussed in this article: "
    },
    {
      name: "Call to Action",
      text: "What do you think about this topic? Let me know in the comments below!"
    }
  ];
  
  return (
    <div className="bg-gradient-to-b from-emerald-900 to-teal-900 min-h-screen text-white flex items-center justify-center px-4 py-16">
      <div className="relative bg-gradient-to-br from-emerald-800/60 to-teal-800/60 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-emerald-700/30 w-full max-w-3xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => {
                if (editorState.getCurrentContent().hasText() || title) {
                  if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                    navigate('/');
                  }
                } else {
                  navigate('/');
                }
              }}
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
              <label className="block text-emerald-200 mb-2 font-medium">Content</label>
              
              {/* Templates Quick Insert */}
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="text-emerald-300 text-sm pt-2">Quick Insert:</span>
                {templates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertTemplate(template.text)}
                    className="text-sm bg-emerald-800/70 hover:bg-emerald-700/80 px-3 py-2 rounded-md transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
              
              {/* Rich Text Toolbar */}
              <div 
                ref={toolbarRef}
                className={`bg-emerald-800/70 rounded-t-lg border border-emerald-600/30 border-b-0 p-2 flex flex-wrap gap-1 md:gap-2 transition-all duration-200 z-10
                  ${isToolbarSticky ? 'sticky top-0 shadow-lg' : ''}`}
              >
                {/* Inline Style Controls */}
                <button 
                  type="button" 
                  onClick={() => toggleInlineStyle('BOLD')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${isStyleActive('BOLD') ? 'bg-emerald-600' : ''}`}
                  title="Bold (Ctrl+B)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => toggleInlineStyle('ITALIC')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${isStyleActive('ITALIC') ? 'bg-emerald-600' : ''}`}
                  title="Italic (Ctrl+I)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="4" x2="10" y2="4"></line>
                    <line x1="14" y1="20" x2="5" y2="20"></line>
                    <line x1="15" y1="4" x2="9" y2="20"></line>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => toggleInlineStyle('UNDERLINE')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${isStyleActive('UNDERLINE') ? 'bg-emerald-600' : ''}`}
                  title="Underline (Ctrl+U)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                    <line x1="4" y1="21" x2="20" y2="21"></line>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => toggleInlineStyle('STRIKETHROUGH')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${isStyleActive('STRIKETHROUGH') ? 'bg-emerald-600' : ''}`}
                  title="Strike Through"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <path d="M16 6a4 4 0 0 0-8 0v6"></path>
                    <path d="M8 18a4 4 0 0 0 8 0"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => toggleInlineStyle('CODE')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${isStyleActive('CODE') ? 'bg-emerald-600' : ''}`}
                  title="Code"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => toggleInlineStyle('HIGHLIGHT')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${isStyleActive('HIGHLIGHT') ? 'bg-emerald-600' : ''}`}
                  title="Highlight"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </button>
                <div className="h-6 mx-1 my-auto w-px bg-emerald-600/50"></div>
                
                {/* Block Type Controls */}
                <button 
                  type="button" 
                  onClick={() => toggleBlockType('unordered-list-item')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentBlockType === 'unordered-list-item' ? 'bg-emerald-600' : ''}`}
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
                  onClick={() => toggleBlockType('ordered-list-item')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentBlockType === 'ordered-list-item' ? 'bg-emerald-600' : ''}`}
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
                  onClick={() => toggleBlockType('blockquote')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentBlockType === 'blockquote' ? 'bg-emerald-600' : ''}`}
                  title="Quote"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => toggleBlockType('header-two')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentBlockType === 'header-two' ? 'bg-emerald-600' : ''}`}
                  title="H2 Heading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h8"></path>
                    <path d="M4 18V6"></path>
                    <path d="M12 18V6"></path>
                    <path d="M17 10h3"></path>
                    <path d="M17 6v12"></path>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => toggleBlockType('header-three')}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${currentBlockType === 'header-three' ? 'bg-emerald-600' : ''}`}
                  title="H3 Heading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h8"></path>
                    <path d="M4 18V6"></path>
                    <path d="M12 18V6"></path>
                    <path d="M17 12h3"></path>
                    <path d="M17 6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2"></path>
                    <path d="M17 18a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2"></path>
                  </svg>
                </button>
                <div className="h-6 mx-1 my-auto w-px bg-emerald-600/50"></div>
                
                {/* Link Controls */}
                <button 
                  type="button" 
                  onClick={onAddLink}
                  className={`p-2 rounded hover:bg-emerald-700 transition-colors ${showLinkInput ? 'bg-emerald-600' : ''}`}
                  title="Insert Link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
                
                {/* Clear Formatting */}
                <button 
                  type="button" 
                  onClick={() => {
                    const selection = editorState.getSelection();
                    if (!selection.isCollapsed()) {
                      // Remove all inline styles from selection
                      let newEditorState = editorState;
                      ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH', 'CODE', 'HIGHLIGHT'].forEach(style => {
                        newEditorState = RichUtils.toggleInlineStyle(newEditorState, style);
                      });
                      setEditorState(newEditorState);
                    }
                  }}
                  className="p-2 rounded hover:bg-emerald-700 transition-colors"
                  title="Clear Formatting"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l10 10-10 10-10-10 10-10z"/>
                    <path d="M8.5 8.5l7 7"/>
                    <path d="M15.5 8.5l-7 7"/>
                  </svg>
                </button>

                {/* Word Count */}
                <div className="ml-auto flex items-center text-xs text-emerald-300/80">
                  <span>{wordCount} words</span>
                </div>
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
                    onClick={confirmLink}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-r-lg transition-colors"
                  >
                    Insert
                  </button>
                </div>
              )}
              
              {/* Format Tooltip */}
              {showFormatTooltip && (
                <div className="fixed z-20 bg-emerald-800 shadow-lg rounded-lg p-1 flex gap-1">
                  <button 
                    onClick={() => toggleInlineStyle('BOLD')}
                    className={`p-1 rounded ${isStyleActive('BOLD') ? 'bg-emerald-600' : 'hover:bg-emerald-700'}`}
                  >
                    B
                  </button>
                  <button 
                    onClick={() => toggleInlineStyle('ITALIC')}
                    className={`p-1 rounded ${isStyleActive('ITALIC') ? 'bg-emerald-600' : 'hover:bg-emerald-700'}`}
                  >
                    I
                    </button>
<button 
  onClick={() => toggleInlineStyle('UNDERLINE')}
  className={`p-1 rounded ${isStyleActive('UNDERLINE') ? 'bg-emerald-600' : 'hover:bg-emerald-700'}`}
>
  U
</button>
<button 
  onClick={() => toggleInlineStyle('STRIKETHROUGH')}
  className={`p-1 rounded ${isStyleActive('STRIKETHROUGH') ? 'bg-emerald-600' : 'hover:bg-emerald-700'}`}
>
  S
</button>
<button 
  onClick={onAddLink}
  className={`p-1 rounded ${showLinkInput ? 'bg-emerald-600' : 'hover:bg-emerald-700'}`}
>
  🔗
</button>
</div>
)}

{/* Editor */}
<div 
  ref={editorContainerRef} 
  className="bg-emerald-900/50 rounded-b-lg border border-emerald-600/30 p-4 min-h-[300px] max-h-[600px] overflow-y-auto"
  onClick={() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }}
>
  <Editor
    ref={editorRef}
    editorState={editorState}
    onChange={setEditorState}
    handleKeyCommand={handleKeyCommand}
    customStyleMap={styleMap}
    placeholder="Start writing your blog post..."
    spellCheck={true}
  />
</div>
</div>

{message && (
  <div className="mt-2 text-sm text-emerald-300 animate-pulse">
    {message}
  </div>
)}

<div className="mt-8 flex justify-between items-center">
  <button
    type="button"
    onClick={() => {
      const shouldDiscard = window.confirm("Are you sure you want to discard this draft?");
      if (shouldDiscard) {
        localStorage.removeItem('draftTitle');
        localStorage.removeItem('draftContent');
        setTitle("");
        setEditorState(EditorState.createEmpty());
        setMessage("Draft discarded");
        setTimeout(() => setMessage(""), 1500);
      }
    }}
    className="px-5 py-3 bg-transparent hover:bg-emerald-800/50 text-emerald-300 border border-emerald-600/50 rounded-lg transition-colors duration-200"
  >
    Discard Draft
  </button>
  
  <button
    type="submit"
    disabled={isSubmitting}
    className={`px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg shadow-lg transition-all duration-200 ${
      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
    }`}
  >
    {isSubmitting ? (
      <span className="flex items-center">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Publishing...
      </span>
    ) : (
      "Publish Post"
    )}
  </button>
</div>

</form>
</div>
</div>
</div>
);
}

export default AddPost;