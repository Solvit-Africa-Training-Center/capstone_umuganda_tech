import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Calendar, Users, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Project } from '../../types/api';

interface ProjectManagementPanelProps {
  projects: Project[];
  isLoading?: boolean;
}

const ProjectManagementPanel: React.FC<ProjectManagementPanelProps> = ({ projects, isLoading }) => {
  const navigate = useNavigate();

  const projectsByStatus = {
    planned: projects.filter(p => p.status === 'planned'),
    ongoing: projects.filter(p => p.status === 'ongoing'),
    completed: projects.filter(p => p.status === 'completed'),
    cancelled: projects.filter(p => p.status === 'cancelled')
  };

  const urgentProjects = projects.filter(p => {
    const projectDate = new Date(p.datetime);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return projectDate >= now && projectDate <= sevenDaysFromNow && p.status !== 'completed';
  });

  const statusConfig = {
    planned: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    ongoing: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    completed: { icon: CheckCircle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
    cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
        <h2 className="text-xl font-semibold text-gray-800">Project Management</h2>
        <button
          onClick={() => navigate('/create-project')}
          className="flex items-center gap-2 bg-primaryColor-900 text-white px-4 py-2 rounded-lg hover:bg-accent-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Project Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(projectsByStatus).map(([status, statusProjects]) => {
          const config = statusConfig[status as keyof typeof statusConfig];
          const Icon = config.icon;
          
          return (
            <div key={status} className={`${config.bg} ${config.border} border rounded-lg p-4`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${config.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{statusProjects.length}</p>
                  <p className={`text-sm font-medium capitalize ${config.color}`}>{status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => navigate('/my-projects')}
          className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <FolderOpen className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-800">View All Projects</p>
            <p className="text-sm text-gray-600">{projects.length} total projects</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/my-projects?filter=urgent')}
          className="flex items-center gap-3 p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
        >
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <div>
            <p className="font-medium text-gray-800">Urgent Projects</p>
            <p className="text-sm text-orange-600">{urgentProjects.length} need attention</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/create-project')}
          className="flex items-center gap-3 p-4 border border-primaryColor-200 bg-primaryColor-50 rounded-lg hover:bg-primaryColor-100 transition-colors text-left"
        >
          <Plus className="w-5 h-5 text-primaryColor-600" />
          <div>
            <p className="font-medium text-gray-800">Create Project</p>
            <p className="text-sm text-primaryColor-600">Start new initiative</p>
          </div>
        </button>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Recent Projects</h3>
          <button
            onClick={() => navigate('/my-projects')}
            className="text-primaryColor-600 hover:text-primaryColor-800 text-sm font-medium"
          >
            View All
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No projects yet</p>
            <button
              onClick={() => navigate('/create-project')}
              className="text-primaryColor-600 hover:text-primaryColor-800 font-medium"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => {
              const config = statusConfig[project.status as keyof typeof statusConfig];
              const Icon = config.icon;
              
              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{project.title}</h4>
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
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                    project.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagementPanel;