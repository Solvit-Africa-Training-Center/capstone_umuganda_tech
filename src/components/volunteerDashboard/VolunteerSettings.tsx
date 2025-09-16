import React, { useState, useEffect } from "react";
import type { Volunteer, PasswordChange } from "../../types/Volunteer";
import { LogOut } from 'lucide-react';
import out from "../../images/volunteer/Vector (5).png";
import profileuser from "../../images/volunteer/ix_user-profile-filled.png"
import download from "../../images/volunteer/material-symbols_upload.png"

interface Props {
  volunteer: Volunteer;
  onLogout: () => void;
}

const VolunteerSettings: React.FC<Props> = ({ volunteer, onLogout }) => {
  // Ensure that profile.position (and any optional string fields) are always strings
  const [profile, setProfile] = useState<Volunteer>({
    ...volunteer,
    position: volunteer.position ?? "",
    sector: volunteer.sector ?? "",
    // (if there are other optional string fields, initialize them similarly)
  });

  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  // If the volunteer prop can change over time, sync it
  useEffect(() => {
    setProfile({
      ...volunteer,
      position: volunteer.position ?? "",
      sector: volunteer.sector ?? "",
    });
  }, [volunteer]);

  const handleProfileChange = (field: keyof Volunteer, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
    <div className="bg-primaryColor-200 w-full min-h-screen flex items-center justify-center pt-16">
      <div className="flex items-center justify-center bg-white pl-6 pt-6 w-full mx-auto border-t border-[#B1AEAE]">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 max-w-3xl space-y-6">
          <div className="flex flex-row items-center space-x-2 mb-4">
            <img src={profileuser} alt="profile" />
            <p>Profile Picture</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              { profile.profilePhotoUrl
                ? <img src={profile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-500">No Photo</div>
              }
            </div>
            <div className="space-y-2">
              <label className="block">
                <div className="flex flex-row items-center px-3 w-48 bg-primaryColor-900  hover:bg-accent-900 rounded-md cursor-pointer">
                  <img src={download} alt="" />
                  <span className="px-4 py-2 bg-primaryColor-900 text-white hover:bg-accent-900 rounded cursor-pointer">
                  Upload New Photo
                  </span>
                </div>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Position</label>
              <input
                type="text"
                value={profile.position}  
                onChange={e => handleProfileChange("position", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Sector</label>
              <input
                type="text"
                value={profile.sector}
                onChange={e => handleProfileChange("sector", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-green-500"
              />
            </div>

          </div>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-primaryColor-900 text-white rounded hover:bg-accent-900 transition"
            >
              Save Changes
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
                className="px-2 py-2 bg-primaryColor-900 max-w-[170px] text-white rounded hover:bg-accent-900 transition"
              >
                Update Password
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center space-x-2">
              <img src={out} alt="about logout" />
              <p>You will be signed out of your account on all devices.</p>
            </div>
             <div className="flex flex-row items-center px-3 mt-4 w-32 bg-warning-800  hover:bg-accent-900 rounded-md">
              <LogOut className="text-white"/>
              <button
                onClick={onLogout}
                className="px-2 py-2 text-white rounded transition"
              >
                Logout
              </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VolunteerSettings;
