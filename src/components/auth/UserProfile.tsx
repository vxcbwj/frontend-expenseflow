import React, { useState, useEffect } from "react";
import {
  userAPI,
  type UserProfile,
  type UpdateProfileData,
} from "../../services/userAPI";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await userAPI.updateProfile(formData);
      if (response.success) {
        setUser(response.user);
        setEditMode(false);
        setFormData({});
        setMessage("Profile updated successfully");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to update profile");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("preferences.")) {
      const prefField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-8">No user data found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Your Profile
        </h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("success")
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName ?? user.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{user.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName ?? user.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{user.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone ?? user.phone ?? ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ) : (
                <p className="text-lg">{user.phone || "Not provided"}</p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              {editMode ? (
                <select
                  name="preferences.theme"
                  value={formData.preferences?.theme ?? user.preferences.theme}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="auto">Auto</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              ) : (
                <p className="text-lg capitalize">{user.preferences.theme}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              {editMode ? (
                <select
                  name="preferences.currency"
                  value={
                    formData.preferences?.currency ?? user.preferences.currency
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="DZD">DZD (د.ج)</option>
                </select>
              ) : (
                <p className="text-lg">{user.preferences.currency}</p>
              )}
            </div>
          </div>
        </div>

        {editMode && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <ChangePasswordSection />
    </div>
  );
};

// Separate component for password change
const ChangePasswordSection: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setMessage("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showPasswordForm ? "Cancel" : "Change Password"}
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            message.includes("success")
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {showPasswordForm && (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
