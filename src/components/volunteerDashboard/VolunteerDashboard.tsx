import React, { useState } from "react";
import type { EventItem } from "../../types/Volunteer";
import { User, Users, BarChart3, CheckCircle } from "lucide-react";

interface Props {
  volunteerName: string;
}

const sampleEvents: EventItem[] = [
  {
    id: "1",
    title: "Community Garden Project",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=150&fit=crop&crop=center",
    date: "Today",
    participants: 25,
    status: "Active"
  },
  {
    id: "2",
    title: "Beach Cleanup Drive",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=200&h=150&fit=crop&crop=center",
    date: "Yesterday",
    participants: 18,
    status: "Completed"
  },
  {
    id: "3",
    title: "Senior Care Visit",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=150&fit=crop&crop=center",
    date: "2 days ago",
    participants: 12,
    status: "Completed"
  },
  {
    id: "4",
    title: "Food Bank Distribution",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=200&h=150&fit=crop&crop=center",
    date: "3 days ago",
    participants: 30,
    status: "Completed"
  },
  {
    id: "5",
    title: "Children Book Reading",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop&crop=center",
    date: "4 days ago",
    participants: 15,
    status: "Completed"
  },
  {
    id: "6",
    title: "Youth Sports Program",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop&crop=center",
    date: "5 days ago",
    participants: 22,
    status: "Completed"
  }
  // etc.
];

const subCards = [
  { id: "a", title: "Ongoing Projects", status: "Active" },
  { id: "b", title: "Completed Projects", status: "Completed" },
  { id: "c", title: "Upcoming Events", status: "Upcoming" },
  { id: "d", title: "Volunteering Hours", status: "" },
  { id: "e", title: "Team Leaderboard", status: "" }
];

const VolunteerDashboard: React.FC<Props> = ({ volunteerName }) => {
  const [events] = useState<EventItem[]>(sampleEvents);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* Greeting & main stats cards */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Hello, {volunteerName}</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Browse Projects
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-800">{events.length}</p>
            <p className="text-sm text-gray-600">Events This Month</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Users size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-800">1,247</p>
            <p className="text-sm text-gray-600">Hours Volunteered</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <BarChart3 size={24} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-800">24</p>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <CheckCircle size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Sub-cards scrollable horizontally */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2 mt-4">
          {subCards.map(sc => (
            <div key={sc.id} className="min-w-[180px] bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="font-medium text-gray-800">{sc.title}</div>
              {sc.status && (
                <div className="mt-1 text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-600">
                  {sc.status}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent events / activities grid that is scrollable */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 mt-4 pb-4">
          {events.map(event => (
            <div key={event.id} className="min-w-[240px] bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gray-200">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-medium text-gray-800">{event.title}</h3>
                <p className="text-xs text-gray-500">{event.date}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{event.participants} vols</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {event.status}
                  </span>
                </div>
                <button className="mt-2 w-full text-green-500 text-xs font-medium py-1 hover:bg-green-50 rounded">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default VolunteerDashboard;
