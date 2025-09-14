// src/components/volunteerComponents/VolunteerCommunityHub/VolunteerCommunityHub.tsx

import React, { useState } from "react";
import type { CommunityPost } from "../../types/Volunteer";

const initialPosts: CommunityPost[] = [
  {
    id: "1",
    author: "Admin",
    title: "Monthly Volunteer Spotlight",
    content: "This month, we highlight Jane Doe for her outstanding service!",
    date: "2025-09-10"
  },
  {
    id: "2",
    author: "Coordinator",
    title: "Upcoming Events Announcement",
    content: "Don’t miss the river cleanup event next weekend. More details inside.",
    date: "2025-09-12"
  },
  {
    id: "3",
    author: "Admin",
    title: "Volunteer Training Recap",
    content: "Our recent training went well. Here are some notes and photos.",
    date: "2025-09-14"
  }
  // etc.
];

const subCards = [
  { id: "a", title: "General Discussion", date: "1 day ago" },
  { id: "b", title: "Project Ideas", date: "2 days ago" },
  { id: "c", title: "Feedback & Suggestions", date: "3 days ago" },
  { id: "d", title: "Announcements", date: "4 days ago" },
  { id: "e", title: "Volunteer Spotlights", date: "1 week ago" }
];

interface Props {}

const VolunteerCommunityHub: React.FC<Props> = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);

  const handleNewPost = () => {
    const nextId = (posts.length + 1).toString();
    const newPost: CommunityPost = {
      id: nextId,
      author: "You",
      title: "New Community Post",
      content: "Here is your new post content.",
      date: new Date().toISOString().split("T")[0]
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Main Cards */}
      <div className="space-y-6">

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Community Hub</h2>
          <p className="text-gray-600">Welcome to the Ungageable Tech Community Hub</p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          {posts.map(post => (
            <div key={post.id} className="border-b last:border-b-0 pb-4 mb-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium text-gray-800">{post.title}</h3>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">By {post.author}</div>
              <div className="text-gray-700">{post.content}</div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              onClick={handleNewPost}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              + New Post
            </button>
          </div>
        </div>

      </div>

      {/* Sub-cards scrollable horizontally */}
      <div className="mt-8 overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {subCards.map(sc => (
            <div key={sc.id} className="min-w-[200px] bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="text-sm text-gray-500">{sc.date}</div>
              <div className="font-medium text-gray-800">{sc.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerCommunityHub;
