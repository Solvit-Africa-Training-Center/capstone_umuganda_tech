import React, { useState, useEffect } from 'react';
import { User, Camera, Save, X, Plus, Trash2, Settings, Shield, Bell } from 'lucide-react';
import { usersAPI } from '../../api/users';
import { useAuth } from '../../hooks/useAuth';
import type { User as UserType, Skill } from '../../types/api';

interface LeaderSettingsProps {
  isLoading?: boolean;
}

const LeaderSettings: React.FC<LeaderSettingsProps> = ({ isLoading }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(authUser);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    sector: ''
  });
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUserData = async () => {
    if (!authUser?.id) return;
    
    try {
      console.log('🔄 Fetching user data for ID:', authUser.id);
      const userData = await usersAPI.getUser(authUser.id);
      console.log('✅ Fetched user data:', userData);
      console.log('📸 Avatar URL:', userData.avatar);
      
      setUser(userData);
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        sector: userData.sector || ''
      });
    } catch (error) {
      console.error('❌ Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchSkills();
    fetchUserSkills();
  }, [authUser]);

  const fetchSkills = async () => {
    try {
      console.log('📚 Fetching available skills...');
      const skills = await usersAPI.getSkills();
      console.log('✅ Available skills:', skills);
      setAvailableSkills(Array.isArray(skills) ? skills : skills.results || []);
    } catch (error: any) {
      console.error('❌ Failed to fetch skills:', error);
      console.error('Error response:', error.response?.data);
      setAvailableSkills([]);
    }
  };

  const fetchUserSkills = async () => {
    try {
      console.log('👤 Fetching user skills...');
      const skills = await usersAPI.getUserSkills();
      console.log('✅ User skills:', skills);
      setUserSkills(Array.isArray(skills) ? skills : skills.results || []);
    } catch (error: any) {
      console.error('❌ Failed to fetch user skills:', error);
      console.error('Error response:', error.response?.data);
      setUserSkills([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updatedUser = await usersAPI.updateProfile(user.id, formData);
      console.log('Profile updated:', updatedUser);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📸 Selected file:', file.name, file.type, file.size);

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      console.log('🚀 Uploading avatar...');
      const updatedUser = await usersAPI.uploadAvatar(file);
      console.log('✅ Avatar upload response:', updatedUser);
      
      // Fetch updated user data to show new avatar
      await fetchUserData();
      setRefreshKey(prev => prev + 1);
      console.log('Avatar updated and user data refreshed');
      
      alert('Avatar updated successfully!');
    } catch (error: any) {
      console.error('❌ Failed to upload avatar:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to upload avatar';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to delete your avatar?')) return;
    
    try {
      await usersAPI.deleteAvatar();
      
      // Fetch updated user data to remove avatar
      await fetchUserData();
      console.log('Avatar deleted and user data refreshed');
      alert('Avatar deleted successfully!');
    } catch (error) {
      console.error('Failed to delete avatar:', error);
      alert('Failed to delete avatar');
    }
  };

  const handleAddSkill = async (skillId: number) => {
    if (!user) return;
    
    console.log('🚀 Adding skill:', skillId, 'for user:', user.id);
    
    try {
      const result = await usersAPI.addUserSkill(user.id, skillId);
      console.log('✅ Skill added:', result);
      await fetchUserSkills();
      alert('Skill added successfully!');
    } catch (error: any) {
      console.error('❌ Failed to add skill:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to add skill';
      alert(errorMessage);
    }
  };

  const handleRemoveSkill = async (userSkillId: number) => {
    console.log('🗑️ Removing skill:', userSkillId);
    
    try {
      await usersAPI.removeUserSkill(userSkillId);
      console.log('✅ Skill removed');
      await fetchUserSkills();
      alert('Skill removed successfully!');
    } catch (error: any) {
      console.error('❌ Failed to remove skill:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to remove skill';
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings & Preferences</h1>
        <p className="text-gray-600">Manage your profile and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Picture</h2>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                {(() => {
                  console.log('🖼️ Rendering avatar. User:', user);
                  console.log('🖼️ Avatar value:', user?.avatar);
                  return user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      onLoad={() => console.log('✅ Avatar image loaded successfully')}
                      onError={(e) => console.error('❌ Avatar image failed to load:', e)}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primaryColor-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                  );
                })()}
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="flex items-center gap-2 bg-primaryColor-600 text-white px-4 py-2 rounded-lg hover:bg-primaryColor-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    Upload Photo
                  </div>
                </label>
                
                {user?.avatar && (
                  <button
                    onClick={handleDeleteAvatar}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Photo
                  </button>
                )}
                
                <p className="text-xs text-gray-500">Max 5MB, JPG/PNG only</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-600"
                >
                  <option value="">Select Sector</option>
                  <option value="Gasabo">Gasabo</option>
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Nyarugenge">Nyarugenge</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="mt-6 flex items-center gap-2 bg-primaryColor-600 text-white px-6 py-3 rounded-lg hover:bg-primaryColor-700 disabled:bg-gray-400 transition-colors"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>

          {/* Skills Management */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
            
            {/* Current Skills */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 bg-primaryColor-100 text-primaryColor-800 px-3 py-1 rounded-full">
                    <span className="text-sm">{skill.name}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-primaryColor-600 hover:text-primaryColor-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {userSkills.length === 0 && (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}
              </div>
            </div>
            
            {/* Available Skills */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Add Skills</h3>
              <div className="flex flex-wrap gap-2">
                {availableSkills
                  .filter(skill => !userSkills.some(us => us.id === skill.id))
                  .map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => handleAddSkill(skill.id)}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="text-sm">{skill.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Privacy Settings</p>
                  <p className="text-xs text-gray-500">Manage your privacy preferences</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Notifications</p>
                  <p className="text-xs text-gray-500">Configure notification preferences</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">General Settings</p>
                  <p className="text-xs text-gray-500">Language, timezone, etc.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Info</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{user?.phone_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Joined:</span>
                <span className="font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderSettings;