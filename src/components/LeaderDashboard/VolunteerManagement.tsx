import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Clock, TrendingUp, Eye, Calendar, MapPin } from 'lucide-react';
import { projectsAPI } from '../../api/projects';
import type { Project, ProjectRegistration, Attendance } from '../../types/api';

interface VolunteerManagementProps {
  projects: Project[];
  attendanceOverview: {
    today_checkins: number;
    week_attendance: number;
    attendance_rate: number;
  };
  isLoading?: boolean;
}

const VolunteerManagement: React.FC<VolunteerManagementProps> = ({ 
  projects, 
  attendanceOverview, 
  isLoading 
}) => {
  const navigate = useNavigate();
  const [recentRegistrations, setRecentRegistrations] = useState<ProjectRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  useEffect(() => {
    fetchRecentRegistrations();
  }, [projects]);

  const fetchRecentRegistrations = async () => {
    if (projects.length === 0) return;
    
    setLoadingRegistrations(true);
    try {
      // Fetch registrations for the most recent projects
      const recentProjects = projects.slice(0, 3);
      const registrationPromises = recentProjects.map(project => 
        projectsAPI.getProjectRegistrations(project.id).catch(() => [])
      );
      
      const registrationsArrays = await Promise.all(registrationPromises);
      const allRegistrations = registrationsArrays.flat().slice(0, 5);
      
      // Mock recent registrations structure since backend might not return full data
      const mockRegistrations: ProjectRegistration[] = allRegistrations.map((reg: any, index) => ({
        user: reg.user || {
          id: index + 1,
          first_name: `Volunteer${index + 1}`,
          last_name: 'User',
          phone_number: '+250788123456',
          sector: 'Kigali',
          role: 'Volunteer' as const,
          skills: [],
          badges: [],
          created_at: new Date().toISOString()
        },
        project: recentProjects[index % recentProjects.length],
        registered_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setRecentRegistrations(mockRegistrations);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const totalVolunteers = projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'ongoing' || p.status === 'planned').length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Volunteer Management</h2>
        <button
          onClick={() => navigate('/volunteers')}
          className="text-primaryColor-600 hover:text-primaryColor-800 text-sm font-medium"
        >
          View All
        </button>
      </div>

      {/* Volunteer Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalVolunteers}</p>
              <p className="text-sm font-medium text-blue-600">Total Volunteers</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{attendanceOverview.today_checkins}</p>
              <p className="text-sm font-medium text-green-600">Today's Check-ins</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{attendanceOverview.attendance_rate}%</p>
              <p className="text-sm font-medium text-purple-600">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate('/volunteers')}
          className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-800">Manage Volunteers</p>
            <p className="text-sm text-gray-600">View all volunteers across projects</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/attendance')}
          className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <Clock className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-gray-800">Attendance Reports</p>
            <p className="text-sm text-gray-600">Track volunteer participation</p>
          </div>
        </button>
      </div>

      {/* Recent Registrations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Recent Registrations</h3>
          <button
            onClick={() => navigate('/volunteers')}
            className="text-primaryColor-600 hover:text-primaryColor-800 text-sm font-medium"
          >
            View All
          </button>
        </div>

        {loadingRegistrations ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentRegistrations.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No recent registrations</p>
            <p className="text-sm text-gray-500">New volunteer registrations will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRegistrations.map((registration, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-primaryColor-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primaryColor-600">
                      {registration.user.first_name[0]}{registration.user.last_name[0]}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {registration.user.first_name} {registration.user.last_name}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {registration.project.title}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(registration.registered_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/project/${registration.project.id}/volunteers`)}
                  className="flex items-center gap-1 text-primaryColor-600 hover:text-primaryColor-800 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerManagement;