import React from "react";
import { useState } from 'react';
import type { CardData } from "../../types/Volunteer";
import { MessageCircle, Share2, Heart } from 'lucide-react';

type CardProps = {
  data: CardData;
};

const Card: React.FC<CardProps> = ({ data }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);
  
  
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    console.log('Opening comments...');
  };

  const handleShare = () => {
    console.log('Opening share menu...');
  };

  const handleVote = () => {
    console.log('Vote submitted!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-[676px] flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center px-4 py-3">
        <img
          src={data.avatarUrl}
          alt={`${data.author} avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-800">{data.author}</p>
          <p className="text-xs text-gray-500">{data.timeAgo}</p>
        </div>
      </div>
        <div className="text-h2 pr-5">...</div>
      </div>

      {/* Content */}
      <div className="px-4 py-2 flex-grow">
        <p className="text-gray-700 text-base">{data.content}</p>
      </div>
      <div className="px-4 py-3 bg-white flex justify-between items-center text-sm text-gray-600">
        <div className="flex space-x-4">
          <span>{data.commentsCount} Comments</span>
          <span>{data.likesCount} Likes</span>
        </div>
        <div>
          <p className="px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600">
            {data.votesCount} Votes
          </p>
        </div>
      </div>
      <div>
        


{ /* Action buttons */}
    <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200 max-w-2xl mx-auto">
      {/* Comments */}
      <button 
        onClick={handleComment}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Comments</span>
      </button>

      {/* Share */}
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        <Share2 className="w-5 h-5" />
        <span className="text-sm font-medium">Share</span>
      </button>

      {/* Likes */}
      <button 
        onClick={handleLike}
        className={`flex items-center gap-2 transition-colors duration-200 ${
          liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
        }`}
      >
        <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">Likes</span>
      </button>

      {/* Vote Button */}
      <button 
        onClick={handleVote}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Vote
      </button>
    </div>
      </div>
    </div>
  );
};

export default Card;
