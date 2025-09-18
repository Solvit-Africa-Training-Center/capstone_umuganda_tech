import React, { useEffect } from 'react';
import ProjectCard from '../volunteerDashboard/ProjectCard';
import FilterBar from '../volunteerDashboard/FilterBar';
import SortDropdown from '../volunteerDashboard/SortDropdown';
import Pagination from '../volunteerDashboard/Pagination';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSortedProjects, setFilter, setSort, setPage } from '../../store/slices/volunteerDashboardSlice';
import type { FilterState, SortState } from '../../types/Volunteer';

const VolunteerDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, loading, error, filter, sort, pagination } = useAppSelector(
    (state) => state.volunteerDashboard
  );

  useEffect(() => {
    dispatch(fetchSortedProjects({ filter, sort, pagination }));
  }, [dispatch, filter, sort, pagination.page, pagination.pageSize]);

  return (
    <div className="container mx-auto px-4 py-6">
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
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page: number) => dispatch(setPage(page))}
          />
        </>
      )}
    </div>
  );
};

export default VolunteerDashboard;