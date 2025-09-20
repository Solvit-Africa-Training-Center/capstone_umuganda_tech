import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search, Users, UserPlus, UserMinus, Camera, MapPin, Calendar, Award } from 'lucide-react';
import { usersAPI } from '../api/users';
import type { User, PaginatedResponse } from '../types/api';
import type { RootState } from '../store';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [followingUsers, setFollowingUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data: PaginatedResponse<User> = await usersAPI.getUsers({
        page: currentPage,
        page_size: 12
      });
      
      setUsers(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 12));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async (userId: number, isFollowing: boolean) => {
    if (followingUsers.has(userId)) return;
    
    setFollowingUsers(prev => new Set(prev).add(userId));
    
    try {
      if (isFollowing) {
        await usersAPI.unfollowLeader(userId);
      } else {
        await usersAPI.followLeader(userId);
      }
      
      // Update user's following status
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_following: !isFollowing }
          : user
      ));
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setFollowingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const openUserProfile = async (userId: number) => {
    try {
      const userData = await usersAPI.getUser(userId);
      setSelectedUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primaryColor-500 to-primaryColor-700"></div>
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.first_name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {user.first_name[0]}{user.last_name[0]}
                </span>
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
              user.role === 'leader' ? 'bg-yellow-400' : 'bg-green-400'
            }`}>
              {user.role === 'leader' && <Award className="w-3 h-3 text-white m-1" />}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-16 p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-sm text-primaryColor-600 font-medium capitalize mb-2">
            {user.role}
          </p>
          
          {user.sector && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {user.sector}
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            Joined {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => openUserProfile(user.id)}
            className="text-primaryColor-600 hover:text-primaryColor-800 font-medium text-sm transition-colors"
          >
            View Profile
          </button>
          
          {user.role === 'leader' && currentUser?.id !== user.id && (
            <button
              onClick={() => handleFollowToggle(user.id, user.is_following || false)}
              disabled={followingUsers.has(user.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                user.is_following
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primaryColor-100 text-primaryColor-700 hover:bg-primaryColor-200'
              } disabled:opacity-50`}
            >
              {followingUsers.has(user.id) ? (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              ) : user.is_following ? (
                <UserMinus className="w-3 h-3" />
              ) : (
                <UserPlus className="w-3 h-3" />
              )}
              {user.is_following ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const UserProfileModal: React.FC = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-primaryColor-500 to-primaryColor-700"></div>
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
            
            <div className="absolute -bottom-16 left-8">
              {selectedUser.avatar_url ? (
                <img
                  src={selectedUser.avatar_url}
                  alt={selectedUser.first_name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-600">
                    {selectedUser.first_name[0]}{selectedUser.last_name[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-20 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedUser.first_name} {selectedUser.last_name}
                </h2>
                <p className="text-lg text-primaryColor-600 font-medium capitalize mb-4">
                  {selectedUser.role}
                </p>
              </div>
              
              {selectedUser.role === 'leader' && currentUser?.id !== selectedUser.id && (
                <button
                  onClick={() => handleFollowToggle(selectedUser.id, selectedUser.is_following || false)}
                  disabled={followingUsers.has(selectedUser.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedUser.is_following
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-primaryColor-600 text-white hover:bg-primaryColor-700'
                  } disabled:opacity-50`}
                >
                  {followingUsers.has(selectedUser.id) ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : selectedUser.is_following ? (
                    <UserMinus className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {selectedUser.is_following ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Phone:</span> {selectedUser.phone_number}</p>
                  {selectedUser.email && (
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  )}
                  {selectedUser.sector && (
                    <p><span className="font-medium">Location:</span> {selectedUser.sector}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Activity</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Member since:</span> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  <p><span className="font-medium">Skills:</span> {selectedUser.skills?.length || 0}</p>
                  <p><span className="font-medium">Badges:</span> {selectedUser.badges?.length || 0}</p>
                </div>
              </div>
            </div>

            {selectedUser.skills && selectedUser.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primaryColor-100 text-primaryColor-800 rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Community Members</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with volunteers and leaders in your community
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor-500"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading members...</p>
          </div>
        )}

        {/* Users Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-primaryColor-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No members found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* User Profile Modal */}
        <UserProfileModal />
      </div>
    </div>
  );
};

export default UserManagement;