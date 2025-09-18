// src/components/SortDropdown.tsx

import React from 'react';
import type { SortState } from '../../types/Volunteer';

interface SortDropdownProps {
  sort: SortState;
  onSortChange: (newSort: SortState) => void;
}

const sortByOptions: SortState['sortBy'][] = [
  'created_at',
  'datetime',
  'title',
  'volunteer_count',
  'required_volunteers',
];

const SortDropdown: React.FC<SortDropdownProps> = ({ sort, onSortChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Sort by:</label>
      <select
        value={sort.sortBy}
        onChange={(e) =>
          onSortChange({ ...sort, sortBy: e.target.value as SortState['sortBy'] })
        }
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
      >
        {sortByOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </option>
        ))}
      </select>
      <select
        value={sort.order}
        onChange={(e) =>
          onSortChange({ ...sort, order: e.target.value as SortState['order'] })
        }
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortDropdown;
