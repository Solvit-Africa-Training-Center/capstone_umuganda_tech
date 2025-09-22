import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Calendar, MapPin, User, TrendingUp } from 'lucide-react';
import { communityAPI } from '../api/community';
import type { Post } from '../types/api';

interface VotingPost extends Post {
  upvote_count: number;
  is_upvoted: boolean;
  comment_count: number;
}

const CommunityVoting: React.FC = () => {
  const [posts, setPosts] = useState<VotingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingPosts, setVotingPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchVotingPosts();
  }, []);

  const fetchVotingPosts = async () => {
    try {
      setIsLoading(true);
      const data = await communityAPI.getPosts({ page_size: 20 });
      // Filter for suggestion type posts that can be voted on
      const suggestions = (data.results || []).filter(post => post.type === 'suggestion');
      setPosts(suggestions as VotingPost[]);
    } catch (error) {
      console.error('Failed to fetch voting posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (postId: number) => {
    if (votingPosts.has(postId)) return;
    
    setVotingPosts(prev => new Set(prev).add(postId));
    
    try {
      const result = await communityAPI.upvotePost(postId);
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_upvoted: result.upvoted,
              upvote_count: result.upvoted 
                ? post.upvote_count + 1 
                : post.upvote_count - 1
            }
          : post
      ));
    } catch (error) {
      console.error('Failed to upvote post:', error);
    } finally {
      setVotingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const PostCard: React.FC<{ post: VotingPost }> = ({ post }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
          <p className="text-gray-600 mb-3 line-clamp-3">{post.content}</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Suggestion
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
        {post.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {post.location}
          </div>
        )}
        {post.datetime && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.datetime).toLocaleDateString()}
          </div>
        )}
        <div className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          {post.author_name}
        </div>
        <div className="flex items-center">
          <MessageSquare className="w-4 h-4 mr-1" />
          {post.comment_count || 0} comments
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => handleUpvote(post.id)}
          disabled={votingPosts.has(post.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            post.is_upvoted
              ? 'bg-primaryColor-100 text-primaryColor-700'
              : 'bg-gray-100 text-gray-700 hover:bg-primaryColor-50 hover:text-primaryColor-600'
          } disabled:opacity-50`}
        >
          {votingPosts.has(post.id) ? (
            <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ThumbsUp className={`w-4 h-4 ${post.is_upvoted ? 'fill-current' : ''}`} />
          )}
          <span className="font-medium">{post.upvote_count || 0}</span>
          <span className="text-sm">
            {post.is_upvoted ? 'Supported' : 'Support'}
          </span>
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>
            {post.upvote_count > 10 ? 'Popular' : 
             post.upvote_count > 5 ? 'Gaining Support' : 'New Idea'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Community Voting</h2>
        <p className="text-gray-600">
          Vote on community suggestions to help prioritize which projects should be implemented next.
          Your voice matters in shaping our community's future!
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community suggestions...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <ThumbsUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Suggestions Yet</h3>
          <p className="text-gray-600">
            Be the first to suggest a community project! Share your ideas in the community posts.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityVoting;