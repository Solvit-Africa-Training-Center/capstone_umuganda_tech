import React from 'react';
import { Filter, Users, Clock, CheckCircle, FolderOpen } from 'lucide-react';
import type { FilterState } from '../../types/Volunteer';

interface TabsFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

const TabsFilter: React.FC<TabsFilterProps> = ({ filters, onFiltersChange }) => {
  const tabs = [
    { key: 'all', label: 'All Projects', icon: FolderOpen },
    { key: 'my-projects', label: 'My Projects', icon: Users },
    { key: 'ongoing', label: 'Ongoing', icon: Clock },
    { key: 'completed', label: 'Completed', icon: CheckCircle }
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'planned', label: 'Planned' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'Kigali', label: 'Kigali' },
    { value: 'Musanze', label: 'Musanze' },
    { value: 'Huye', label: 'Huye' },
    { value: 'Rubavu', label: 'Rubavu' }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border p-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = filters.tab === tab.key;
            
            return (
              <button
                key={tab.key}
                onClick={() => onFiltersChange({ tab: tab.key as FilterState['tab'] })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primaryColor-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-primaryColor-600 hover:bg-primaryColor-50'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={18} className="text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Additional Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFiltersChange({ status: e.target.value as FilterState['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor-500 focus:border-transparent text-sm"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={filters.location || ''}
              onChange={(e) => onFiltersChange({ location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor-500 focus:border-transparent text-sm"
            >
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TabsFilter);