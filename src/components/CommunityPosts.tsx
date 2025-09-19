import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, Heart, Plus, ChevronUp, Send, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { fetchPosts, createPost } from '../store/communitySlice';
import { communityAPI } from '../api/community';
import { useAuth } from '../hooks/useAuth';
import logo from '../images/Umuganda-removebg-preview 2.png';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    phone_number: string;
    first_name: string;
    last_name: string;
  };
}

interface PostType {
  id: number;
  title: string;
  description?: string;
  content: string;
  type: 'feedback' | 'suggestion' | 'discussion';
  user_name: string;
  user_id?: number;
  author?: number;
  author_phone?: string;
  user_phone?: string;
  location?: string;
  sector?: string;
  created_at: string;
  datetime?: string;
  upvotes_count: number;
  comments_count: number;
  has_upvoted: boolean;
}

const CommunityPosts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts = [], isLoading, error } = useSelector((state: RootState) => state.community);
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    sector: '',
    datetime: '',
    location: '',
    content: '',
    type: 'feedback' as 'feedback' | 'suggestion' | 'discussion'
  });
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [loadingComments, setLoadingComments] = useState<Record<number, boolean>>({});
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editPostData, setEditPostData] = useState({
    title: '',
    description: '',
    sector: '',
    datetime: '',
    location: '',
    content: '',
    type: 'feedback' as 'feedback' | 'suggestion' | 'discussion'
  });
  const [createError, setCreateError] = useState<string>('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');


  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);



  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    
    if (newPost.title.trim() && newPost.content.trim()) {
      try {
        const formattedPost = {
          ...newPost,
          datetime: newPost.datetime ? new Date(newPost.datetime).toISOString() : new Date().toISOString()
        };
        
        await dispatch(createPost(formattedPost)).unwrap();
        setNewPost({
          title: '',
          description: '',
          sector: '',
          datetime: '',
          location: '',
          content: '',
          type: 'feedback'
        });
        setShowCreateForm(false);
      } catch (error: any) {
        let errorMessage = 'Failed to create post';
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else {
            const fieldErrors = [];
            for (const [field, messages] of Object.entries(error.response.data)) {
              const message = Array.isArray(messages) ? messages[0] : messages;
              fieldErrors.push(`${field}: ${message}`);
            }
            errorMessage = fieldErrors.join(', ');
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setCreateError(errorMessage);
      }
    }
  };

  const handleUpvote = async (postId: number) => {
    try {
      await communityAPI.upvotePost(postId);
      dispatch(fetchPosts());
    } catch (error) {
      console.error('Failed to upvote post:', error);
    }
  };

  const handleToggleComments = async (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!comments[postId]) {
        setLoadingComments(prev => ({ ...prev, [postId]: true }));
        try {
          const postComments = await communityAPI.getPostComments(postId);
          setComments(prev => ({ ...prev, [postId]: Array.isArray(postComments) ? postComments : [] }));
        } catch (error) {
          console.error('Failed to load comments:', error);
          setComments(prev => ({ ...prev, [postId]: [] }));
        } finally {
          setLoadingComments(prev => ({ ...prev, [postId]: false }));
        }
      }
    }
  };

  const handleAddComment = async (postId: number) => {
    const content = newComment[postId]?.trim();
    if (!content) return;

    try {
      const comment = await communityAPI.createPostComment(postId, content);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      dispatch(fetchPosts());
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.content);
  };

  const handleUpdateComment = async (commentId: number) => {
    try {
      await communityAPI.updateComment(commentId, editCommentText);
      setEditingComment(null);
      setEditCommentText('');
      // Refresh comments
      const postComments = await communityAPI.getPostComments(expandedPost!);
      setComments(prev => ({ ...prev, [expandedPost!]: postComments }));
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await communityAPI.deleteComment(commentId);
        // Refresh comments
        const postComments = await communityAPI.getPostComments(expandedPost!);
        setComments(prev => ({ ...prev, [expandedPost!]: postComments }));
        dispatch(fetchPosts());
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleEditPost = (post: PostType) => {
    setEditingPost(post.id);
    setEditPostData({
      title: post.title,
      description: post.description || '',
      sector: post.sector || '',
      datetime: post.datetime ? new Date(post.datetime).toISOString().slice(0, 16) : '',
      location: post.location || '',
      content: post.content,
      type: post.type || 'feedback'
    });
  };

  const handleUpdatePost = async (postId: number) => {
    try {
      const formattedPost = {
        ...editPostData,
        datetime: editPostData.datetime ? new Date(editPostData.datetime).toISOString() : new Date().toISOString()
      };
      await communityAPI.updatePost(postId, formattedPost);
      setEditingPost(null);
      dispatch(fetchPosts());
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await communityAPI.deletePost(postId);
        dispatch(fetchPosts());
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Leader Header */}
      {user?.role?.toLowerCase() === 'leader' && (
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="UmugandaTech Logo" className="h-12 w-12" />
              <span className="text-xl font-bold text-primaryColor-900">UmugandaTech</span>
            </div>
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-primaryColor-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </NavLink>
          </div>
        </div>
      )}
      
      <div className={`max-w-5xl mx-auto px-6 ${user?.role?.toLowerCase() === 'leader' ? 'pt-8' : 'pt-24'} pb-12`}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Community Forum</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Connect, share ideas, and collaborate with your community members</p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primaryColor-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Loading discussions...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-6 py-4 rounded-r-lg mb-8 shadow-sm">
            <div className="flex items-center">
              <span className="font-medium">Error:</span>
              <span className="ml-2">{typeof error === 'string' ? error : 'Failed to load posts'}</span>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
                <p className="text-gray-600 mt-1">Join the conversation</p>
              </div>
              {user && (
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-primaryColor-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-primaryColor-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus size={22} />
                  <span className="font-medium">New Post</span>
                </button>
              )}
            </div>

            {/* Create Post Form */}
            {showCreateForm && (
              <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Share Your Thoughts</h3>
                
                {createError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {createError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Post title *"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                    required
                  />
                  
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({ ...newPost, type: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                  >
                    <option value="feedback">Feedback</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="discussion">Discussion</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Sector (e.g., Nyarugenge)"
                    value={newPost.sector}
                    onChange={(e) => setNewPost({ ...newPost, sector: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                  />
                  
                  <input
                    type="text"
                    placeholder="Location (e.g., Kigali Center)"
                    value={newPost.location}
                    onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Brief description"
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-primaryColor-900"
                />

                <input
                  type="datetime-local"
                  value={newPost.datetime}
                  onChange={(e) => setNewPost({ ...newPost, datetime: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-primaryColor-900"
                />
                
                <textarea
                  placeholder="Share your detailed feedback, suggestions, or start a discussion... *"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-32 resize-none focus:outline-none focus:border-primaryColor-900"
                  required
                />
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-primaryColor-900 text-white px-4 py-2 rounded-lg hover:bg-accent-900 transition-colors"
                  >
                    Post
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setCreateError('');
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Posts List */}
            {Array.isArray(posts) && posts.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No discussions yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share feedback or start a discussion!</p>
                {user && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-primaryColor-900 text-white px-6 py-2 rounded-lg hover:bg-accent-900 transition-colors"
                  >
                    Start Discussion
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Array.isArray(posts) && posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          {editingPost === post.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  value={editPostData.title}
                                  onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                                  placeholder="Title"
                                />
                                <select
                                  value={editPostData.type}
                                  onChange={(e) => setEditPostData({ ...editPostData, type: e.target.value as any })}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                                >
                                  <option value="feedback">Feedback</option>
                                  <option value="suggestion">Suggestion</option>
                                  <option value="discussion">Discussion</option>
                                </select>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  value={editPostData.sector}
                                  onChange={(e) => setEditPostData({ ...editPostData, sector: e.target.value })}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                                  placeholder="Sector"
                                />
                                <input
                                  type="text"
                                  value={editPostData.location}
                                  onChange={(e) => setEditPostData({ ...editPostData, location: e.target.value })}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                                  placeholder="Location"
                                />
                              </div>
                              <input
                                type="text"
                                value={editPostData.description}
                                onChange={(e) => setEditPostData({ ...editPostData, description: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                                placeholder="Description"
                              />
                              <textarea
                                value={editPostData.content}
                                onChange={(e) => setEditPostData({ ...editPostData, content: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:border-primaryColor-900"
                                placeholder="Content"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdatePost(post.id)}
                                  className="bg-primaryColor-900 text-white px-4 py-2 rounded-lg hover:bg-accent-900"
                                >
                                  Save Changes
                                </button>
                                <button
                                  onClick={() => setEditingPost(null)}
                                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Author Header */}
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primaryColor-900 to-primaryColor-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {post.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-gray-900">{post.user_name}</h4>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                      post.type === 'feedback' ? 'bg-blue-100 text-blue-800' :
                                      post.type === 'suggestion' ? 'bg-green-100 text-green-800' :
                                      'bg-purple-100 text-purple-800'
                                    }`}>
                                      {post.type}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()} • {new Date(post.created_at).toLocaleTimeString()}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditPost(post)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-primaryColor-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-primaryColor-300"
                                    title="Edit post"
                                  >
                                    <Edit3 size={14} />
                                    <span className="text-xs font-medium">Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors border border-gray-200 hover:border-red-300"
                                    title="Delete post"
                                  >
                                    <Trash2 size={14} />
                                    <span className="text-xs font-medium">Delete</span>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Post Content */}
                              <div className="space-y-4">
                                {/* Title */}
                                <div>
                                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Title:</span>
                                  <h3 className="text-xl font-bold text-gray-900 mt-1">{post.title}</h3>
                                </div>
                                
                                {/* Description */}
                                {post.description && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description:</span>
                                    <p className="text-gray-700 mt-1 leading-relaxed">{post.description}</p>
                                  </div>
                                )}
                                
                                {/* Location */}
                                {post.location && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Venue/Location:</span>
                                    <p className="text-gray-700 mt-1 flex items-center gap-2">
                                      <span className="text-primaryColor-900">📍</span>
                                      {post.location}
                                    </p>
                                  </div>
                                )}
                                
                                {/* Content */}
                                <div>
                                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Details:</span>
                                  <div className="text-gray-800 mt-1 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-primaryColor-900">
                                    {post.content}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleUpvote(post.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                              post.has_upvoted 
                                ? 'bg-primaryColor-100 text-primaryColor-900 border border-primaryColor-200' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-primaryColor-900'
                            }`}
                          >
                            <ChevronUp size={18} />
                            <span className="font-medium">{post.upvotes_count || 0}</span>
                            <span className="text-sm">Upvotes</span>
                          </button>
                          
                          <button
                            onClick={() => handleToggleComments(post.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          >
                            <MessageCircle size={18} />
                            <span className="font-medium">{post.comments_count || 0}</span>
                            <span className="text-sm">Comments</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {expandedPost === post.id && (
                      <div className="border-t border-gray-100 bg-gray-50">
                        <div className="p-6">
                          {user && (
                            <div className="mb-4">
                              <div className="flex gap-3">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  value={newComment[post.id] || ''}
                                  onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                />
                                <button
                                  onClick={() => handleAddComment(post.id)}
                                  className="bg-primaryColor-900 text-white px-4 py-3 rounded-lg hover:bg-accent-900 transition-colors"
                                >
                                  <Send size={16} />
                                </button>
                              </div>
                            </div>
                          )}

                          {loadingComments[post.id] ? (
                            <div className="text-center py-4">
                              <div className="w-6 h-6 border-2 border-primaryColor-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {!comments[post.id] || comments[post.id].length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                              ) : (
                                comments[post.id].map((comment) => (
                                  <div key={comment.id} className="bg-white p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-medium text-gray-800">
                                        {comment.user?.first_name} {comment.user?.last_name}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm">
                                          {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                        {user && user.id === comment.user?.id && (
                                          <div className="flex gap-1">
                                            <button
                                              onClick={() => handleEditComment(comment)}
                                              className="text-gray-400 hover:text-primaryColor-900 p-1"
                                              title="Edit comment"
                                            >
                                              <Edit3 size={12} />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteComment(comment.id)}
                                              className="text-gray-400 hover:text-red-600 p-1"
                                              title="Delete comment"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {editingComment === comment.id ? (
                                      <div className="space-y-2">
                                        <textarea
                                          value={editCommentText}
                                          onChange={(e) => setEditCommentText(e.target.value)}
                                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primaryColor-900 resize-none"
                                          rows={2}
                                        />
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleUpdateComment(comment.id)}
                                            className="bg-primaryColor-900 text-white px-3 py-1 rounded text-sm hover:bg-accent-900"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() => setEditingComment(null)}
                                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-gray-700">{comment.content}</p>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityPosts;