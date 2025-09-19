import React from 'react';
import { Link } from 'react-router';
import profile from "../../images/leaderdash/profile.png";
import notification  from "../../images/leaderdash/notify.png"
import SearchInput from './SearchInput';


const TopNav: React.FC = () => (
  <div className=" px-6 md:py-4 flex items-center justify-end gap-10">
    <SearchInput />

    <div className="flex items-center space-x-6">
      <button className="relative p-2 rounded hover:bg-gray-200">
        <img src={notification} alt="notification icon" />
        <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <Link to="#" className="flex items-center space-x-2">
        <img src={profile} alt="user profile" />
      </Link>
    </div>
  </div>
);

export default TopNav;
