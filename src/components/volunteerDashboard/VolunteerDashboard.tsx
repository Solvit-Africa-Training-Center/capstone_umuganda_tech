import React, { useEffect, useState } from 'react';
import ProjectCard from '../volunteerDashboard/ProjectCard';
import FilterBar from '../volunteerDashboard/FilterBar';
import SortDropdown from '../volunteerDashboard/SortDropdown';
import Pagination from '../volunteerDashboard/Pagination';
// import UserList from './UserList';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSortedProjects, setFilter, setSort, setPage } from '../../store/slices/volunteerDashboardSlice';
import type { FilterState, SortState } from '../../types/Volunteer';
import api from '../../api/api';
import badge from "../../images/volunteer/badge-removebg-preview 1 (1).png"

const VolunteerDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, loading, error, filter, sort, pagination } = useAppSelector(
    (state) => state.volunteerDashboard
  );
  const [userStats, setUserStats] = useState({ name: 'John Doe', projectsCompleted: 0, hoursContributed: 0, avatar_url: '' });
  


  useEffect(() => {
    dispatch(fetchSortedProjects({ filter, sort, pagination }));
    
    // Direct API test to see raw backend response
    const testDirectAPI = async () => {
      try {
        console.log('=== DIRECT API TEST ===');
        const response = await api.get('/api/projects/projects/');
        console.log('Direct API response:', response.data);
        if (response.data.results) {
          console.log('First project from direct API:', response.data.results[0]);
        } else if (Array.isArray(response.data)) {
          console.log('First project from direct API:', response.data[0]);
        }
      } catch (error) {
        console.error('Direct API test failed:', error);
      }
    };
    testDirectAPI();
  }, [dispatch, filter, sort, pagination.page, pagination.pageSize]);

  // Debug projects data
  useEffect(() => {
    if (projects.length > 0) {
      console.log('Projects received:', projects);
      projects.forEach((project, index) => {
        console.log(`Project ${index + 1}:`, {
          id: project.id,
          title: project.title,
          image_url: project.image_url,
          hasImage: !!project.image_url
        });
      });
    }
  }, [projects]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const userId = localStorage.getItem('user_id') || '1';
        const [profileResponse, ] = await Promise.all([
          api.get(`/api/users/users/${userId}/`),
          api.get('/api/users/user-badges/')
        ]);
        setUserStats({
          name: profileResponse.data.name || 'John Doe',
          projectsCompleted: profileResponse.data.projectsCompleted || 0,
          hoursContributed: profileResponse.data.hoursContributed || 0,
          avatar_url: profileResponse.data.avatar_url || ''
        });
        
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    fetchUserStats();
  }, []);



  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-row justify-around">
        <div className="flex items-center gap-4 mb-4">
          <div>
            {userStats.avatar_url ? (
              <img src={userStats.avatar_url} alt={userStats.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                {userStats.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{userStats.name}</h2>
          </div>
        </div>
        <div className="mt-4">
          <img src={badge} alt="user badge" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-14">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.projectsCompleted}</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.hoursContributed}</div>
            <div className="text-sm text-gray-600">Hours Contributed</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold mb-4">Projects</h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <FilterBar filter={filter} onFilterChange={(newFilter: FilterState) => {
              dispatch(setFilter(newFilter));
            }} />
            <SortDropdown sort={sort} onSortChange={(newSort: SortState) => {
              dispatch(setSort(newSort));
            }} />
          </div>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {projects.map((proj) => {
                  console.log(`Rendering project ${proj.id}:`, proj.image_url);
                  return (
                    <ProjectCard 
                      key={proj.id} 
                      project={proj}
                    />
                  );
                })}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page: number) => dispatch(setPage(page))}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;