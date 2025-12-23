// shows user infos (accessing protected data with the JWT token)
import React, { useState, useEffect } from "react";
import { userAPI, type UserProfile } from "../../services/userAPI";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null); // store user data
  const [loading, setLoading] = useState(true); // show loading stats
  const [error, setError] = useState(""); // handle errors

  useEffect(() => {
    // function that runs once the component loads
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile(); // auto-sends JWT token
        if (response.success) {
          setUser(response.user); // store user data from backend
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>; // show loading
  if (error) return <div>Error: {error}</div>; // show error
  if (!user) return <div>No user data found</div>; // show empty state

  return (
    <div className="max-w-md mx-auto bg-accent-2 p-6 rounded-lg shadow-md dark:bg-gray-800 transition-all">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Your Profile
      </h2>

      <div className="space-y-4">
        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            First Name:
          </label>
          <p className="text-gray-800 dark:text-white">{user.firstName}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            Last Name:
          </label>
          <p className="text-gray-800 dark:text-white">{user.lastName}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            Email:
          </label>
          <p className="text-gray-800 dark:text-white">{user.email}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            Phone:
          </label>
          <p className="text-gray-800 dark:text-white">
            {user.phone || "Not provided"}
          </p>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">
            User ID:
          </label>
          <p className="text-sm text-secondary dark:text-gray-400">{user.id}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
