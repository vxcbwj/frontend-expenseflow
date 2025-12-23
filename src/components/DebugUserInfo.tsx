// components/DebugUserInfo.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DebugUserInfo: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="font-bold mb-3">👤 User Debug Info</h3>
      {user ? (
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">ID:</span> {user.id}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-medium">Name:</span> {user.firstName}{" "}
            {user.lastName}
          </div>
          <div>
            <span className="font-medium">Role:</span> {user.role}
          </div>
          <div>
            <span className="font-medium">Assigned Company ID:</span>{" "}
            {user.assignedCompanyId || "None"}
          </div>
          <div>
            <span className="font-medium">Assigned Companies:</span>{" "}
            {user.assignedCompanies?.length
              ? user.assignedCompanies.join(", ")
              : "None"}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{" "}
            {new Date(user.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No user data</p>
      )}
    </div>
  );
};

export default DebugUserInfo;
