import React, { useState } from 'react';
import { Clock, CheckSquare, Users, TrendingUp, ChevronDown } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, type TooltipItem, type Tick } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { Context } from 'chartjs-plugin-datalabels';

// Register the components Chart.js needs to render the charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Interfaces for data types
interface Volunteer {
  name: string;
  projectName: string;
  checkInTime: string;
  status: 'In Progress' | 'Completed';
}

interface Project {
  name: string;
  progress: number;
}

interface Skill {
  name: string;
  percentage: number;
  color: string;
}

interface Milestone {
  name: string;
  date: string;
  description: string;
}

const LiveParticipantsDashboard = () => {
  const [activeVolunteers] = useState(45);
  const [totalProjects] = useState(5);
  const [totalVolunteerHours] = useState(180);
  const [newParticipants] = useState(62);

  const projectsData: Project[] = [
    { name: 'Street Cleaning', progress: 85 },
    { name: 'Community Garden', progress: 100 },
    { name: 'Literacy Program', progress: 75 },
  ];

  const recentCheckIns: Volunteer[] = [
    { name: 'Alice Muhartana', projectName: 'Park Cleanup', checkInTime: 'Just now', status: 'Completed' },
    { name: 'David Kevizana', projectName: 'Health Outreach', checkInTime: '2min ago', status: 'Completed' },
    { name: 'Sarah Urutuzi', projectName: 'Community Garden', checkInTime: '5 min ago', status: 'In Progress' },
    { name: 'John Mugisha', projectName: 'School Renovation', checkInTime: '10 min ago', status: 'Completed' },
  ];

  const milestones: Milestone[] = [
    { name: 'Phase 2 Completion', date: 'Oct. 25, 2025', description: 'Completion of interior plastering and painting' },
    { name: 'Harvest Festival Prep', date: 'Nov. 10, 2025', description: 'Final planning and volunteer assignments for annual harvest festival.' },
    { name: 'Mid-term Report', date: '', description: 'Submission of mid-term stakeholder report' },
  ];

  const skillsData: Skill[] = [
    { name: 'Construction', percentage: 30, color: '#2C7BE5' },
    { name: 'Gardening', percentage: 25, color: '#50CD89' },
    { name: 'Teaching', percentage: 15, color: '#FFD15F' },
    { name: 'Medical Assistance', percentage: 10, color: '#F64E60' },
    { name: 'Other', percentage: 20, color: '#B5B5C3' },
  ];

  // Bar Chart Data & Options
  const barChartData = {
    labels: projectsData.map(project => project.name),
    datasets: [
      {
        label: 'Progress (%)',
        data: projectsData.map(project => project.progress),
        backgroundColor: '#50CD89',
        borderRadius: 4,
        barThickness: 30,
      },
    ],
  };

 const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'bar'>) => `${context.raw}%`,
      },
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      beginAtZero: true,
      max: 100,
      ticks: {
        // Change the type of 'value' from 'Tick' to 'any'
        callback: (value: any) => `${value}%`, 
      },
      grid: { color: '#E2E8F0' },
    },
    x: {
      type: 'category' as const,
      grid: { display: false },
    },
  },
};
  // Doughnut Chart Data & Options
  const pieChartData = {
    labels: skillsData.map(skill => skill.name),
    datasets: [
      {
        data: skillsData.map(skill => skill.percentage),
        backgroundColor: skillsData.map(skill => skill.color),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

 const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '80%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'pie'>) => `${context.label}: ${context.raw}%`,
      },
    },
    datalabels: {
      color: '#ffffff',
      formatter: (value: number) => `${value}%`,
      anchor: 'center' as const,
      align: 'center' as const,
      font: {
        weight: 'bold' as const, // This is the fix
        size: 12,
      },
      display: (context: Context) => {
        const dataPoint = context.dataset.data[context.dataIndex];
        if (typeof dataPoint === 'number') {
          return dataPoint > 5;
        }
        return false;
      },
    },
  },
};

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Live Participants Dashboard</h1>
        <span className="text-sm text-gray-500">Last updated: 1:29 PM</span>
      </header>

      {/* Key Metrics Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm mb-2">Active volunteers</div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900 mr-2">{activeVolunteers}</span>
            <Users className="text-green-500 h-6 w-6" />
          </div>
          <p className="text-green-600 text-sm mt-1">Currently on-site</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm mb-2">Projects</div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900 mr-2">{totalProjects}</span>
            <CheckSquare className="text-blue-500 h-6 w-6" />
          </div>
          <p className="text-gray-600 text-sm mt-1">Across all locations</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm mb-2">Hours today</div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900 mr-2">{totalVolunteerHours}h</span>
            <Clock className="text-yellow-500 h-6 w-6" />
          </div>
          <p className="text-gray-600 text-sm mt-1">Total volunteer hours</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm mb-2">Check-ins today</div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900 mr-2">{newParticipants}</span>
            <TrendingUp className="text-purple-500 h-6 w-6" />
          </div>
          <p className="text-gray-600 text-sm mt-1">New participant entries</p>
        </div>
      </section>

      {/* Projects and Skills Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Progress</h2>
          <div style={{ height: '200px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skill Distribution</h2>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
            <div className="mt-4 md:mt-0 md:ml-8">
              {skillsData.map((skill, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: skill.color }}></div>
                  <span className="text-sm text-gray-700">{skill.name}</span>
                  <span className="ml-2 text-sm font-semibold text-gray-900">{skill.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Check-ins/Check-outs Table */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Check-ins/Check-outs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCheckIns.map((checkin, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{checkin.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{checkin.projectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{checkin.checkInTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        checkin.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {checkin.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upcoming Milestones Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-md font-semibold text-gray-800 mb-2">{milestone.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{milestone.date}</p>
              <p className="text-gray-600 text-sm">{milestone.description}</p>
              <div className="mt-4">
                <button className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center">
                  View Details
                  <ChevronDown className="ml-1 w-4 h-4 transform rotate-[-90deg]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LiveParticipantsDashboard;