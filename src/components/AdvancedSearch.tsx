import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Calendar, MapPin, Clock } from 'lucide-react';
import { projectsAPI } from '../api/projects';
import { useDebounce } from '../hooks/useDebounce';

interface AdvancedSearchProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

interface SearchParams {
  search?: string;
  status?: string;
  location?: string;
  date_from?: string;
  date_to?: string;
}

interface SearchSuggestions {
  locations: string[];
  titles: string[];
  sectors: string[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchParams>({});
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch search suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length >= 2) {
      try {
        const data = await projectsAPI.getSearchSuggestions(query);
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, []);

  // Handle search suggestions
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSuggestions(debouncedSearchTerm);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, fetchSuggestions]);

  // Execute search
  const handleSearch = useCallback(() => {
    const searchParams: SearchParams = {
      ...(searchTerm && { search: searchTerm }),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
    };
    
    onSearch(searchParams);
    setShowSuggestions(false);
  }, [searchTerm, filters, onSearch]);

  // Handle filter changes
  const updateFilter = (key: keyof SearchParams, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearAll = () => {
    setSearchTerm('');
    setFilters({});
    setShowSuggestions(false);
    onSearch({});
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setTimeout(() => handleSearch(), 100);
  };

  // Active filters count
  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Umuganda activities by title, location, or required skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor-500 focus:border-transparent transition-all"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {suggestions.titles.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Projects</div>
                    {suggestions.titles.map((title, index) => (
                      <button
                        key={`title-${index}`}
                        onClick={() => handleSuggestionClick(title)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                )}
                
                {suggestions.locations.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Locations</div>
                    {suggestions.locations.map((location, index) => (
                      <button
                        key={`location-${index}`}
                        onClick={() => handleSuggestionClick(location)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-primaryColor-900 hover:bg-primaryColor-800 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`border border-gray-300 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors flex items-center gap-2 relative ${
              activeFiltersCount > 0 ? 'bg-primaryColor-50 border-primaryColor-300' : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primaryColor-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryColor-500"
              >
                <option value="">All Status</option>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., Kigali, Nyarugenge"
                value={filters.location || ''}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryColor-500"
              />
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => updateFilter('date_from', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryColor-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => updateFilter('date_to', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primaryColor-500"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
            
            <button
              onClick={handleSearch}
              className="bg-primaryColor-900 hover:bg-primaryColor-800 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => 
              value && (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 bg-primaryColor-100 text-primaryColor-800 px-3 py-1 rounded-full text-sm"
                >
                  {key === 'date_from' ? 'From' : key === 'date_to' ? 'To' : key}: {value}
                  <button
                    onClick={() => updateFilter(key as keyof SearchParams, '')}
                    className="hover:bg-primaryColor-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;