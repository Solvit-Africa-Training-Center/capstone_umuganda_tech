import React from 'react';
import Sidebar from '../components/LeaderDashboard/Sidebar';
import HeaderCards from '../components/LeaderDashboard/HeaderCards';
import RecentActivity from '../components/LeaderDashboard/RecentActivity';
import UpcomingCalendar from '../components/LeaderDashboard/UpcomingCalendar';
import NavBar from '../components/LeaderDashboard/TopNav';
import type { StatCard, Activity } from '../types/LeaderDashboard';

const stats: StatCard[] = [
  { label: 'Total Active Projects', value: 12 },
  { label: 'Projects Behind Schedule', value: 3, status: 'warning' },
  { label: 'Community Contribution', value: 87 },
  { label: 'Budget Health', value: 'Good', status: 'good' },
];

const activities: Activity[] = [
  { description: 'New team assigned and project created “UmugandaApp”', timestamp: '2 hours ago' },
  { description: 'User “Evelyn Mukasa” assigned to Order Management', timestamp: '5 hours ago' },
  { description: 'Project “Smart Home Project” is now behind schedule', timestamp: '1 day ago' },
  { description: 'User “Jean Habimana” completed the “Design” task', timestamp: '2 days ago' },
  { description: 'Report “Q2 Project Analysis” generated and downloaded', timestamp: '3 days ago' },
];

const deadlines = [
  new Date(),
  new Date(new Date().setDate(new Date().getDate() + 3)),
  new Date(new Date().setDate(new Date().getDate() + 7)),
];

const Dashboard: React.FC = () => (
  <div className="flex min-h-screen bg-[#EFEDED]">
    <Sidebar />
    <main className="flex-1 p-6 overflow-auto">
        <NavBar/>
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        Welcome back, Francis!
      </h1>
      <HeaderCards stats={stats} />
      <div className="mt-6 flex md:flex-row flex-col sm:flex-col  justify-between">
        <RecentActivity activities={activities} />
        <UpcomingCalendar deadlines={deadlines} />
      </div>
    </main>
  </div>
);

export default Dashboard;
