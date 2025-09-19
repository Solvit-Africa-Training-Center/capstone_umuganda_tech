import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, MapPin, Calendar, Users, Filter } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { discoverProjects, fetchProjects, setSearchQuery, setFilters } from '../store/projectsSlice';
import { projectsAPI } from '../api/projects';
import type { Project } from '../types/api';

const ProjectsDiscovery: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { discoveryProjects, projects, isLoading, searchQuery, filters } = useSelector(
    (state: RootState) => state.projects
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [joiningProjects, setJoiningProjects] = useState<Set<number>>(new Set());

  useEffect(() => {
    dispatch(discoverProjects());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    dispatch(fetchProjects({ search: localSearch, ...filters }));
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
    dispatch(fetchProjects({ search: searchQuery, ...newFilters }));
  };

  const handleJoinLeave = async (project: Project) => {
    console.log('handleJoinLeave called with project:', project.id, 'isRegistered:', project.is_user_registered);
    if (!user) {
      console.log('No user found');
      return;
    }
    
    setJoiningProjects(prev => new Set(prev).add(project.id));
    
    try {
      if (project.is_user_registered) {
        console.log('Leaving project...');
        await projectsAPI.leaveProject(project.id);
      } else {
        console.log('Joining project...');
        await projectsAPI.joinProject(project.id);
      }
      
      // Refresh projects to get updated data
      dispatch(discoverProjects());
      if (searchQuery) {
        dispatch(fetchProjects({ search: searchQuery, ...filters }));
      }
    } catch (err: any) {
      console.error('Join/Leave error:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setJoiningProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(project.id);
        return newSet;
      });
    }
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      {project.image_url && (
        <img 
          src={project.image_url} 
          alt={project.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{project.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          project.status === 'ongoing' ? 'bg-green-100 text-green-800' :
          project.status === 'planned' ? 'bg-blue-100 text-blue-800' :
          project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {project.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-2" />
          {project.location}, {project.sector}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(project.datetime).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          {project.volunteer_count}/{project.required_volunteers} volunteers
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">By {project.admin_name}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.href = `/project/${project.id}`}
            className="border border-primaryColor-900 text-primaryColor-900 hover:bg-primaryColor-50 px-4 py-2 rounded-lg transition-colors"
          >
            View
          </button>
          {/* Show join/leave button for all authenticated users except project owners */}
          {user && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                console.log('Button clicked for project:', project.id, 'isRegistered:', project.is_user_registered);
                handleJoinLeave(project);
              }}
              disabled={joiningProjects.has(project.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                project.is_user_registered 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-primaryColor-900 hover:bg-accent-900 text-white'
              } disabled:opacity-50`}
            >
              {joiningProjects.has(project.id) ? (
                project.is_user_registered ? 'Leaving...' : 'Joining...'
              ) : (
                project.is_user_registered ? 'Leave' : 'Join'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const ProjectSection: React.FC<{ title: string; projects: Project[]; description?: string }> = ({ 
    title, 
    projects, 
    description 
  }) => (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No projects found in this category</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Discover Community Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find meaningful volunteer opportunities in your community and make a lasting impact
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-900"
              />
            </div>
            <button
              type="submit"
              className="bg-primaryColor-900 hover:bg-accent-900 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-300 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primaryColor-900"
              >
                <option value="">All Status</option>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              
              <input
                type="text"
                placeholder="Location"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primaryColor-900"
              />
              
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primaryColor-900"
              />
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && projects.length > 0 && (
          <ProjectSection 
            title={`Search Results for "${searchQuery}"`}
            projects={projects}
            description={`Found ${projects.length} projects matching your search`}
          />
        )}

        {/* Discovery Sections */}
        {discoveryProjects && !searchQuery && (
          <>
            <ProjectSection 
              title="Urgent Projects"
              projects={discoveryProjects.urgent}
              description="Projects happening in the next 7 days that need your help"
            />
            
            <ProjectSection 
              title="Trending Projects"
              projects={discoveryProjects.trending}
              description="Most popular projects in your community"
            />
            
            <ProjectSection 
              title="Near You"
              projects={discoveryProjects.nearby}
              description="Projects in your local area"
            />
            
            <ProjectSection 
              title="Recently Added"
              projects={discoveryProjects.recent}
              description="New projects added in the last week"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsDiscovery;