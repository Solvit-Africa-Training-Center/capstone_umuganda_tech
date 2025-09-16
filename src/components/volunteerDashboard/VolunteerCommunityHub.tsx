import React, { useState } from "react";
import type { CommunityPost } from "../../types/Volunteer";
import  alert  from "../../images/volunteer/alert.png";
import CardGrid from "./CardGrid";


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
    <div className="p-6  bg-white flex flex-col space-y-8 w-full">
      <div className="mb-6 flex flex-row bg-white items-end space-x-3">
        <div className="">
        <img className="text-right" src={alert} alt="Alert" />
      </div>
      <div className="w-20"></div>
      </div>
      <div className="space-y-6">

        <div className="bg-white  p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to the UmugandaTech Community Hub.</h2>
          <p className="text-gray-600">
            Our projects are driven by you! This platform is where volunteers can propose and discuss ideas for new community initiatives.  Have an idea? Share it here!
          </p>
        </div>

       
    <CardGrid />

      </div>

    </div>
  );
};

export default VolunteerCommunityHub;
