import React, { useState, useEffect } from "react";
import { superAdminAPI, type DashboardData } from "../services/superAdminAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Clock,
  Database,
  Cpu,
  Shield,
  Activity,
  Search,
  FileText,
  BarChart3,
} from "lucide-react";

const SuperAdminPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("monthly");
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await superAdminAPI.getDashboard(timeframe);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "connected":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "disconnected":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      default:
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
    }
  };

  // Custom Tab Component
  const TabNav = () => (
    <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 mb-6">
      <button
        onClick={() => setActiveTab("overview")}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          activeTab === "overview"
            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>Overview</span>
        </div>
      </button>
      <button
        onClick={() => setActiveTab("analytics")}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          activeTab === "analytics"
            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Analytics</span>
        </div>
      </button>

      <button
        onClick={() => setActiveTab("system")}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          activeTab === "system"
            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Cpu className="h-4 w-4" />
          <span>System</span>
        </div>
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading Super Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                Access Denied
              </h3>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button
                onClick={fetchDashboardData}
                variant="outline"
                className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <Shield className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            System-wide monitoring and management
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNav />

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users Card */}
            <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(dashboardData?.overview.totalUsers || 0)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Registered users
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Companies Card */}
            <Card className="relative overflow-hidden border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(
                        dashboardData?.overview.totalCompanies || 0
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Active organizations
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Expenses Card */}
            <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(dashboardData?.overview.totalExpenses || 0)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Transactions
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Budget Card */}
            <Card className="relative overflow-hidden border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(dashboardData?.overview.totalBudget || 0)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Across all companies
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Amount Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Total Expense Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(
                    dashboardData?.overview.totalExpenseAmount || 0
                  )}
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Last {dashboardData?.overview.activeTimeframe || "month"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Date Range Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Analysis Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      From
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dashboardData?.overview.dateRange.start
                        ? new Date(
                            dashboardData.overview.dateRange.start
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      To
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dashboardData?.overview.dateRange.end
                        ? new Date(
                            dashboardData.overview.dateRange.end
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Badge variant="outline" className="text-xs">
                      {dashboardData?.overview.activeTimeframe || "monthly"}{" "}
                      view
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Daily Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Daily Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {dashboardData?.analytics.dailyActivity.length ? (
                  dashboardData.analytics.dailyActivity.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(day._id).toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(day._id).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(day.totalAmount)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {day.count}{" "}
                          {day.count === 1 ? "transaction" : "transactions"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No daily activity data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.analytics.expensesByCategory.length ? (
                  dashboardData.analytics.expensesByCategory.map(
                    (category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {category._id.replace("_", " ")}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatCurrency(category.totalAmount)} •{" "}
                            {category.count} items
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${
                                (category.totalAmount /
                                  (dashboardData.overview.totalExpenseAmount ||
                                    1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No category data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity Tab */}
      {activeTab === "recent" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {dashboardData?.recentActivity.newUsers.length ? (
                    dashboardData.recentActivity.newUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="capitalize">
                            {user.role.replace("_", " ")}
                          </Badge>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No recent users
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Recent Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {dashboardData?.recentActivity.newCompanies.length ? (
                    dashboardData.recentActivity.newCompanies.map(
                      (company, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {company.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {company.industry}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(company.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No recent companies
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Growth Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    User Growth
                  </h3>
                  <div className="space-y-3">
                    {dashboardData?.growthMetrics.userGrowth.length ? (
                      dashboardData.growthMetrics.userGrowth
                        .slice(-6)
                        .map((growth, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {growth._id}
                            </span>
                            <Badge variant="outline">
                              {growth.count} users
                            </Badge>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No user growth data
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Growth */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Company Growth
                  </h3>
                  <div className="space-y-3">
                    {dashboardData?.growthMetrics.companyGrowth.length ? (
                      dashboardData.growthMetrics.companyGrowth
                        .slice(-6)
                        .map((growth, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {growth._id}
                            </span>
                            <Badge variant="outline">
                              {growth.count} companies
                            </Badge>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No company growth data
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <Badge
                      className={getHealthColor(
                        dashboardData?.systemHealth.database || "unknown"
                      )}
                    >
                      {dashboardData?.systemHealth.database || "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Uptime
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatUptime(dashboardData?.systemHealth.uptime || 0)}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last checked: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        RSS
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatBytes(
                          dashboardData?.systemHealth.memoryUsage.rss || 0
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((dashboardData?.systemHealth.memoryUsage.rss ||
                              0) /
                              (1024 * 1024 * 100)) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Heap Total
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatBytes(
                          dashboardData?.systemHealth.memoryUsage.heapTotal || 0
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((dashboardData?.systemHealth.memoryUsage
                              .heapTotal || 0) /
                              (1024 * 1024 * 100)) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Heap Used
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatBytes(
                          dashboardData?.systemHealth.memoryUsage.heapUsed || 0
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((dashboardData?.systemHealth.memoryUsage
                              .heapUsed || 0) /
                              (1024 * 1024 * 100)) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4 space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Manage Users</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4 space-y-2 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">Manage Companies</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4 space-y-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">Global Search</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4 space-y-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium">View Logs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p>
          Super Admin Dashboard • Last updated:{" "}
          {new Date().toLocaleTimeString()} • Data timeframe:{" "}
          {dashboardData?.overview.activeTimeframe || "monthly"}
        </p>
      </div>
    </div>
  );
};

export default SuperAdminPage;
