// components/dashboard/RoleBasedDashboard.tsx - CLEANED VERSION
import React from "react";
import { usePermissions } from "../../hooks/userPermissions";
import { EnhancedDashboard } from "./EnhancedDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Building2, Users, BarChart3 } from "lucide-react";

interface RoleBasedDashboardProps {
  expenses: any[];
  loading?: boolean;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({
  expenses,
  loading = false,
}) => {
  const {
    isSuperAdmin,
    isCompanyAdmin,
    isMember,
    canManageExpenses,
    canViewAnalytics,
  } = usePermissions();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Super Admin Dashboard
  if (isSuperAdmin()) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <Shield className="mr-3 h-8 w-8 text-purple-600" />
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              System-wide administration and monitoring
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => (window.location.href = "/super-admin")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Overview
              </CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Full Access</div>
              <p className="text-xs text-muted-foreground">
                All companies, users, and data
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quick Actions
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    (window.location.href = "/super-admin/system-stats")
                  }
                >
                  View System Stats
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    (window.location.href = "/super-admin/audit-logs")
                  }
                >
                  Audit Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Monitor</div>
              <p className="text-xs text-muted-foreground">
                Track all system activities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Show regular dashboard for current company */}
        <EnhancedDashboard expenses={expenses} loading={false} />
      </div>
    );
  }

  // Company Admin Dashboard
  if (isCompanyAdmin()) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <Building2 className="mr-3 h-8 w-8 text-blue-600" />
              Company Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Full company management and oversight
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => (window.location.href = "/company-users")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Team
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permissions</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Manage Team Members</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Approve Expenses</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">View Analytics</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <EnhancedDashboard expenses={expenses} loading={false} />
      </div>
    );
  }

  // Member Dashboard (Limited)
  if (isMember()) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Team Member Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Submit and track your expenses
            </p>
          </div>
          {canManageExpenses() && (
            <Button
              onClick={() => (window.location.href = "/expenses")}
              className="bg-green-600 hover:bg-green-700"
            >
              + Add Expense
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Your Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Create Expenses</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      canManageExpenses()
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {canManageExpenses() ? "✓ Allowed" : "✗ Denied"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">View Analytics</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      canViewAnalytics()
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {canViewAnalytics() ? "✓ Allowed" : "✗ Denied"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manage Team</span>
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                    ✗ Denied
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {canManageExpenses() && (
                  <Button
                    className="w-full"
                    onClick={() => (window.location.href = "/expenses")}
                  >
                    Submit Expense
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/profile")}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {expenses.length > 0 && (
          <EnhancedDashboard expenses={expenses} loading={false} />
        )}
      </div>
    );
  }

  // Fallback - Regular dashboard
  return <EnhancedDashboard expenses={expenses} loading={loading} />;
};

export default RoleBasedDashboard;
