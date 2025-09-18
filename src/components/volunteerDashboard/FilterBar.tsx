// src/components/FilterBar.tsx

import React from 'react';
import type { FilterState } from '../../types/Volunteer';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
}

const statusOptions = ['', 'planned', 'ongoing', 'completed', 'cancelled'];

const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
      <input
        type="text"
        placeholder="Search projects..."
        value={filter.search || ''}
        onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 flex-1"
      />
      <select
        value={filter.status || ''}
        onChange={(e) =>
          onFilterChange({
            ...filter,
            status: e.target.value as FilterState['status'],
          })
        }
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
      >
        <option value="">All Status</option>
        {statusOptions.map((st) =>
          st ? (
            <option key={st} value={st}>
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </option>
          ) : null
        )}
      </select>
      <input
        type="text"
        placeholder="Location"
        value={filter.location || ''}
        onChange={(e) =>
          onFilterChange({ ...filter, location: e.target.value })
        }
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>
  );
};

export default FilterBar;
