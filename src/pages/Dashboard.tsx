import React from 'react';
import HeaderCards from '../components/LeaderDashboard/HeaderCards';
import UpcomingCalendar from '../components/LeaderDashboard/UpcomingCalendar';
import NavBar from '../components/LeaderDashboard/TopNav';
import type { StatCard } from '../types/LeaderDashboard';

const stats: StatCard[] = [
  { label: 'Total Active Projects', value: 12 },
  { label: 'Projects Behind Schedule', value: 3, status: 'warning' },
  { label: 'Community Contribution', value: 87 },
  { label: 'Budget Health', value: 'Good', status: 'good' },
];

const deadlines = [
  new Date(),
  new Date(new Date().setDate(new Date().getDate() + 3)),
  new Date(new Date().setDate(new Date().getDate() + 7)),
];

const Dashboard: React.FC = () => (
  <div className="flex min-h-screen bg-[#EFEDED]">
    <main className="flex-1 p-6 overflow-auto">
        <NavBar/>
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        Welcome back, Francis!
      </h1>
      <HeaderCards stats={stats} />
      <div className="mt-6 flex md:flex-row flex-col sm:flex-col  justify-between">
        <UpcomingCalendar deadlines={deadlines} />
      </div>
    </main>
  </div>
);

export default Dashboard;
