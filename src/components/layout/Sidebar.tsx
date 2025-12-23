// components/layout/Sidebar.tsx - UPDATED
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePermissions } from "../../hooks/userPermissions";
import { useCompany } from "../../contexts/CompanyContext";
import {
  UsersIcon,
  DashboardIcon,
  BudgetIcon,
  AnalyticsIcon,
  CompanyIcon,
  ProfileIcon,
  ChevronLeftIcon,
  // Add these if they exist in your Icons component
  // ShieldIcon, BarChartIcon, FileTextIcon, SearchIcon, PackageIcon
} from "../ui/Icons";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, FileText, Search, Package } from "lucide-react";

// Define proper types
interface SidebarItem {
  path: string;
  icon: React.ComponentType<{ className?: string }> | React.ElementType;
  label: string;
  show: boolean;
  disabled?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isSuperAdmin,
    isCompanyOwner,
    canViewDashboard,
    canViewCompanies,
    canViewBudgets,
    canViewExpenses,
    canViewAnalytics,
    canViewUsers,
    canViewProfile,
  } = usePermissions();

  const { currentCompany } = useCompany();

  const isLoggedIn = !!localStorage.getItem("token");
  const isActive = (path: string) => location.pathname === path;
  const { user } = useAuth();
  console.log({ user });

  // FIX: Updated to match App.tsx routes
  const baseItems: SidebarItem[] = [
    {
      path: "/dashboard",
      icon: DashboardIcon,
      label: "Dashboard",
      show: canViewDashboard() && user?.globalRole !== "member",
    },
    {
      path: "/expenses",
      icon: BudgetIcon,
      label: "Expenses",
      show: canViewExpenses(),
    },
    {
      path: "/budgets",
      icon: BudgetIcon,
      label: "Budgets",
      show: canViewBudgets(),
    },
    {
      path: "/analytics",
      icon: AnalyticsIcon,
      label: "Analytics",
      show: canViewAnalytics(),
    },
    {
      path: "/my-companies",
      icon: CompanyIcon,
      label: "My Companies",
      // Hide for members AND company admins, show only for company owners
      show:
        !isSuperAdmin() &&
        user?.globalRole === "company_owner" && // Only company owners
        canViewCompanies(),
    },
    {
      path: currentCompany
        ? `/company-users/${currentCompany.id}`
        : "/my-companies",
      icon: UsersIcon,
      label: "Team Management",
      // Hide for members, show only when user can view users AND has current company
      show:
        !isSuperAdmin() &&
        user?.globalRole !== "member" &&
        canViewUsers() &&
        !!currentCompany,
      disabled: !currentCompany,
    },
    {
      path: "/profile",
      icon: ProfileIcon,
      label: "Profile",
      show: canViewProfile(),
    },
  ];

  // Super admin items - Use lucide-react icons directly
  const superAdminItems: SidebarItem[] = isSuperAdmin()
    ? [
        {
          path: "/super-admin/system-stats",
          icon: BarChart3, // Using BarChart3 from lucide-react
          label: "System Stats",
          show: true,
        },
        {
          path: "/super-admin/audit-logs",
          icon: FileText, // Using FileText from lucide-react
          label: "Audit Logs",
          show: true,
        },
        {
          path: "/super-admin/search",
          icon: Search, // Using Search from lucide-react
          label: "Global Search",
          show: true,
        },
        {
          path: "/super-admin/bulk-actions",
          icon: Package, // Using Package from lucide-react
          label: "Bulk Actions",
          show: true,
        },
      ]
    : [];

  // Combine and filter items
  const sidebarItems = [
    ...baseItems.filter((item) => item.show),
    ...superAdminItems.filter((item) => item.show),
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* Expanded Sidebar */}
      <div
        className={`
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
          shadow-sm fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 
          transition-all duration-300
          ${isCollapsed ? "w-0 -ml-64" : "w-64 ml-0"}
          overflow-hidden
        `}
      >
        <div
          className={`w-64 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(isSuperAdmin() ? "/admin" : "/dashboard")}
            >
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-gray-900 dark:text-white text-xl tracking-tight">
                  ExpenseFlow
                </span>
                {isSuperAdmin() && (
                  <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Close Button */}
            {!isCollapsed && (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                title="Hide sidebar"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 space-y-2 px-4">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isDisabled = item.disabled || false;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    if (!isDisabled) {
                      navigate(item.path);
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }
                  }}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg 
                    transition-all duration-200 group relative
                    ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
                        : isActive(item.path)
                        ? "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                    }
                  `}
                >
                  <IconComponent
                    className={`
                      w-5 h-5 transition-colors flex-shrink-0
                      ${
                        isDisabled
                          ? "text-gray-400 dark:text-gray-500"
                          : isActive(item.path)
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      }
                    `}
                  />
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.label}
                    {isDisabled && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Select company first)
                      </span>
                    )}
                  </span>

                  {/* Active indicator */}
                  {!isDisabled && isActive(item.path) && (
                    <div className="absolute right-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Current Company Info */}
          {currentCompany && !isSuperAdmin() && (
            <div className="px-4 mt-6">
              <div className="p-3 flex flex-col gap-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Current Company
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {currentCompany.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  ID: {currentCompany.id.substring(0, 8)}...
                </p>
              </div>
            </div>
          )}

          {/* Super Admin Info */}
          {isSuperAdmin() && (
            <div className="px-4 mt-6">
              <div className="p-3 flex flex-col gap-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                  System Administrator
                </p>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-300 truncate">
                  Full System Access
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-400 truncate">
                  All Companies
                </p>
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="px-4 mt-auto">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                ExpenseFlow v1.0
              </div>
              <div
                className={`text-xs text-center mt-1 px-2 py-1 rounded-full ${
                  isSuperAdmin()
                    ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 dark:from-purple-900/30 dark:text-purple-300"
                    : isCompanyOwner()
                    ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:from-blue-900/30 dark:text-blue-300"
                    : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 dark:from-gray-800 dark:text-gray-300"
                }`}
              >
                {isSuperAdmin()
                  ? "Super Administrator"
                  : isCompanyOwner()
                  ? "Company Owner"
                  : "Team Member"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Add the interface definition at the bottom if missing
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default Sidebar;
