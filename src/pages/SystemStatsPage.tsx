import React, { useState, useEffect } from "react";
import { superAdminAPI, type SystemStatsData } from "../services/superAdminAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  TrendingUp,
  Award,
  PieChart,
  Calendar,
} from "lucide-react";

const SystemStatsPage: React.FC = () => {
  const [statsData, setStatsData] = useState<SystemStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await superAdminAPI.getSystemStats();
      if (response.success) {
        setStatsData(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load system statistics");
      console.error("Error fetching system stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStats();
  }, []);

  // Debug: Log what we're getting from API
  useEffect(() => {
    if (statsData) {
      console.log("System Stats Data Structure:", {
        hasData: !!statsData,
        roleDistribution: statsData.roleDistribution,
        monthlyExpenses: statsData.monthlyExpenses,
        topUsersByExpenses: statsData.topUsersByExpenses,
        topCompaniesByExpenses: statsData.topCompaniesByExpenses,
        companyUserDistribution: statsData.companyUserDistribution,
      });
    }
  }, [statsData]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      company_admin:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      member:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    };
    return (
      colors[role] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading system statistics...
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
                <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                Error Loading Stats
              </h3>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button
                onClick={fetchSystemStats}
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

  // Add a final safety check
  if (!statsData) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                No Data Available
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400">
                System statistics are not available yet. Try creating some data
                first.
              </p>
              <Button
                onClick={fetchSystemStats}
                variant="outline"
                className="mt-4 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get safe arrays
  const roleDistribution = statsData?.roleDistribution || [];
  const monthlyExpenses = statsData?.monthlyExpenses || [];
  const topUsersByExpenses = statsData?.topUsersByExpenses || [];
  const topCompaniesByExpenses = statsData?.topCompaniesByExpenses || [];
  const companyUserDistribution = statsData?.companyUserDistribution || [];

  // Calculate totals safely
  const totalUsers = roleDistribution.reduce((sum, r) => sum + r.count, 0);
  const maxMonthlyExpense = Math.max(
    ...monthlyExpenses.map((m) => m.totalAmount),
    1
  );
  const totalCompanies = companyUserDistribution.reduce(
    (sum, d) => sum + d.companyCount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
            System Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed analytics and distributions across the entire platform
          </p>
        </div>

        <Button
          onClick={fetchSystemStats}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Role Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleDistribution.map((role, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`capitalize ${getRoleColor(role._id)}`}>
                    {role._id.replace("_", " ")}
                  </Badge>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(role.count)}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {totalUsers > 0
                    ? ((role.count / totalUsers) * 100).toFixed(1)
                    : 0}
                  % of total users
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        totalUsers > 0 ? (role.count / totalUsers) * 100 : 0
                      }%`,
                      backgroundColor:
                        role._id === "super_admin"
                          ? "#8b5cf6"
                          : role._id === "company_admin"
                          ? "#3b82f6"
                          : "#10b981",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Monthly Expenses (Last 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {monthlyExpenses.map((month, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {month._id}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(month.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {month.count} transactions • Avg:{" "}
                      {formatCurrency(month.averageAmount)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{
                      width: `${
                        (month.totalAmount / maxMonthlyExpense) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users by Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Top Users by Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {topUsersByExpenses.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.firstName?.[0] || "U"}
                      {user?.lastName?.[0] || ""}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user?.firstName || "Unknown"} {user?.lastName || ""}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email || "No email"}+
                        <Badge className="ml-2 capitalize text-xs">
                          {user.role ? user.role.replace("_", " ") : "No Role"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(user.totalAmount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.count} expenses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Companies by Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Top Companies by Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {topCompaniesByExpenses.map((company, index) => (
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
                        {company.companyName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {company.industry}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(company.totalAmount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {company.count} expenses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Size Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Company Size Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyUserDistribution.map((dist, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {dist._id === 1 ? "1 user" : `${dist._id} users`}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {dist.companyCount} companies
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-1000"
                    style={{
                      width: `${
                        totalCompanies > 0
                          ? (dist.companyCount / totalCompanies) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-700 dark:text-blue-300">
                  Platform Summary
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Average company size:{" "}
                  {totalCompanies > 0
                    ? (
                        companyUserDistribution.reduce(
                          (sum, dist) => sum + dist._id * dist.companyCount,
                          0
                        ) / totalCompanies
                      ).toFixed(1)
                    : 0}{" "}
                  users
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {totalCompanies} companies
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatsPage;
