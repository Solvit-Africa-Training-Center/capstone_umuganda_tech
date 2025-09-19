import React, { useState, useEffect } from "react";
import api from "../../api/api";
import alert from "../../images/volunteer/alert.png";
import CardGrid from "./CardGrid";

interface Props {}

const VolunteerCommunityHub: React.FC<Props> = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    // Notifications endpoint not available - using mock data
    setIsLoading(false);
    setNotifications([]);
    setNotificationCount(0);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6  bg-white flex flex-col space-y-8 w-full">
      <div className="mb-6 flex flex-row bg-white items-end space-x-3">
        <div className="relative">
          <img className="text-right" src={alert} alt="Alert" />
          {isLoading ? (
            <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              ?
            </span>
          ) : notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
        <div className="flex-1">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded flex items-center space-x-2">
              <span>{error}</span>
              <button 
                onClick={fetchNotifications}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
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