import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, Heart, Plus, ChevronUp, Send, Trash2, Edit3, ArrowLeft, Users, Lightbulb, MessageSquare, Sparkles, Filter, Search, TrendingUp } from 'lucide-react';
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
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');


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
          type: 'discussion'
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

  // Filter and sort posts
  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    const matchesType = filterType === 'all' || post.type === filterType;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'popular') return (b.upvotes_count || 0) - (a.upvotes_count || 0);
    if (sortBy === 'discussed') return (b.comments_count || 0) - (a.comments_count || 0);
    return 0;
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primaryColor-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primaryColor-600 via-primaryColor-700 to-primaryColor-800 rounded-3xl p-12 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative text-center text-white">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Community Hub</h1>
                <div className="flex items-center justify-center gap-2 text-primaryColor-100">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-lg font-medium">Connect • Share • Grow</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
            <p className="text-xl text-primaryColor-100 max-w-3xl mx-auto leading-relaxed">
              Join meaningful conversations, share your experiences, and connect with fellow community members making a difference through Umuganda
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{posts?.length || 0}</div>
                <div className="text-primaryColor-200 text-sm font-medium">Active Discussions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{filteredPosts.reduce((sum, post) => sum + (post.comments_count || 0), 0)}</div>
                <div className="text-primaryColor-200 text-sm font-medium">Total Comments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{filteredPosts.reduce((sum, post) => sum + (post.upvotes_count || 0), 0)}</div>
                <div className="text-primaryColor-200 text-sm font-medium">Community Upvotes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="relative group">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primaryColor-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search discussions, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primaryColor-600 focus:ring-4 focus:ring-primaryColor-100 w-80 transition-all duration-200 bg-white/70"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primaryColor-600 focus:ring-4 focus:ring-primaryColor-100 bg-white/70 font-medium transition-all duration-200"
              >
                <option value="all">🌟 All Discussions</option>
                <option value="discussion">🗣️ General Discussion</option>
                <option value="feedback">💬 Project Feedback</option>
                <option value="suggestion">💡 Ideas & Suggestions</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primaryColor-600 focus:ring-4 focus:ring-primaryColor-100 bg-white/70 font-medium transition-all duration-200"
              >
                <option value="recent">🕒 Most Recent</option>
                <option value="popular">🔥 Most Popular</option>
                <option value="discussed">💬 Most Discussed</option>
              </select>
            </div>
            
            {user && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-primaryColor-600 to-primaryColor-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:from-primaryColor-700 hover:to-primaryColor-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Start Discussion</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-primaryColor-50 px-4 py-2 rounded-lg">
                <Filter className="w-4 h-4 text-primaryColor-600" />
                <span className="text-sm font-medium text-primaryColor-800">Showing {filteredPosts.length} of {posts?.length || 0} discussions</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{posts?.length || 0} active conversations</span>
              </div>
            </div>
          </div>
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
                  className="bg-primaryColor-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-primaryColor-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <MessageSquare size={20} />
                  <span className="font-medium">New Discussion</span>
                </button>
              )}
            </div>


            {/* Create Post Form */}
            {showCreateForm && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primaryColor-100 rounded-full">
                    <Plus className="w-6 h-6 text-primaryColor-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Start a Discussion</h3>
                </div>
                
                <form onSubmit={handleCreatePost}>
                
                {createError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {createError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Discussion topic or question *"
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
                    <option value="discussion">🗣️ General Discussion</option>
                    <option value="feedback">💬 Project Feedback</option>
                    <option value="suggestion">💡 Ideas & Suggestions</option>
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
                  placeholder="Share your thoughts, ask questions, or start a meaningful discussion about Umuganda activities... *"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-32 resize-none focus:outline-none focus:border-primaryColor-900"
                  required
                />
                
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-primaryColor-600 text-white px-6 py-3 rounded-xl hover:bg-primaryColor-700 transition-colors font-medium flex items-center gap-2 shadow-lg"
                    >
                      <MessageSquare size={16} />
                      Start Discussion
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setCreateError('');
                      }}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-xl text-center border border-white/50">
                <div className="w-24 h-24 bg-gradient-to-br from-primaryColor-100 to-primaryColor-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-primaryColor-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No discussions found</h3>
                <p className="text-gray-600 mb-6 text-lg">Be the first to share your thoughts or start a meaningful conversation!</p>
                {user && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-primaryColor-600 to-primaryColor-700 text-white px-8 py-4 rounded-xl hover:from-primaryColor-700 hover:to-primaryColor-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    Start Your First Discussion
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden group hover:scale-[1.02] hover:bg-white">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
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
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-primaryColor-600 to-primaryColor-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                  {post.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-gray-900 text-lg">{post.user_name}</h4>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${
                                      post.type === 'feedback' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                      post.type === 'suggestion' ? 'bg-green-50 text-green-700 border-green-200' :
                                      'bg-purple-50 text-purple-700 border-purple-200'
                                    }`}>
                                      {post.type === 'feedback' ? '💬' : post.type === 'suggestion' ? '💡' : '👥'}
                                      {post.type.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <span>📅 {new Date(post.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>🕒 {new Date(post.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {user && (user.id === post.user_id || user.id === post.author) && (
                                    <>
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
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Post Content */}
                              <div className="space-y-5">
                                {/* Title */}
                                <div className="bg-gradient-to-r from-primaryColor-50 to-primaryColor-100 p-4 rounded-xl border-l-4 border-primaryColor-600">
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h3>
                                  {post.description && (
                                    <p className="text-gray-700 leading-relaxed">{post.description}</p>
                                  )}
                                </div>
                                
                                {/* Location */}
                                {post.location && (
                                  <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                      <span className="text-blue-600">📍</span>
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-blue-800">Location</span>
                                      <p className="text-blue-700 font-semibold">{post.location}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Content */}
                                <div className="bg-white border-2 border-gray-100 rounded-xl p-5">
                                  <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-800 leading-relaxed text-lg">{post.content}</p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpvote(post.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                              post.has_upvoted 
                                ? 'bg-primaryColor-600 text-white shadow-lg transform scale-105' 
                                : 'bg-gray-100 text-gray-700 hover:bg-primaryColor-100 hover:text-primaryColor-700 hover:shadow-md'
                            }`}
                          >
                            <ChevronUp size={18} className={post.has_upvoted ? 'animate-bounce' : ''} />
                            <span className="font-bold">{post.upvotes_count || 0}</span>
                            <span className="text-sm">{post.has_upvoted ? 'Upvoted' : 'Upvote'}</span>
                          </button>
                          
                          <button
                            onClick={() => handleToggleComments(post.id)}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-md transition-all duration-200 font-medium"
                          >
                            <MessageCircle size={18} />
                            <span className="font-bold">{post.comments_count || 0}</span>
                            <span className="text-sm">{expandedPost === post.id ? 'Hide' : 'Comments'}</span>
                          </button>
                          
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 font-medium">
                              {((post.upvotes_count || 0) + (post.comments_count || 0))} interactions
                            </span>
                          </div>
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