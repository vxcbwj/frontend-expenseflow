// components/company/CompanyOwnerManagement.tsx - FIXED VERSION
import React from "react";
import { useNavigate } from "react-router-dom"; // Added for better navigation
import { useCompany } from "../../contexts/CompanyContext";
import { usePermissions } from "../../hooks/userPermissions";
import { useAuth } from "../../contexts/AuthContext";

interface CompanyWithRole {
  id: string;
  name: string;
  industry: string;
  currency: string;
  createdAt: string;
  userRole?: string; // "owner", "admin", "member"
  canManage?: boolean;
}

const CompanyOwnerManagement: React.FC = () => {
  const navigate = useNavigate(); // Use navigate instead of window.location
  const { companies, loading, fetchCompanies } = useCompany();
  const { isAdmin, isCompanyAdmin, canManageCompanies } = usePermissions(); // Changed isCompanyOwner to isAdmin
  const { user } = useAuth();

  // Check permissions
  const shouldShowPage = React.useMemo(() => {
    return canManageCompanies() || isAdmin() || isCompanyAdmin();
  }, [canManageCompanies, isAdmin, isCompanyAdmin]);

  // Get user's role display name
  const getUserRoleDisplay = React.useMemo(() => {
    if (isAdmin()) return "Company Owner";
    if (isCompanyAdmin()) return "Company Admin";
    return "Team Member";
  }, [isAdmin, isCompanyAdmin]);

  if (!shouldShowPage) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You need company owner or admin permissions to access this page.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Your role: {user?.globalRole || "member"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading your companies...
        </span>
      </div>
    );
  }

  // Filter companies where user has a role
  const userCompanies = React.useMemo(() => {
    return (companies as CompanyWithRole[]).filter(
      (company) => company.userRole || company.canManage
    );
  }, [companies]);

  // If no companies found but user has permission, they might not be assigned yet
  if (userCompanies.length === 0 && companies.length > 0) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            🏢 Company Access Issue
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            You have permission but no companies are assigned to your account.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
            ⚠️ Information
          </h2>
          <div className="space-y-3">
            <p>
              <strong>Your Role:</strong> {user?.globalRole || "Unknown"}
            </p>
            <p>
              <strong>Your Display Role:</strong> {getUserRoleDisplay}
            </p>
            <p>
              <strong>Companies in System:</strong> {companies.length}
            </p>
            <p>
              <strong>Your Companies:</strong> {userCompanies.length}
            </p>
            <div className="mt-4 space-x-3">
              <button
                onClick={fetchCompanies}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Company Data
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no companies at all
  if (companies.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏢</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No Companies Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There are no companies in the system yet.
          </p>
          <div className="mt-6">
            {isAdmin() && (
              <button
                onClick={() => navigate("/companies?action=create")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Company
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              🏢 My Companies
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Full control panel for your companies
            </p>
          </div>
          <button
            onClick={fetchCompanies}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
          >
            <span className="mr-2">🔄</span>
            Refresh
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              isAdmin()
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
          >
            {getUserRoleDisplay}
          </span>
          <span className="text-xs text-gray-500">
            {userCompanies.length} compan
            {userCompanies.length === 1 ? "y" : "ies"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCompanies.map((company) => {
          const role = company.userRole || "member";
          const isOwner = role === "owner";
          const isAdminInCompany = role === "admin" || isOwner;

          return (
            <div
              key={company.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {company.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    isOwner
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {isOwner ? "Owner" : "Admin"}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Industry:</span>{" "}
                  {company.industry}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Currency:</span>{" "}
                  {company.currency}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(company.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  <span className="font-semibold">ID:</span>{" "}
                  {company.id.substring(0, 8)}...
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate(`/dashboard?company=${company.id}`)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  📊 Go to Dashboard
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/expenses?company=${company.id}`)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center justify-center"
                    disabled={!isAdminInCompany} // Only admins can manage expenses
                  >
                    {isAdminInCompany ? "💰 Expenses" : "👁️ View Expenses"}
                  </button>
                  <button
                    onClick={() => navigate(`/budgets?company=${company.id}`)}
                    className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-xs font-medium flex items-center justify-center"
                    disabled={!isAdminInCompany} // Only admins can manage budgets
                  >
                    {isAdminInCompany ? "📈 Manage Budgets" : "👁️ View Budgets"}
                  </button>
                  <button
                    onClick={() => navigate(`/analytics?company=${company.id}`)}
                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center justify-center"
                  >
                    📊 Analytics
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => navigate(`/company-users/${company.id}`)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs font-medium flex items-center justify-center"
                    >
                      👥 Team Management
                    </button>
                  )}
                  {!isOwner && isAdminInCompany && (
                    <button
                      onClick={() => navigate(`/companies?id=${company.id}`)}
                      className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium flex items-center justify-center"
                    >
                      ⚙️ Settings
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyOwnerManagement;
