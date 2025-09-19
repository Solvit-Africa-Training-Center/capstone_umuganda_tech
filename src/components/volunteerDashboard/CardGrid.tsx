import React, { useState, useEffect } from "react";
import Card from "./Card";
import api from "../../api/api";
import type { CardData } from "../../types/Volunteer";

const CardGrid: React.FC = () => {
  const [posts, setPosts] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/community/posts/');
      const postsData = Array.isArray(response.data) ? response.data : response.data.results || [];
      const cardsData = postsData.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author?.username || post.author || 'Community Member',
        date: post.created_at || post.date || new Date().toISOString(),
      }));
      setPosts(cardsData);
    } catch (error: any) {
      console.error('Error fetching community posts:', error);
      if (error.code === 'ERR_NETWORK' || error.response?.status === 502) {
        setError('Server temporarily unavailable.');
      } else {
        setError('Failed to load posts.');
      }
      // Show mock posts when API fails
      setPosts([
        {
          id: 1,
          title: "Welcome to UmugandaTech Community",
          content: "Join our community initiatives and make a difference in Rwanda's tech ecosystem. Share your ideas and collaborate with fellow volunteers.",
          author: "Community Team",
          date: new Date().toISOString()
        },
        {
          id: 2,
          title: "Tech Skills Workshop - React Development",
          content: "Upcoming workshop on React development for beginners. Learn modern web development techniques and build your first React application.",
          author: "Tech Lead",
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          title: "Community Outreach Program",
          content: "Join us in reaching out to local schools to introduce students to technology and programming. Make an impact in education.",
          author: "Outreach Coordinator",
          date: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 4,
          title: "Open Source Contribution Drive",
          content: "Let's contribute to open source projects together! Share your favorite projects and collaborate on meaningful contributions.",
          author: "Developer Advocate",
          date: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: 5,
          title: "Monthly Volunteer Meetup",
          content: "Join our monthly meetup to discuss ongoing projects, share experiences, and plan future initiatives. Networking and collaboration opportunities.",
          author: "Event Organizer",
          date: new Date(Date.now() - 345600000).toISOString()
        },
        {
          id: 6,
          title: "Digital Literacy Program",
          content: "Help us teach basic computer skills to community members. Your expertise can help bridge the digital divide in Rwanda.",
          author: "Program Manager",
          date: new Date(Date.now() - 432000000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      await api.post('/api/community/posts/', newPost);
      setNewPost({ title: '', content: '' });
      setShowCreateForm(false);
      fetchPosts();
    } catch (error: any) {
      console.error('Error creating post:', error);
      setSubmitError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading community posts...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchPosts} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Community Posts</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showCreateForm ? 'Cancel' : 'Create Post'}
        </button>
      </div>
      
      {showCreateForm && (
        <div className="mb-6 p-4 border rounded">
          <input
            type="text"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Post content"
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            className="w-full p-2 border rounded mb-2 h-24"
          />
          {submitError && (
            <div className="text-red-600 text-sm mb-2">{submitError}</div>
          )}
          <button 
            onClick={createPost}
            disabled={!newPost.title || !newPost.content || submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        {posts.length > 0 ? (
          posts.map((card) => (
            <Card key={card.id} data={card} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            {error ? 'Showing sample posts (server unavailable)' : 'No community posts available. Be the first to create one!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardGrid;
