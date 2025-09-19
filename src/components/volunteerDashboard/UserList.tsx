import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers } from '../../store/slices/userSlice';

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div className="text-center py-4">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Community Members</h2>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primaryColor-900 rounded-full flex items-center justify-center text-white font-semibold">
                {user.first_name?.[0] || user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.first_name} {user.last_name} ({user.username})</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              user.role === 'leader' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;