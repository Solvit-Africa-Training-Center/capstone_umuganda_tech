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
  Bell,
  LogOut,
  User,
} from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { discoverProjects, fetchDashboardStats } from '../store/projectsSlice';
import { projectsAPI } from '../api/projects';
import { useAuth } from '../hooks/useAuth';
import NotificationCenter from './NotificationCenter';
import ProjectsDiscovery from './ProjectsDiscovery';
import CommunityPosts from './CommunityPosts';
import UserManagement from './UserManagement';
import UserProfile from './UserProfile';
import ImpactAchievements from './ImpactAchievements';
import QRScanner from './QRScanner';
import { attendanceAPI, type Attendance } from '../api/attendance';
import type { Project } from '../types/api';
import Sidebar from './LeaderDashboard/Sidebar';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, logout } = useAuth();
  const { discoveryProjects, isLoading: projectsLoading, dashboardStats } = useSelector((state: RootState) => state.projects);
  
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [leaderStats, setLeaderStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalVolunteers: 0,
    totalHours: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    // Check if user is a leader (case insensitive)
    const isLeader = user.role?.toLowerCase() === 'leader';
    
    // Fetch common data for all users
    dispatch(discoverProjects());
    dispatch(fetchDashboardStats());
    
    // Fetch user attendances for volunteer dashboard
    if (!isLeader) {
      fetchUserAttendances();
    }
    
    if (isLeader) {
      console.log('Dashboard - Fetching leader data for user:', user.first_name);
      fetchLeaderData();
    } else {
      console.log('Dashboard - User is not a leader, showing volunteer dashboard');
      setIsLoading(false);
    }
  }, [dispatch, user, navigate]);

  const fetchLeaderData = async () => {
    try {
      setIsLoading(true);
      console.log('Dashboard - Calling getMyProjects API...');
      const projects = await projectsAPI.getMyProjects();
      console.log('Dashboard - Leader projects:', projects);
      setMyProjects(projects);
      
      // Calculate leader-specific stats
      const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'ongoing' || p.status === 'planned').length,
        totalVolunteers: projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0),
        totalHours: projects.reduce((sum, p) => sum + (p.total_hours || 0), 0)
      };
      console.log('Dashboard - Leader stats:', stats);
      setLeaderStats(stats);
    } catch (error) {
      console.error('Dashboard - Failed to fetch leader data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserAttendances = async () => {
    try {
      const attendances = await attendanceAPI.listAttendances();
      setUserAttendances(attendances);
    } catch (error) {
      console.error('Failed to fetch user attendances:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  // Check if user is a leader (case insensitive)
  const isLeader = user.role?.toLowerCase() === 'leader';

  // Leader Dashboard
  if (isLeader) {
    console.log('Dashboard - Rendering LEADER dashboard');
    
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
            <p className="text-gray-600">Loading leader dashboard...</p>
          </div>
        </div>
      );
    }

    return (

     <div className='flex min-h-screen w-full'>
        <Sidebar/>
        <div className=" bg-gray-50 w-full">
          {/* Leader Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                  Dashboard - Welcome back, {user.first_name}! 
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

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
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
      </div>
      
    );
  }

  // Volunteer Dashboard with Sidebar Layout
  console.log('Dashboard - Rendering VOLUNTEER dashboard');
  
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [joiningProjects, setJoiningProjects] = useState<Set<number>>(new Set());
  const [userAttendances, setUserAttendances] = useState<Attendance[]>([]);
  
  // Calculate attendance-based stats
  const completedActivities = userAttendances.filter(a => a.check_out_time).length;
  const totalHours = userAttendances.reduce((total, attendance) => {
    if (attendance.check_in_time && attendance.check_out_time) {
      const checkIn = new Date(attendance.check_in_time);
      const checkOut = new Date(attendance.check_out_time);
      const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }
    return total;
  }, 0);

  const stats = [
    {
      title: 'Umuganda Activities',
      value: completedActivities.toString(),
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Hours Contributed',
      value: Math.round(totalHours).toString() + 'h',
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      title: 'Badges Earned',
      value: user.badges?.length?.toString() || '0',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      title: 'Check-ins',
      value: userAttendances.length.toString(),
      icon: QrCode,
      color: 'bg-orange-500'
    }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'activities', label: 'Browse Activities', icon: Calendar },
    { id: 'qr-scanner', label: 'QR Check-in', icon: QrCode },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'members', label: 'Community Members', icon: Users },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleJoinLeave = async (projectId: number, isRegistered: boolean) => {
    if (joiningProjects.has(projectId)) return;
    
    setJoiningProjects(prev => new Set(prev).add(projectId));
    
    try {
      if (isRegistered) {
        await projectsAPI.leaveProject(projectId);
      } else {
        await projectsAPI.joinProject(projectId);
      }
      
      // Refresh discovery projects to get updated data
      dispatch(discoverProjects());
    } catch (error) {
      console.error('Failed to join/leave project:', error);
    } finally {
      setJoiningProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                      <p className="text-4xl font-bold text-gray-800 mt-3">{stat.value}</p>
                      <div className="w-12 h-1 bg-gradient-to-r from-primaryColor-400 to-primaryColor-600 rounded-full mt-2"></div>
                    </div>
                    <div className={`${stat.color} p-4 rounded-2xl shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveSection('activities')}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                >
                  <Calendar className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-blue-800">Browse Activities</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('qr-scanner')}
                  className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                >
                  <QrCode className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-green-800">QR Check-in</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('community')}
                  className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
                >
                  <MessageSquare className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-purple-800">Community</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('profile')}
                  className="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
                >
                  <User className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-orange-800">My Profile</span>
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            {discoveryProjects && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
                    <p className="text-sm text-gray-500 mt-1">Urgent activities (next 7 days) and trending projects (most attended in 30 days)</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('activities')}
                    className="text-sm text-primaryColor-600 hover:text-primaryColor-800 font-medium"
                  >
                    View All
                  </button>
                </div>
                
                {projectsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Urgent Activities */}
                    {discoveryProjects.urgent && discoveryProjects.urgent.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide">Urgent - Next 7 Days</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {discoveryProjects.urgent.slice(0, 2).map((project) => (
                            <div key={project.id} className="group p-4 border border-red-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all cursor-pointer bg-red-50/30">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-800 group-hover:text-red-700 transition-colors line-clamp-1">{project.title}</h4>
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                                  {Math.ceil((new Date(project.datetime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-1">{project.location} • {new Date(project.datetime).toLocaleDateString()}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{project.volunteer_count || 0}/{project.required_volunteers} volunteers</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinLeave(project.id, project.is_user_registered);
                                  }}
                                  disabled={joiningProjects.has(project.id)}
                                  className={`text-xs px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                                    project.is_user_registered
                                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                                  } disabled:opacity-50`}
                                >
                                  {joiningProjects.has(project.id) && (
                                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                  )}
                                  {joiningProjects.has(project.id) 
                                    ? (project.is_user_registered ? 'Leaving...' : 'Joining...')
                                    : (project.is_user_registered ? 'Leave' : 'Join Now')
                                  }
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Trending Activities */}
                    {discoveryProjects.trending && discoveryProjects.trending.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide">Trending - Most Attended (30 Days)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {discoveryProjects.trending.slice(0, 2).map((project) => (
                            <div key={project.id} className="group p-4 border border-green-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all cursor-pointer bg-green-50/30">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-1">{project.title}</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                  {Math.round((project.volunteer_count / project.required_volunteers) * 100)}% full
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-1">{project.location} • {project.volunteer_count}/{project.required_volunteers} volunteers</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-green-500 h-1.5 rounded-full transition-all" 
                                      style={{ width: `${Math.min((project.volunteer_count / project.required_volunteers) * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">Popular</span>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinLeave(project.id, project.is_user_registered);
                                  }}
                                  disabled={joiningProjects.has(project.id)}
                                  className={`text-xs px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                                    project.is_user_registered
                                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  } disabled:opacity-50`}
                                >
                                  {joiningProjects.has(project.id) && (
                                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                  )}
                                  {joiningProjects.has(project.id) 
                                    ? (project.is_user_registered ? 'Leaving...' : 'Joining...')
                                    : (project.is_user_registered ? 'Leave' : 'Join Now')
                                  }
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'activities':
        return <ProjectsDiscovery />;
      case 'qr-scanner':
        return <QRScanner />;
      case 'community':
        return <CommunityPosts />;
      case 'members':
        return <UserManagement />;
      case 'profile':
        return <UserProfile />;
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Trigger Area */}
      <div 
        className="fixed left-0 top-0 w-4 h-full z-30"
        onMouseEnter={() => setSidebarVisible(true)}
      ></div>

      {/* Fixed Sidebar */}
      <div 
        className={`w-64 bg-white shadow-xl border-r border-gray-200 fixed h-full z-20 transition-transform duration-300 ease-in-out ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-60'
        }`}
        onMouseEnter={() => setSidebarVisible(true)}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primaryColor-50 to-primaryColor-100">
          <div className="flex items-center gap-3">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.first_name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 bg-primaryColor-900 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                {user.first_name[0]}{user.last_name[0]}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
              <p className="text-sm text-primaryColor-700 capitalize font-medium">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
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
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-primaryColor-600'
                }`} />
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium border border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
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
                {/* Menu Toggle Button - Only visible when sidebar is hidden */}
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
                    Umuganda Dashboard
                  </h1>
                  <p className="text-lg text-primaryColor-700 font-medium">
                    Muraho, {user.first_name}! 🇷🇼
                  </p>
                  <p className="text-gray-600 mt-1">
                    Ready to contribute to Rwanda's development through community service?
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveSection('qr-scanner')}
                  className="flex items-center gap-2 bg-primaryColor-600 text-white px-4 py-2 rounded-lg hover:bg-primaryColor-700 transition-colors shadow-md"
                >
                  <QrCode className="w-4 h-4" />
                  Quick Check-in
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

export default Dashboard;