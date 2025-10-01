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
  LogOut,
  Settings,
  Globe
} from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { projectsAPI } from '../api/projects';
import { useAuth } from '../hooks/useAuth';
import NotificationBadge from './NotificationBadge';
import DashboardStats from './LeaderDashboard/DashboardStats';
import ProjectManagementPanel from './LeaderDashboard/ProjectManagementPanel';
import SimpleProjectManagement from './LeaderDashboard/SimpleProjectManagement';
import VolunteerManagement from './LeaderDashboard/VolunteerManagement';
import QRCodeCenter from './LeaderDashboard/QRCodeCenter';
import CalendarAnalytics from './LeaderDashboard/CalendarAnalytics';
import CommunicationHub from './LeaderDashboard/CommunicationHub';
import CreateProject from './CreateProject';
import MyProjects from './MyProjects';
import CommunityPosts from './CommunityPosts';
import UserProfile from './UserProfile';
import CertificateManagement from './LeaderDashboard/CertificateManagement';
import AdvancedAnalytics from './LeaderDashboard/AdvancedAnalytics';
import LeaderSettings from './LeaderDashboard/LeaderSettings';
import type { Project, LeaderDashboardStats } from '../types/api';

const LeaderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, logout } = useAuth();
  const { dashboardStats } = useSelector((state: RootState) => state.projects);
  
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [leaderDashboardStats, setLeaderDashboardStats] = useState<LeaderDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    fetchLeaderData();
  }, []);

  const fetchLeaderData = async () => {
    try {
      setIsLoading(true);
      
      // Try to get projects, fallback to empty array if endpoint doesn't exist
      let projects: Project[] = [];
      try {
        projects = await projectsAPI.getMyProjects();
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn('My projects endpoint not available, using empty array');
          projects = [];
        } else {
          throw error;
        }
      }
      
      setMyProjects(projects);
      
      const enhancedStats: LeaderDashboardStats = {
        status: {
          total_projects: projects.length,
          active_projects: projects.filter(p => p.status === 'ongoing' || p.status === 'planned').length,
          completed_projects: projects.filter(p => p.status === 'completed').length,
          cancelled_projects: projects.filter(p => p.status === 'cancelled').length,
          total_volunteers: projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0),
          certificates_issued: projects.filter(p => p.status === 'completed').length * 2,
          upcoming_deadlines: projects.filter(p => {
            const projectDate = new Date(p.datetime);
            const now = new Date();
            const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            return projectDate >= now && projectDate <= thirtyDaysFromNow;
          }).length,
          attendance_rate: 85
        },
        recent_projects: projects.slice(0, 5),
        upcoming_deadlines: projects.filter(p => {
          const projectDate = new Date(p.datetime);
          const now = new Date();
          const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          return projectDate >= now && projectDate <= thirtyDaysFromNow;
        }).slice(0, 5),
        recent_registrations: [],
        attendance_overview: {
          today_checkins: 25,
          week_attendance: 180,
          attendance_rate: 85
        }
      };
      
      setLeaderDashboardStats(enhancedStats);
    } catch (error) {
      console.error('Failed to fetch leader data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
    { id: 'projects', label: 'Project Management', icon: FolderOpen },
    { id: 'volunteers', label: 'Volunteer Management', icon: Users },
    { id: 'certificates', label: 'Certificate Management', icon: Award },
    { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3 },
    { id: 'qr-codes', label: 'QR Code Center', icon: QrCode },
    { id: 'calendar', label: 'Calendar & Analytics', icon: Calendar },
    { id: 'communication', label: 'Messaging Center', icon: MessageSquare },
    { id: 'create-project', label: 'Create Project', icon: Plus },
    { id: 'my-projects', label: 'My Projects', icon: FolderOpen },
    { id: 'community', label: 'Community', icon: Globe },
    { id: 'settings', label: 'Settings & Preferences', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <DashboardStats 
              stats={leaderDashboardStats?.status || {
                total_projects: 0,
                active_projects: 0,
                completed_projects: 0,
                cancelled_projects: 0,
                total_volunteers: 0,
                certificates_issued: 0,
                upcoming_deadlines: 0,
                attendance_rate: 0
              }} 
              isLoading={isLoading} 
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProjectManagementPanel projects={myProjects} isLoading={isLoading} />
              <VolunteerManagement 
                projects={myProjects} 
                attendanceOverview={leaderDashboardStats?.attendance_overview || {
                  today_checkins: 0,
                  week_attendance: 0,
                  attendance_rate: 0
                }}
                isLoading={isLoading} 
              />
            </div>
          </div>
        );
      case 'projects':
        return (
          <SimpleProjectManagement 
            projects={myProjects} 
            isLoading={isLoading} 
            onProjectsUpdate={fetchLeaderData}
          />
        );
      case 'volunteers':
        return (
          <VolunteerManagement 
            projects={myProjects} 
            attendanceOverview={leaderDashboardStats?.attendance_overview || {
              today_checkins: 0,
              week_attendance: 0,
              attendance_rate: 0
            }}
            isLoading={isLoading} 
          />
        );
      case 'certificates':
        return <CertificateManagement projects={myProjects} isLoading={isLoading} />;
      case 'analytics':
        return <AdvancedAnalytics projects={myProjects} isLoading={isLoading} />;
      case 'qr-codes':
        return <QRCodeCenter projects={myProjects} isLoading={isLoading} />;
      case 'calendar':
        return <CalendarAnalytics projects={myProjects} isLoading={isLoading} />;
      case 'communication':
        return <CommunicationHub projects={myProjects} isLoading={isLoading} />;
      case 'create-project':
        return <CreateProject />;
      case 'my-projects':
        return <MyProjects />;
      case 'community':
        return <CommunityPosts />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <LeaderSettings isLoading={isLoading} />;
      default:
        return <div>Content not found</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primaryColor-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leader dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Trigger Area */}
      <div 
        className="fixed left-0 top-0 w-4 h-full z-30"
        onMouseEnter={() => setSidebarVisible(true)}
      ></div>

      {/* Fixed Sidebar */}
      <div 
        className={`w-64 bg-white shadow-xl border-r border-gray-200 fixed h-full z-20 transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-60'
        }`}
        onMouseEnter={() => setSidebarVisible(true)}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primaryColor-50 to-primaryColor-100">
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.first_name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 bg-primaryColor-900 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
              <p className="text-sm text-primaryColor-700 capitalize font-medium">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="space-y-1 pb-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group ${
                  activeSection === item.id
                    ? 'bg-primaryColor-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primaryColor-700 hover:shadow-md'
                }`}
              >
                <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-primaryColor-600'
                }`} />
                <span className="font-medium text-sm">{item.label}</span>
                {activeSection === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium border border-transparent hover:border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        sidebarVisible ? 'ml-64' : 'ml-4'
      }`}>
        {/* Top Header */}
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!sidebarVisible && (
                  <button
                    onClick={() => setSidebarVisible(true)}
                    className="p-2 text-gray-600 hover:text-primaryColor-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                )}
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    Leader Dashboard
                  </h1>
                  <p className="text-lg text-primaryColor-700 font-medium">
                    Welcome back, {user?.first_name}! 👋
                  </p>
                  <p className="text-gray-600 mt-1">
                    Manage your community projects and track impact
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <NotificationBadge />
                
                <button
                  onClick={() => setActiveSection('create-project')}
                  className="flex items-center gap-2 bg-primaryColor-600 text-white px-4 py-2 rounded-lg hover:bg-primaryColor-700 transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
                
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaderDashboard;