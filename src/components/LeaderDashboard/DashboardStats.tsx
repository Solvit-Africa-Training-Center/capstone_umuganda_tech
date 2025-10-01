import React from 'react';
import { FolderOpen, Users, Clock, Award, Calendar, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import type { LeaderDashboardStats } from '../../types/api';

interface DashboardStatsProps {
  stats: LeaderDashboardStats['status'];
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  const combinedCards = [
    {
      title: 'Project Overview',
      icon: FolderOpen,
      bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      metrics: [
        { label: 'Total Projects', value: stats.total_projects, color: 'text-blue-800' },
        { label: 'Active Projects', value: stats.active_projects, color: 'text-green-700' },
        { label: 'Completed', value: stats.completed_projects, color: 'text-purple-700' },
        { label: 'Cancelled', value: stats.cancelled_projects, color: 'text-red-600' }
      ]
    },
    {
      title: 'Community Impact',
      icon: Users,
      bgGradient: 'bg-gradient-to-br from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      metrics: [
        { label: 'Total Volunteers', value: stats.total_volunteers, color: 'text-green-800' },
        { label: 'Certificates Issued', value: stats.certificates_issued, color: 'text-orange-700' },
        { label: 'Attendance Rate', value: `${stats.attendance_rate}%`, color: 'text-indigo-700' }
      ]
    },
    {
      title: 'Upcoming Activities',
      icon: Calendar,
      bgGradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      metrics: [
        { label: 'Deadlines (30 days)', value: stats.upcoming_deadlines, color: 'text-red-700' },
        { label: 'Active Projects', value: stats.active_projects, color: 'text-green-700' },
        { label: 'Success Rate', value: `${Math.round((stats.completed_projects / (stats.total_projects || 1)) * 100)}%`, color: 'text-purple-700' }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {combinedCards.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:scale-105">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`${card.bgGradient} p-4 rounded-2xl shadow-lg`}>
              <card.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
              <p className="text-gray-600 text-sm">Key metrics overview</p>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="space-y-6">
            {card.metrics.map((metric, metricIndex) => (
              <div key={metricIndex} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className={`mt-6 pt-6 border-t border-gray-200 ${card.bgColor} rounded-xl p-4`}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Overall Performance</span>
              <span className={`font-bold ${card.metrics[0].color}`}>
                {index === 0 ? `${Math.round((stats.active_projects / (stats.total_projects || 1)) * 100)}%` :
                 index === 1 ? `${stats.attendance_rate}%` :
                 `${Math.round((stats.completed_projects / (stats.total_projects || 1)) * 100)}%`} Active
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                  index === 1 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  'bg-gradient-to-r from-orange-400 to-orange-600'
                }`}
                style={{ 
                  width: `${index === 0 ? Math.round((stats.active_projects / (stats.total_projects || 1)) * 100) :
                          index === 1 ? stats.attendance_rate :
                          Math.round((stats.completed_projects / (stats.total_projects || 1)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;