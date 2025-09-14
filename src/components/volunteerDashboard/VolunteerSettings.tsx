// src/components/volunteerComponents/VolunteerSettings/VolunteerSettings.tsx

import React, { useState } from "react";
import type { Volunteer, PasswordChange } from "../../types/Volunteer";

interface Props {
  volunteer: Volunteer;
  onLogout: () => void;
}

const VolunteerSettings: React.FC<Props> = ({ volunteer, onLogout }) => {
  const [profile, setProfile] = useState<Volunteer>(volunteer);

  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const handleProfileChange = (field: keyof Volunteer, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // For demo: preview using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        setProfile(prev => ({ ...prev, profilePhotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfile(prev => ({ ...prev, profilePhotoUrl: undefined }));
  };

  const handleSaveProfile = () => {
    // TODO: send profile data to backend
    console.log("Saving profile:", profile);
  };

  const handleChangePassword = () => {
    if (passwordChange.newPassword !== passwordChange.confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }
    // TODO: send password change to backend
    console.log("Changing password:", passwordChange);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">

        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            { profile.profilePhotoUrl
              ? <img src={profile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-500">No Photo</div>
            }
          </div>
          <div className="space-y-2">
            <label className="block">
              <span className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">Upload New Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {profile.profilePhotoUrl && (
              <button
                onClick={handleRemovePhoto}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* Profile fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={e => handleProfileChange("firstName", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={e => handleProfileChange("lastName", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => handleProfileChange("email", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
            />
          </div>
          {profile.phone !== undefined && (
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={e => handleProfileChange("phone", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
              />
            </div>
          )}
          {profile.address !== undefined && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                value={profile.address || ""}
                onChange={e => handleProfileChange("address", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
              />
            </div>
          )}
          {profile.sector !== undefined && (
            <div>
              <label className="block text-sm font-medium">Sector</label>
              <input
                type="text"
                value={profile.sector || ""}
                onChange={e => handleProfileChange("sector", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSaveProfile}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
          <button
            onClick={onLogout}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>

        <hr className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Change Password</h3>

          <div className="grid grid-cols-1 gap-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium">Current Password</label>
              <input
                type="password"
                value={passwordChange.currentPassword}
                onChange={e =>
                  setPasswordChange(prev => ({ ...prev, currentPassword: e.target.value }))
                }
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                value={passwordChange.newPassword}
                onChange={e =>
                  setPasswordChange(prev => ({ ...prev, newPassword: e.target.value }))
                }
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirm New Password</label>
              <input
                type="password"
                value={passwordChange.confirmNewPassword}
                onChange={e =>
                  setPasswordChange(prev => ({ ...prev, confirmNewPassword: e.target.value }))
                }
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
              />
            </div>

            <button
              onClick={handleChangePassword}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VolunteerSettings;
