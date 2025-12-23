// pages/UsersDebugPage.tsx - FIXED
import React from "react";
import { usePermissions } from "../hooks/userPermissions";
import { useAuth } from "../contexts/AuthContext";

const UsersDebugPage: React.FC = () => {
  const { user } = useAuth();
  const { debugInfo } = usePermissions();

  // debugInfo is now an OBJECT, not a function
  const debugData = debugInfo; // Direct assignment

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Users Debug Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>User ID</span>
              <span className="text-sm font-mono">{user?.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Global Role</span>
              <span className="font-semibold">{user?.globalRole}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Company Roles Count</span>
              <span>{user?.companyRoles?.length || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Company Roles</h2>
          {user?.companyRoles && user.companyRoles.length > 0 ? (
            <div className="space-y-3">
              {user.companyRoles.map((role, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">Company ID:</span>
                    <span className="text-sm font-mono">{role.companyId}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Role:</span>
                    <span className="font-semibold">{role.role}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Joined:</span>
                    <span className="text-sm">
                      {new Date(role.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No company roles assigned</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Complete Debug Information
        </h2>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(debugData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UsersDebugPage;
