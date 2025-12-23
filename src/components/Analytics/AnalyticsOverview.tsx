// components/analytics/AnalyticsOverview.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OverviewData } from "../../services/analyticsAPI";

interface AnalyticsOverviewProps {
  data: OverviewData;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ data }) => {
  // Format currency function
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get category color and icon
  const getCategoryConfig = (category: string) => {
    const config: {
      [key: string]: {
        color: string;
        bgColor: string;
        icon: string;
        darkBg: string;
      };
    } = {
      electricity: {
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        darkBg: "dark:bg-blue-900/30",
        icon: "⚡",
      },
      water: {
        color: "text-cyan-600",
        bgColor: "bg-cyan-100",
        darkBg: "dark:bg-cyan-900/30",
        icon: "💧",
      },
      internet: {
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        darkBg: "dark:bg-purple-900/30",
        icon: "🌐",
      },
      rent: {
        color: "text-red-600",
        bgColor: "bg-red-100",
        darkBg: "dark:bg-red-900/30",
        icon: "🏠",
      },
      supplies: {
        color: "text-green-600",
        bgColor: "bg-green-100",
        darkBg: "dark:bg-green-900/30",
        icon: "📦",
      },
      salaries: {
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        darkBg: "dark:bg-orange-900/30",
        icon: "💰",
      },
      marketing: {
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        darkBg: "dark:bg-pink-900/30",
        icon: "📢",
      },
      transportation: {
        color: "text-indigo-600",
        bgColor: "bg-indigo-100",
        darkBg: "dark:bg-indigo-900/30",
        icon: "🚗",
      },
      other: {
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        darkBg: "dark:bg-gray-900/30",
        icon: "📋",
      },
    };

    return config[category] || config.other;
  };

  const categoryConfig = getCategoryConfig(data.topCategory);

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Spent Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-4 right-4 text-2xl">💰</div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.totalSpent)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {data.totalExpenses} expenses
            </p>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <span className="mr-1">📅</span>
              Last 3 months
            </div>
          </CardContent>
        </Card>

        {/* Monthly Average Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-4 right-4 text-2xl">📅</div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Monthly Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.monthlyAverage)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Per month average
            </p>
            <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
              <span className="mr-1">📊</span>
              Consistent spending
            </div>
          </CardContent>
        </Card>

        {/* Largest Expense Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-4 right-4 text-2xl">🏆</div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Largest Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.largestExpense)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Single transaction
            </p>
            <div className="mt-2">
              <Badge
                variant="secondary"
                className={`${categoryConfig.bgColor} ${categoryConfig.color} ${categoryConfig.darkBg} text-xs`}
              >
                {categoryConfig.icon} {data.topCategory}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Top Category Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-4 right-4 text-2xl">⭐</div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Top Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {data.topCategory || "N/A"}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatCurrency(data.topCategoryAmount)}
            </p>
            <div className="mt-2 flex items-center text-xs text-purple-600 dark:text-purple-400">
              <span className="mr-1">📈</span>
              Highest spending
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Expense Card */}
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <span className="mr-2">📊</span>
              Average Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.averageExpense)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Per transaction average
            </p>
            <div className="mt-3 flex justify-between items-center text-xs">
              <span className="text-gray-500">Total Expenses</span>
              <span className="font-semibold">{data.totalExpenses}</span>
            </div>
          </CardContent>
        </Card>

        {/* Date Range Card */}
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <span className="mr-2">📅</span>
              Analysis Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  From
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(data.dateRange.start).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  To
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(data.dateRange.end).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                📈{" "}
                {Math.round((data.totalSpent / data.monthlyAverage) * 10) / 10}{" "}
                months of spending
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {data.totalExpenses}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Expenses
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(data.monthlyAverage)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Monthly Avg
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(data.averageExpense)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Avg/Expense
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400 capitalize">
                {data.topCategory || "N/A"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Top Category
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
