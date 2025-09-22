import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Calendar, Users, Clock, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
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

  const clearFilters = () => {
    setCurrentSearchQuery('');
    setAdvancedFilters({
      status: '',
      location: '',
      date_from: '',
      date_to: ''
    });
    dispatch(setSearchQuery(''));
    dispatch(discoverProjects());
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

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const daysUntil = Math.ceil((new Date(project.datetime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isUrgent = daysUntil <= 7 && daysUntil > 0;
    const progressPercentage = Math.round((project.volunteer_count / project.required_volunteers) * 100);
    
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-[1.02]">
        {project.image_url && (
          <div className="relative mb-4">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-48 object-cover rounded-xl"
            />
            {isUrgent && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {daysUntil} days left
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-primaryColor-700 transition-colors">{project.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            project.status === 'ongoing' ? 'bg-green-100 text-green-800' :
            project.status === 'planned' ? 'bg-blue-100 text-blue-800' :
            project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {project.status.toUpperCase()}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{project.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-primaryColor-600" />
            <span className="font-medium">{project.location}</span>
            <span className="text-gray-400 mx-1">•</span>
            <span>{project.sector}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-primaryColor-600" />
            <span>{new Date(project.datetime).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-primaryColor-600" />
              <span>{project.volunteer_count}/{project.required_volunteers} volunteers</span>
            </div>
            <span className={`text-xs font-medium ${
              progressPercentage >= 80 ? 'text-green-600' :
              progressPercentage >= 50 ? 'text-yellow-600' :
              'text-gray-500'
            }`}>
              {progressPercentage}% full
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                progressPercentage >= 80 ? 'bg-green-500' :
                progressPercentage >= 50 ? 'bg-yellow-500' :
                'bg-primaryColor-500'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primaryColor-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-primaryColor-700">
                {project.admin_name?.charAt(0) || 'A'}
              </span>
            </div>
            <span className="text-sm text-gray-600">By {project.admin_name}</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.href = `/project/${project.id}`}
              className="border border-primaryColor-600 text-primaryColor-600 hover:bg-primaryColor-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              View Details
            </button>
            {user && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleJoinLeave(project);
                }}
                disabled={joiningProjects.has(project.id)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1 ${
                  project.is_user_registered 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-primaryColor-600 hover:bg-primaryColor-700 text-white'
                } disabled:opacity-50`}
              >
                {joiningProjects.has(project.id) && (
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                )}
                {joiningProjects.has(project.id) ? (
                  project.is_user_registered ? 'Leaving...' : 'Joining...'
                ) : (
                  project.is_user_registered ? 'Leave' : 'Join Now'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getSectionIcon = (title: string) => {
    if (title.includes('Urgent')) return AlertCircle;
    if (title.includes('Popular')) return TrendingUp;
    if (title.includes('Near')) return MapPin;
    if (title.includes('Recent')) return Sparkles;
    return Calendar;
  };

  const ProjectSection: React.FC<{ title: string; projects: Project[]; description?: string }> = ({ 
    title, 
    projects, 
    description 
  }) => {
    const IconComponent = getSectionIcon(title);
    
    return (
      <div className="mb-12">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primaryColor-100 rounded-lg">
              <IconComponent className="w-5 h-5 text-primaryColor-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
              {projects?.length || 0}
            </span>
          </div>
          {description && <p className="text-gray-600 ml-12">{description}</p>}
        </div>
        
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <IconComponent className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No activities found in this category</p>
            <p className="text-gray-400 text-sm">Check back later for new opportunities</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primaryColor-50 to-primaryColor-100 rounded-2xl p-8 border border-primaryColor-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Browse Umuganda Activities 🇷🇼
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and join community service activities in your area. Contribute to Rwanda's development through Umuganda.
          </p>
        </div>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentSearchQuery ? `Search Results for "${currentSearchQuery}"` : "Filtered Results"}
              </h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primaryColor-600 hover:text-primaryColor-800 font-medium"
              >
                Clear Filters
              </button>
            </div>
            <p className="text-gray-600 mb-6">Found {projects?.length || 0} activities matching your criteria</p>
            
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No activities found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Discovery Sections - Only show when no search/filters active */}
        {discoveryProjects && !currentSearchQuery && !Object.values(advancedFilters).some(v => v) && (
          <div className="space-y-8">
            <ProjectSection 
              title="Urgent Activities"
              projects={discoveryProjects.urgent}
              description="Activities happening in the next 7 days that need volunteers"
            />
            
            <ProjectSection 
              title="Popular Activities"
              projects={discoveryProjects.trending}
              description="Most participated activities in your community (last 30 days)"
            />
            
            <ProjectSection 
              title="Near You"
              projects={discoveryProjects.nearby}
              description="Activities in your local sector and nearby areas"
            />
            
            <ProjectSection 
              title="Recently Added"
              projects={discoveryProjects.recent}
              description="New activities scheduled this week"
            />
          </div>
        )}
    </div>
  );
};

export default ProjectsDiscovery;