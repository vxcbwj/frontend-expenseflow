// pages/CompanyOwnerTestPage.tsx - FIXED VERSION (No Heroicons)
import React from "react";
import { usePermissions } from "../hooks/userPermissions";
import { useAuth } from "../contexts/AuthContext";
import { useCompany } from "../contexts/CompanyContext";
import { useNavigate } from "react-router-dom";

const CompanyOwnerTestPage: React.FC = () => {
  const {
    isSuperAdmin,
    isAdmin,
    isCompanyAdmin,
    canViewDashboard,
    canViewCompanies,
    canManageCompanies,
    canViewExpenses,
    canManageExpenses,
    canViewBudgets,
    canManageBudgets,
    canViewAnalytics,
    canViewUsers,
    canManageUsers,
    canViewProfile,
    canViewSuperAdmin,
    debugInfo,
  } = usePermissions();

  const { user } = useAuth();
  const { currentCompany, companies } = useCompany();
  const navigate = useNavigate();

  const getRoleDisplay = () => {
    if (isSuperAdmin()) return "Super Admin";
    if (isAdmin()) return "Company Owner";
    if (isCompanyAdmin()) return "Company Admin";
    return "Team Member";
  };

  const getRoleColor = () => {
    if (isSuperAdmin()) return "from-red-500 to-rose-600";
    if (isAdmin()) return "from-purple-500 to-indigo-600";
    if (isCompanyAdmin()) return "from-blue-500 to-cyan-600";
    return "from-gray-500 to-slate-600";
  };

  const canManageCompanyUsers = currentCompany
    ? canManageUsers(currentCompany.id)
    : false;

  // Permission categories
  const permissionCategories = [
    {
      title: "Dashboard & Analytics",
      icon: "📊",
      permissions: [
        { label: "View Dashboard", value: canViewDashboard() },
        { label: "View Analytics", value: canViewAnalytics() },
      ],
    },
    {
      title: "Company Management",
      icon: "🏢",
      permissions: [
        { label: "View Companies", value: canViewCompanies() },
        { label: "Manage Companies", value: canManageCompanies() },
        { label: "View Users", value: canViewUsers() },
        { label: "Manage Users", value: canManageCompanyUsers },
      ],
    },
    {
      title: "Finance Management",
      icon: "💰",
      permissions: [
        { label: "View Expenses", value: canViewExpenses() },
        { label: "Manage Expenses", value: canManageExpenses() },
        { label: "View Budgets", value: canViewBudgets() },
        { label: "Manage Budgets", value: canManageBudgets() },
      ],
    },
    {
      title: "Account & System",
      icon: "⚙️",
      permissions: [
        { label: "View Profile", value: canViewProfile() },
        { label: "View Super Admin", value: canViewSuperAdmin() },
        { label: "Is Super Admin", value: isSuperAdmin() },
      ],
    },
  ];

  // Calculate summary stats
  const totalPermissions = permissionCategories.reduce(
    (acc, cat) => acc + cat.permissions.length,
    0
  );
  const allowedPermissions = permissionCategories
    .flatMap((cat) => cat.permissions)
    .filter((p) => p.value).length;
  const deniedPermissions = totalPermissions - allowedPermissions;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
            <span className="text-2xl">🔒</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Permission Test Center
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Comprehensive overview of your access rights and permissions
            </p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <span>👤</span>
                User Information
              </h2>
              <div
                className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRoleColor()} text-white text-xs font-semibold flex items-center gap-1.5`}
              >
                <span>
                  {isSuperAdmin()
                    ? "👑"
                    : isAdmin()
                    ? "🔑"
                    : isCompanyAdmin()
                    ? "👨‍💼"
                    : "👤"}
                </span>
                {getRoleDisplay()}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  User ID
                </span>
                <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  {user?.id?.substring(0, 10)}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.email || "Not available"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Global Role
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.globalRole || "Not assigned"}
                </span>
              </div>
            </div>
          </div>

          {/* Company Info Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              <span>🏢</span>
              Company Information
            </h2>
            {currentCompany ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 flex items-center justify-center">
                      <span className="text-lg">🏢</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {currentCompany.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentCompany.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-sm">💰</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Currency
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {currentCompany.currency}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Company ID
                    </span>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {currentCompany.id.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Companies
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {companies.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No company selected
                </p>
                <button
                  onClick={() => navigate("/my-companies")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  <span>→</span>
                  Select Company
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Permission Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            📊 Permission Overview
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 text-green-500">✅</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Allowed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 text-red-500">❌</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Denied
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {permissionCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {category.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {category.permissions.map((permission, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${
                            permission.value
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          }`}
                        >
                          <span
                            className={`${
                              permission.value
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {permission.value ? "👁️" : "🚫"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {permission.label}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          permission.value
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {permission.value ? (
                          <>
                            <span className="text-lg">✅</span>
                            <span className="text-sm font-medium">Allowed</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">❌</span>
                            <span className="text-sm font-medium">Denied</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          🚀 Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            disabled={!canViewDashboard()}
            className={`group flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
              canViewDashboard()
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>📊</span>
            <span className="font-semibold">Go to Dashboard</span>
            {canViewDashboard() && (
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/my-companies")}
            disabled={!canViewCompanies()}
            className={`group flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
              canViewCompanies()
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>🏢</span>
            <span className="font-semibold">Manage Companies</span>
            {canViewCompanies() && (
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/expenses")}
            disabled={!canViewExpenses()}
            className={`group flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
              canViewExpenses()
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>💰</span>
            <span className="font-semibold">View Expenses</span>
            {canViewExpenses() && (
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Debug Information */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
              <span className="text-lg">🔧</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Debug Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Raw permission data for troubleshooting
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                User Data:
              </h4>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 overflow-auto">
                <pre className="text-xs text-gray-700 dark:text-gray-300">
                  {JSON.stringify(debugInfo.user, null, 2)}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Permissions Summary:
              </h4>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 overflow-auto">
                <pre className="text-xs text-gray-700 dark:text-gray-300">
                  {JSON.stringify(debugInfo.permissions, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold mb-1">{totalPermissions}</div>
          <div className="text-sm opacity-90">Total Permissions</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold mb-1">{allowedPermissions}</div>
          <div className="text-sm opacity-90">Allowed</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold mb-1">{deniedPermissions}</div>
          <div className="text-sm opacity-90">Denied</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold mb-1">{companies.length}</div>
          <div className="text-sm opacity-90">Companies</div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOwnerTestPage;
