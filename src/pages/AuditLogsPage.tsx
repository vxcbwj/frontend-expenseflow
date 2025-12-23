import React, { useState, useEffect } from "react";
import { superAdminAPI, type AuditLog } from "../services/superAdminAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Building2,
  DollarSign,
  Calendar,
  Shield,
  Clock,
  Activity,
  Server,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    action: "",
    entity: "",
    userId: "",
    startDate: "",
    endDate: "",
  });

  const fetchAuditLogs = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params: any = {
        page,
        limit: pagination.limit,
      };

      if (filters.action) params.action = filters.action;
      if (filters.entity) params.entity = filters.entity;
      if (filters.userId) params.userId = filters.userId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await superAdminAPI.getAuditLogs(params);
      if (response.success) {
        setLogs(response.data.logs);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchAuditLogs(1);
  };

  const handleClearFilters = () => {
    setFilters({
      action: "",
      entity: "",
      userId: "",
      startDate: "",
      endDate: "",
    });
    fetchAuditLogs(1);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return (
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/10">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        );
      case "UPDATE":
        return (
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10">
            <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
      case "DELETE":
        return (
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-900/10">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
        );
      case "LOGIN":
        return (
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/10">
            <Key className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800">
            <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        );
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case "User":
        return <User className="h-4 w-4 mr-2" />;
      case "Company":
        return <Building2 className="h-4 w-4 mr-2" />;
      case "Expense":
        return <DollarSign className="h-4 w-4 mr-2" />;
      default:
        return <Server className="h-4 w-4 mr-2" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-700 dark:from-green-900/30 dark:text-green-300";
      case "UPDATE":
        return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:from-blue-900/30 dark:text-blue-300";
      case "DELETE":
        return "bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:from-red-900/30 dark:text-red-300";
      case "LOGIN":
        return "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 dark:from-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 dark:from-gray-800 dark:text-gray-300";
    }
  };

  const formatDetails = (details: any): string => {
    if (!details) return "";
    try {
      return JSON.stringify(details, null, 2);
    } catch {
      return String(details);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading Audit Logs
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Fetching system activities...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Audit Logs
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-300">
                  Track all system activities and changes
                </p>
              </div>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <Clock className="h-3 w-3" />
            {pagination.total.toLocaleString()} total activities tracked
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => fetchAuditLogs()}
            variant="outline"
            size="sm"
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {logs.filter((log) => log.action === "CREATE").length}
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">
                  Create Actions
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {logs.filter((log) => log.action === "UPDATE").length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">
                  Update Actions
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {logs.filter((log) => log.action === "DELETE").length}
                </div>
                <div className="text-sm text-red-600 dark:text-red-300">
                  Delete Actions
                </div>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {new Set(logs.map((log) => log.userId)).size}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-300">
                  Unique Users
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-gray-900 dark:text-white">
              Filter Logs
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Action Filter */}
            <div className="space-y-3">
              <Label
                htmlFor="action"
                className="text-gray-700 dark:text-gray-300"
              >
                Action Type
              </Label>
              <Select
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                id="action"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
              </Select>
            </div>

            {/* Entity Filter */}
            <div className="space-y-3">
              <Label
                htmlFor="entity"
                className="text-gray-700 dark:text-gray-300"
              >
                Entity Type
              </Label>
              <Select
                value={filters.entity}
                onChange={(e) => handleFilterChange("entity", e.target.value)}
                id="entity"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              >
                <option value="">All Entities</option>
                <option value="User">User</option>
                <option value="Company">Company</option>
                <option value="Expense">Expense</option>
                <option value="Budget">Budget</option>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Label
                htmlFor="startDate"
                className="text-gray-700 dark:text-gray-300"
              >
                Start Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="endDate"
                className="text-gray-700 dark:text-gray-300"
              >
                End Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* User ID Filter */}
          <div className="space-y-3">
            <Label
              htmlFor="userId"
              className="text-gray-700 dark:text-gray-300"
            >
              User ID or Email
            </Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="userId"
                  placeholder="Search by user ID or email..."
                  value={filters.userId}
                  onChange={(e) => handleFilterChange("userId", e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleApplyFilters}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Apply Filters
                </Button>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="gap-2"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  Error Loading Logs
                </h3>
                <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                  {error}
                </p>
                <Button
                  onClick={() => fetchAuditLogs()}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white">
                Activity Logs
              </CardTitle>
            </div>
            <Badge className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:from-blue-900/30 dark:text-blue-300">
              {pagination.total.toLocaleString()} logs
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <Activity className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Audit Logs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                {filters.action || filters.entity || filters.userId
                  ? "No activities match your current filters"
                  : "System activities will appear here once recorded"}
              </p>
              {(filters.action || filters.entity || filters.userId) && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Action
                </div>
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Entity
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Details
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timestamp
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  IP Address
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 p-4 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50 dark:hover:from-gray-800/50 dark:hover:to-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getActionIcon(log.action)}
                      <div className="min-w-[80px]">
                        <Badge
                          className={`px-3 py-1 rounded-full ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getEntityIcon(log.entity)}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {log.entity}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {log.userEmail}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ID: {log.userId.substring(0, 8)}...
                      </div>
                    </div>
                    <div className="max-w-xs">
                      <div
                        className="text-sm text-gray-900 dark:text-white truncate"
                        title={formatDetails(log.details)}
                      >
                        {log.type}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {Object.keys(log.details || {}).length} fields modified
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-300 font-medium">
                        {log.ipAddress || "N/A"}
                      </code>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {logs.length} of {pagination.total.toLocaleString()}{" "}
                  logs • Page {pagination.page} of{" "}
                  {Math.ceil(pagination.total / pagination.limit)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAuditLogs(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: Math.min(
                        5,
                        Math.ceil(pagination.total / pagination.limit)
                      ),
                    }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.page === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => fetchAuditLogs(pageNum)}
                          className={`w-9 h-9 p-0 ${
                            pagination.page === pageNum
                              ? "bg-gradient-to-r from-blue-500 to-blue-600"
                              : ""
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAuditLogs(pagination.page + 1)}
                    disabled={
                      pagination.page >=
                      Math.ceil(pagination.total / pagination.limit)
                    }
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsPage;
