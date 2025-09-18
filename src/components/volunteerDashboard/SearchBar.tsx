import React, { useCallback, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  searchValue: string;
  locationValue: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  locationValue,
  onSearchChange,
  onLocationChange
}) => {
  const debouncedSearchChange = useCallback(
    useDebounce(onSearchChange, 300),
    [onSearchChange]
  );
  
  const debouncedLocationChange = useCallback(
    useDebounce(onLocationChange, 300),
    [onLocationChange]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearchChange(e.target.value);
  }, [debouncedSearchChange]);

  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedLocationChange(e.target.value);
  }, [debouncedLocationChange]);
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by title, description..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor-500 focus:border-transparent"
          />
        </div>

        {/* Location Input */}
        <div className="relative sm:w-64">
          <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            value={locationValue}
            onChange={handleLocationChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SearchBar);