// pages/DebugPermissionsPage.tsx - UPDATED
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../hooks/userPermissions";

const DebugPermissionsPage: React.FC = () => {
  const { user } = useAuth();
  const permissions = usePermissions();

  // Get the first company ID for testing if needed
  const firstCompanyId = user?.companyRoles?.[0]?.companyId || "test-company";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔧 Debug Permissions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">👤 User Information</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Email:</span> {user?.email}
            </div>
            <div>
              <span className="font-semibold">Role:</span> {user?.role}
            </div>
            <div>
              <span className="font-semibold">Global Role:</span>{" "}
              {user?.globalRole}
            </div>
            <div>
              <span className="font-semibold">Company Roles:</span>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-auto">
                {JSON.stringify(user?.companyRoles || [], null, 2)}
              </pre>
            </div>
            <div>
              <span className="font-semibold">Assigned Companies:</span>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-auto">
                {JSON.stringify(user?.assignedCompanies || [], null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Permission Checks Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🔐 Permission Checks</h2>
          <div className="space-y-3">
            <div
              className={`p-3 rounded ${
                permissions.isSuperAdmin()
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              isSuperAdmin: {permissions.isSuperAdmin() ? "✅" : "❌"}
            </div>
            <div
              className={`p-3 rounded ${
                permissions.isCompanyOwner()
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              isCompanyOwner: {permissions.isCompanyOwner() ? "✅" : "❌"}
            </div>
            <div
              className={`p-3 rounded ${
                permissions.isCompanyAdmin()
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              isCompanyAdmin: {permissions.isCompanyAdmin() ? "✅" : "❌"}
            </div>
            <div
              className={`p-3 rounded ${
                permissions.isMember()
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              isMember: {permissions.isMember() ? "✅" : "❌"}
            </div>
            <div
              className={`p-3 rounded ${
                permissions.canViewCompanies()
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              canViewCompanies: {permissions.canViewCompanies() ? "✅" : "❌"}
            </div>
            <div
              className={`p-3 rounded ${
                permissions.canManageCompanies()
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              canManageCompanies:{" "}
              {permissions.canManageCompanies() ? "✅" : "❌"}
            </div>
            <div
              className={`p-3 rounded ${
                permissions.canViewUsers()
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              canViewUsers: {permissions.canViewUsers() ? "✅" : "❌"}
            </div>
            <div
              className={`p-3 rounded ${
                permissions.canManageUsers(firstCompanyId)
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              canManageUsers (for first company):{" "}
              {permissions.canManageUsers(firstCompanyId) ? "✅" : "❌"}
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Company ID: {firstCompanyId.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>

        {/* Role Analysis Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">📊 Role Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Current Role Detection</h3>
              <div className="space-y-1">
                <div>
                  Role field: <code>{user?.role}</code>
                </div>
                <div>
                  Global Role: <code>{user?.globalRole}</code>
                </div>
                <div>
                  Detected Role:{" "}
                  <code>
                    {permissions.isCompanyOwner()
                      ? "COMPANY_OWNER"
                      : permissions.isCompanyAdmin()
                      ? "COMPANY_ADMIN"
                      : permissions.isSuperAdmin()
                      ? "SUPER_ADMIN"
                      : permissions.isMember()
                      ? "MEMBER"
                      : "UNKNOWN"}
                  </code>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Company Access</h3>
              <div className="space-y-1">
                <div>Company IDs: {permissions.getCompanyIds().length}</div>
                <div>Company Roles: {user?.companyRoles?.length || 0}</div>
                {user?.companyRoles?.map((cr: any, index: number) => (
                  <div key={index} className="text-sm">
                    Company: {cr.companyId?.substring(0, 8)}... → Role:{" "}
                    {cr.role}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Expected Access</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Company Owner: Full control of their companies</li>
                <li>Company Admin: Manage expenses/budgets/analytics</li>
                <li>Member: View-only access</li>
                <li>Super Admin: Full system control</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            🔍 Understanding Permission Functions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">No Parameters Needed:</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <code>isSuperAdmin()</code> - Checks global role
                </li>
                <li>
                  <code>isCompanyOwner()</code> - Checks if user owns any
                  company
                </li>
                <li>
                  <code>isCompanyAdmin()</code> - Checks if user is admin in any
                  company
                </li>
                <li>
                  <code>isMember()</code> - Checks if user is member in any
                  company
                </li>
                <li>
                  <code>canViewCompanies()</code> - Basic view permission
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Company ID Required:</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <code>canManageUsers(companyId)</code> - Needs specific
                  company
                </li>
                <li>
                  <code>canManageCompanies(companyId)</code> - Company-specific
                </li>
                <li>
                  These functions check permissions for a PARTICULAR company
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/50 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> The <code>canManageUsers()</code> function
              requires a company ID because permission to manage users is
              specific to each company. A user might be able to manage users in
              Company A but not in Company B.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPermissionsPage;
