import React from 'react';
import searchIcon from '../../images/leaderdash/search.png'; 

const SearchInput: React.FC = () => (
  <div className="relative w-1/3">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <img
        src={searchIcon}
        alt="Search icon"
        className="h-5 w-5 text-gray-400"
      />
    </div>
    <input
      type="text"
      placeholder="Search..."
      className="w-full pl-12 pr-4 py-2 border border-[#DCD9D9] rounded-md bg-white focus:bg-white focus:outline-none"
    />
  </div>
);

export default SearchInput;
