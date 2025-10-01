import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import type { Project } from '../../types/api';

interface CalendarAnalyticsProps {
  projects: Project[];
  isLoading?: boolean;
}

const CalendarAnalytics: React.FC<CalendarAnalyticsProps> = ({ projects, isLoading }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getProjectsForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return projects.filter(project => {
      const projectDate = new Date(project.datetime);
      return projectDate.toDateString() === targetDate.toDateString();
    });
  };

  const upcomingProjects = projects.filter(project => {
    const projectDate = new Date(project.datetime);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return projectDate >= now && projectDate <= thirtyDaysFromNow;
  }).slice(0, 5);

  // Analytics calculations
  const completionRate = projects.length > 0 ? 
    Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100) : 0;
  
  const avgVolunteersPerProject = projects.length > 0 ? 
    Math.round(projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0) / projects.length) : 0;

  const monthlyProjects = projects.filter(project => {
    const projectDate = new Date(project.datetime);
    return projectDate.getMonth() === currentDate.getMonth() && 
           projectDate.getFullYear() === currentDate.getFullYear();
  }).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Calendar View */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Project Calendar</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-lg font-medium text-gray-800 min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayProjects = getProjectsForDate(day);
            const isToday = new Date().toDateString() === 
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            
            return (
              <div
                key={day}
                className={`h-10 flex items-center justify-center text-sm relative cursor-pointer hover:bg-gray-50 rounded ${
                  isToday ? 'bg-primaryColor-100 text-primaryColor-800 font-semibold' : 'text-gray-700'
                }`}
                onClick={() => dayProjects.length > 0 && navigate('/my-projects')}
              >
                {day}
                {dayProjects.length > 0 && (
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-primaryColor-600 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primaryColor-600 rounded-full"></div>
            <span>Project scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primaryColor-100 rounded-full"></div>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Analytics & Upcoming Events */}
      <div className="space-y-6">
        {/* Analytics Cards */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primaryColor-600" />
            <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{completionRate}%</p>
              <p className="text-sm text-blue-600">Completion Rate</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{avgVolunteersPerProject}</p>
              <p className="text-sm text-green-600">Avg Volunteers</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{monthlyProjects}</p>
              <p className="text-sm text-purple-600">This Month</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{upcomingProjects.length}</p>
              <p className="text-sm text-orange-600">Upcoming</p>
            </div>
          </div>
        </div>

        {/* Upcoming Projects */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Upcoming Projects</h3>
            <button
              onClick={() => navigate('/my-projects')}
              className="text-primaryColor-600 hover:text-primaryColor-800 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {upcomingProjects.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No upcoming projects</p>
              <p className="text-sm text-gray-500">Projects in the next 30 days will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingProjects.map((project) => {
                const daysUntil = Math.ceil(
                  (new Date(project.datetime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{project.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(project.datetime).toLocaleDateString()} • {project.location}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        daysUntil <= 3 ? 'bg-red-100 text-red-800' :
                        daysUntil <= 7 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {daysUntil === 0 ? 'Today' : 
                         daysUntil === 1 ? 'Tomorrow' : 
                         `${daysUntil} days`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarAnalytics;