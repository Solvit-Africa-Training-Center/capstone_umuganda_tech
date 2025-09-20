import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Calendar, Users } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import { discoverProjects, fetchProjects, setSearchQuery } from '../store/projectsSlice';
import { projectsAPI } from '../api/projects';
import AdvancedSearch from './AdvancedSearch';
import type { Project } from '../types/api';

const ProjectsDiscovery: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { discoveryProjects, projects, isLoading, searchQuery } = useSelector(
    (state: RootState) => state.projects
  );
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [joiningProjects, setJoiningProjects] = useState<Set<number>>(new Set());
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    status: '',
    location: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    dispatch(discoverProjects());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = {
      search: localSearch,
      ...filters,
      ...advancedFilters
    };
    
    // Remove empty filters
    Object.keys(searchParams).forEach(key => {
      if (!searchParams[key as keyof typeof searchParams]) {
        delete searchParams[key as keyof typeof searchParams];
      }
    });
    
    console.log('🔍 Advanced search with params:', searchParams);
    dispatch(setSearchQuery(localSearch));
    dispatch(fetchProjects(searchParams));
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
    dispatch(fetchProjects({ search: searchQuery, ...newFilters }));
  };

  const fetchSearchSuggestions = async (query: string) => {
    if (query.length >= 2) {
      try {
        const suggestions = await projectsAPI.getSearchSuggestions(query);
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    } else {
      setShowSuggestions(false);
    }
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
      
      {projects && projects.length > 0 ? (
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

        {/* Advanced Search Component */}
        <AdvancedSearch 
          onSearch={(params) => {
            console.log('🔍 Advanced search with params:', params);
            setCurrentSearchQuery(params.search || '');
            setAdvancedFilters({
              status: params.status || '',
              location: params.location || '',
              date_from: params.date_from || '',
              date_to: params.date_to || ''
            });
            if (params.search) {
              dispatch(setSearchQuery(params.search));
            }
            dispatch(fetchProjects(params));
          }}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        )}

        {/* Search Results */}
        {(currentSearchQuery || Object.values(advancedFilters).some(v => v)) && (
          <ProjectSection 
            title={currentSearchQuery ? `Search Results for "${currentSearchQuery}"` : "Filtered Results"}
            projects={projects || []}
            description={`Found ${projects?.length || 0} projects matching your criteria`}
          />
        )}

        {/* Discovery Sections - Only show when no search/filters active */}
        {discoveryProjects && !currentSearchQuery && !Object.values(advancedFilters).some(v => v) && (
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