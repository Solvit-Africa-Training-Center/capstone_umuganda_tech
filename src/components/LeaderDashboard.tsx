import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Plus, 
  FolderOpen, 
  Users, 
  TrendingUp, 
  Calendar, 
  QrCode, 
  BarChart3, 
  Clock,
  Award,
  MessageSquare,
  Bell
} from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { projectsAPI } from '../api/projects';
import { useAuth } from '../hooks/useAuth';
import NotificationCenter from './NotificationCenter';
import type { Project } from '../types/api';

const LeaderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { dashboardStats } = useSelector((state: RootState) => state.projects);
  
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [leaderStats, setLeaderStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalVolunteers: 0,
    totalHours: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchLeaderData();
  }, []);

  const fetchLeaderData = async () => {
    try {
      setIsLoading(true);
      const projects = await projectsAPI.getMyProjects();
      setMyProjects(projects);
      
      // Calculate leader-specific stats
      const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'ongoing' || p.status === 'planned').length,
        totalVolunteers: projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0),
        totalHours: projects.reduce((sum, p) => sum + (p.total_hours || 0), 0)
      };
      setLeaderStats(stats);
    } catch (error) {
      console.error('Failed to fetch leader data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create Project',
      description: 'Start a new community initiative',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => navigate('/create-project')
    },
    {
      title: 'My Projects',
      description: 'Manage your projects',
      icon: FolderOpen,
      color: 'bg-green-500',
      action: () => navigate('/my-projects')
    },
    {
      title: 'Generate QR',
      description: 'Create attendance QR codes',
      icon: QrCode,
      color: 'bg-purple-500',
      action: () => navigate('/my-projects')
    },
    {
      title: 'Community',
      description: 'Engage with volunteers',
      icon: MessageSquare,
      color: 'bg-orange-500',
      action: () => navigate('/community')
    }
  ];

  const recentProjects = myProjects.slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primaryColor-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.first_name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your community projects and track impact
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-600 hover:text-primaryColor-900 transition-colors"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={() => navigate('/create-project')}
                className="flex items-center gap-2 bg-primaryColor-900 text-white px-6 py-3 rounded-lg hover:bg-accent-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Leader Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Projects</p>
                <p className="text-3xl font-bold text-gray-800">{leaderStats.totalProjects}</p>
                <p className="text-sm text-green-600">{leaderStats.activeProjects} active</p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                <p className="text-3xl font-bold text-gray-800">{leaderStats.totalVolunteers}</p>
                <p className="text-sm text-blue-600">Across all projects</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Community Hours</p>
                <p className="text-3xl font-bold text-gray-800">{leaderStats.totalHours}h</p>
                <p className="text-sm text-purple-600">Impact generated</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Rank</p>
                <p className="text-3xl font-bold text-gray-800">#12</p>
                <p className="text-sm text-orange-600">Top leader</p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`${action.color} p-2 rounded-lg`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
              <button
                onClick={() => navigate('/my-projects')}
                className="text-primaryColor-900 hover:text-accent-900 text-sm font-medium"
              >
                View All
              </button>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No projects yet</p>
                <button
                  onClick={() => navigate('/create-project')}
                  className="bg-primaryColor-900 text-white px-6 py-2 rounded-lg hover:bg-accent-900 transition-colors"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{project.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.datetime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.volunteer_count || 0}/{project.required_volunteers}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        project.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/project/${project.id}/attendance`);
                        }}
                        className="p-2 text-gray-600 hover:text-primaryColor-900 transition-colors"
                        title="View Attendance"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Platform Overview */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats?.total_projects || 0}</p>
              <p className="text-sm text-gray-600">Total Platform Projects</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats?.total_volunteers || 0}</p>
              <p className="text-sm text-gray-600">Active Volunteers</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">24</p>
              <p className="text-sm text-gray-600">Community Posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default LeaderDashboard;