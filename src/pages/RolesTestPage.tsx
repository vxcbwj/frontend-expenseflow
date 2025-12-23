// pages/RolesTestPage.tsx - UPDATED
import React from "react";
import { usePermissions } from "../hooks/userPermissions";

const RolesTestPage: React.FC = () => {
  const {
    isSuperAdmin,
    isCompanyOwner,
    isCompanyAdmin,
    isMember,
    canManageCompanies,
    canViewCompanies,
    canViewUsers,
    debugInfo,
  } = usePermissions();

  // debugInfo is now an OBJECT, not a function
  const debugData = debugInfo; // Direct assignment

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Role Testing Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Role Checks</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>isSuperAdmin</span>
              <span
                className={isSuperAdmin() ? "text-green-600" : "text-red-600"}
              >
                {isSuperAdmin() ? "✅ TRUE" : "❌ FALSE"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>isCompanyOwner</span>
              <span
                className={isCompanyOwner() ? "text-green-600" : "text-red-600"}
              >
                {isCompanyOwner() ? "✅ TRUE" : "❌ FALSE"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>isCompanyAdmin</span>
              <span
                className={isCompanyAdmin() ? "text-green-600" : "text-red-600"}
              >
                {isCompanyAdmin() ? "✅ TRUE" : "❌ FALSE"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>isMember</span>
              <span className={isMember() ? "text-green-600" : "text-red-600"}>
                {isMember() ? "✅ TRUE" : "❌ FALSE"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Permission Checks</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>canManageCompanies</span>
              <span
                className={
                  canManageCompanies() ? "text-green-600" : "text-red-600"
                }
              >
                {canManageCompanies() ? "✅ TRUE" : "❌ FALSE"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>canViewCompanies</span>
              <span
                className={
                  canViewCompanies() ? "text-green-600" : "text-red-600"
                }
              >
                {canViewCompanies() ? "✅ TRUE" : "❌ FALSE"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>canViewUsers</span>
              <span
                className={canViewUsers() ? "text-green-600" : "text-red-600"}
              >
                {canViewUsers() ? "✅ TRUE" : "❌ FALSE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(debugData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default RolesTestPage;
