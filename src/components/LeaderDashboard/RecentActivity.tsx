import React from 'react';
import type { Activity } from '../../types/LeaderDashboard';
import activity1 from "../../images/leaderdash/Group1.png"
import activity2 from "../../images/leaderdash/Group2.png"
import activity3 from "../../images/leaderdash/Group3.png"
import activity4 from "../../images/leaderdash/Group4.png"
import activity5 from "../../images/leaderdash/Group5.png"


interface Props { activities: Activity[]; }
const activityImages = [activity5, activity4, activity3, activity2, activity1];

const RecentActivity: React.FC<Props> = ({ activities }) => (
  <div className="bg-white shadow p-4 rounded-md h-">
    <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
    <ul className="space-y-2 text-gray-700">
      {activities.map((act, idx) => (
        <li key={idx} className="flex items-start">
          <img src={activityImages[idx % activityImages.length]} alt="Activity" className="h-8 w-8 mt-1" />
          <div className="ml-2">
            <div>{act.description}</div>
            <div className="text-gray-400 text-sm">{act.timestamp}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
