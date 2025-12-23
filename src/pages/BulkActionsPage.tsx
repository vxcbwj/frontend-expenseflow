// src/pages/BulkActionsPage.tsx - UI IMPROVED VERSION
import React, { useState } from "react";
import { superAdminAPI } from "../services/superAdminAPI";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Building2,
  Shield,
  Trash2,
  RefreshCw,
  Package,
  AlertTriangle,
  Zap,
  Cpu,
  Terminal,
  Database,
  Sparkles,
  Lock,
  Send,
} from "lucide-react";

const BulkActionsPage: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState("");
  const [inputData, setInputData] = useState("");
  const [options, setOptions] = useState({
    allowSuperAdminDeletion: false,
    sendNotifications: true,
    dryRun: true, // Default to safe mode
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const actions = [
    {
      value: "bulkDeleteUsers",
      label: "Bulk Delete Users",
      icon: <Trash2 className="h-5 w-5" />,
      description: "Permanently delete multiple users from the system",
      placeholder: "user_id_1, user_id_2, user_id_3",
      example: "user_id_1, user_id_2, user_id_3",
      color: "from-red-500 to-rose-600",
      bgColor:
        "bg-gradient-to-br from-red-100 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      value: "bulkUpdateUserRoles",
      label: "Bulk Update Roles",
      icon: <Shield className="h-5 w-5" />,
      description: "Update roles for multiple users simultaneously",
      placeholder: '{"userIds": ["id1", "id2"], "role": "member"}',
      example: '{"userIds": ["id1", "id2"], "role": "member"}',
      color: "from-blue-500 to-cyan-600",
      bgColor:
        "bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      value: "bulkDisableCompanies",
      label: "Bulk Disable Companies",
      icon: <Building2 className="h-5 w-5" />,
      description: "Temporarily disable multiple companies",
      placeholder: "company_id_1, company_id_2",
      example: "company_id_1, company_id_2",
      color: "from-amber-500 to-orange-600",
      bgColor:
        "bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      value: "bulkEnableCompanies",
      label: "Bulk Enable Companies",
      icon: <Building2 className="h-5 w-5" />,
      description: "Re-enable previously disabled companies",
      placeholder: "company_id_1, company_id_2",
      example: "company_id_1, company_id_2",
      color: "from-emerald-500 to-green-600",
      bgColor:
        "bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/20 dark:to-green-900/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  const roles = [
    {
      value: "super_admin",
      label: "Super Admin",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      value: "company_admin",
      label: "Company Admin",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      value: "member",
      label: "Member",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    },
  ];

  const handleActionChange = (action: string) => {
    setSelectedAction(action);
    setInputData("");
    setResult(null);
    setError("");
  };

  const handleOptionChange = (key: keyof typeof options, value: boolean) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const parseInputData = () => {
    if (!inputData.trim()) return [];

    // Try to parse as JSON array
    try {
      const parsed = JSON.parse(inputData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // If not JSON, parse as comma-separated or newline-separated values
      return inputData
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    return [];
  };

  const validateAction = () => {
    const data = parseInputData();

    if (data.length === 0) {
      setError("Please enter valid data");
      return false;
    }

    if (selectedAction === "bulkUpdateUserRoles") {
      try {
        const parsed = JSON.parse(inputData);
        if (!parsed.userIds || !Array.isArray(parsed.userIds) || !parsed.role) {
          setError('Format: {"userIds": ["id1", "id2"], "role": "member"}');
          return false;
        }
      } catch {
        setError(
          'Invalid JSON format. Use: {"userIds": ["id1", "id2"], "role": "member"}'
        );
        return false;
      }
    }

    if (data.length > 100) {
      setError("Maximum 100 items allowed in bulk operations");
      return false;
    }

    return true;
  };

  const performBulkAction = async () => {
    if (!validateAction()) return;

    try {
      setLoading(true);
      setError("");
      setResult(null);

      let data: any;
      if (selectedAction === "bulkUpdateUserRoles") {
        data = JSON.parse(inputData);
      } else {
        data = parseInputData();
      }

      const response = await superAdminAPI.performBulkAction(
        selectedAction,
        data,
        options.dryRun ? { ...options, dryRun: true } : options
      );

      if (response.success) {
        setResult(response);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to perform bulk action");
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = () => {
    return actions.find((a) => a.value === selectedAction);
  };

  const getParsedCount = () => {
    if (!inputData.trim()) return 0;

    if (selectedAction === "bulkUpdateUserRoles") {
      try {
        const parsed = JSON.parse(inputData);
        return parsed.userIds?.length || 0;
      } catch {
        return 0;
      }
    }

    return parseInputData().length;
  };

  const CustomSwitch = ({
    id,
    checked,
    onChange,
    label,
    description,
    icon: Icon,
  }: {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
    icon?: React.ElementType;
    color?: string;
  }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {Icon && (
        <div
          className={`p-2 rounded-lg ${
            checked
              ? "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/20"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              checked
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <Label
            htmlFor={id}
            className="font-medium text-gray-900 dark:text-white cursor-pointer"
          >
            {label}
          </Label>
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              checked
                ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                checked ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Bulk Operations
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Perform system-wide operations on multiple items simultaneously
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-full font-medium ${
              options.dryRun
                ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-300"
                : "bg-gradient-to-r from-red-100 to-rose-100 text-rose-800 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-300"
            }`}
          >
            {options.dryRun ? (
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span>Dry Run Mode</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Live Execution Mode</span>
              </div>
            )}
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Database className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                ⚠️ High Impact Operations
              </h3>
              <div className="text-yellow-700 dark:text-yellow-400 space-y-2">
                <p className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>
                    These actions can permanently affect your system data
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>
                    Always test with <strong>Dry Run</strong> mode first to
                    preview changes
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>
                    Ensure you have verified backups before performing live
                    operations
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Action Selection Panel */}
        <Card className="lg:col-span-1 border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 mr-3">
                <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              Available Actions
            </CardTitle>
            <CardDescription>Select an operation to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actions.map((action) => (
                <button
                  key={action.value}
                  onClick={() => handleActionChange(action.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                    selectedAction === action.value
                      ? `border-2 shadow-lg ${action.bgColor}`
                      : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      selectedAction === action.value
                        ? action.bgColor
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <div
                      className={
                        selectedAction === action.value
                          ? action.iconColor
                          : "text-gray-500 dark:text-gray-400"
                      }
                    >
                      {action.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {action.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {action.description}
                    </div>
                  </div>
                  {selectedAction === action.value && (
                    <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Selected Action
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedAction ? getActionConfig()?.label : "None"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Items Detected
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {getParsedCount()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Max Limit
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    100
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Action Configuration Panel */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10">
                    <Terminal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedAction
                        ? getActionConfig()?.label
                        : "Configuration Panel"}
                    </div>
                    <CardDescription>
                      {selectedAction
                        ? "Configure and execute the selected operation"
                        : "Select an action to begin"}
                    </CardDescription>
                  </div>
                </CardTitle>
              </div>
              {selectedAction && (
                <Badge className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 border-0">
                  {getParsedCount()} items ready
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedAction ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  No Action Selected
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                  Choose a bulk operation from the left panel to configure and
                  execute
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Sparkles className="h-4 w-4" />
                  <span>Each action supports up to 100 items</span>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Action Description */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${getActionConfig()?.bgColor}`}
                    >
                      {getActionConfig()?.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Action Details
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getActionConfig()?.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Example Format
                    </div>
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-300">
                      {getActionConfig()?.example}
                    </code>
                  </div>
                </div>

                {/* Data Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold text-gray-900 dark:text-white">
                      {selectedAction === "bulkUpdateUserRoles"
                        ? "JSON Data Input"
                        : "Item IDs Input"}
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Detected:{" "}
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {getParsedCount()}
                        </span>{" "}
                        items
                      </span>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      placeholder={getActionConfig()?.placeholder}
                      value={inputData}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setInputData(e.target.value)
                      }
                      rows={8}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-400 dark:focus:border-blue-500 font-mono transition-all"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {inputData.length} chars
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Role Selection for Bulk Update */}
                {selectedAction === "bulkUpdateUserRoles" && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-900 dark:text-white">
                      Target Role Selection
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {roles.map((role) => {
                        const currentRole = (() => {
                          try {
                            const parsed = JSON.parse(
                              inputData || '{"role": ""}'
                            );
                            return parsed.role || "";
                          } catch {
                            return "";
                          }
                        })();

                        return (
                          <button
                            key={role.value}
                            onClick={() => {
                              try {
                                const parsed = JSON.parse(inputData || "{}");
                                setInputData(
                                  JSON.stringify(
                                    { ...parsed, role: role.value },
                                    null,
                                    2
                                  )
                                );
                              } catch {
                                setInputData(
                                  JSON.stringify(
                                    { userIds: [], role: role.value },
                                    null,
                                    2
                                  )
                                );
                              }
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              currentRole === role.value
                                ? `${
                                    role.color.split(" ")[0]
                                  } border-blue-500 shadow-lg`
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                          >
                            <div className="flex flex-col items-center text-center gap-2">
                              <Shield
                                className={`h-5 w-5 ${
                                  currentRole === role.value
                                    ? "text-white"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              />
                              <span
                                className={`font-medium ${
                                  currentRole === role.value
                                    ? "text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {role.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Options Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/10">
                      <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Operation Options
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <CustomSwitch
                      id="dryRun"
                      checked={options.dryRun}
                      onChange={(checked) =>
                        handleOptionChange("dryRun", checked)
                      }
                      label="Dry Run Mode"
                      description="Preview changes without executing them"
                      icon={Terminal}
                    />
                    <CustomSwitch
                      id="allowSuperAdminDeletion"
                      checked={options.allowSuperAdminDeletion}
                      onChange={(checked) =>
                        handleOptionChange("allowSuperAdminDeletion", checked)
                      }
                      label="Allow Super Admin Deletion"
                      description="Permit deletion of super admin accounts (dangerous)"
                      icon={Lock}
                    />
                    <CustomSwitch
                      id="sendNotifications"
                      checked={options.sendNotifications}
                      onChange={(checked) =>
                        handleOptionChange("sendNotifications", checked)
                      }
                      label="Send Email Notifications"
                      description="Notify affected users about changes"
                      icon={Send}
                    />
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-5 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border-2 border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-900/10">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                          Validation Error
                        </h4>
                        <p className="text-red-700 dark:text-red-400">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result Display */}
                {result && (
                  <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 border-2 border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/20 dark:to-emerald-900/10">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                            {options.dryRun
                              ? "Dry Run Results"
                              : "Operation Successful"}
                          </h4>
                          <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-300 border-0">
                            {result.result?.processed || getParsedCount()}{" "}
                            processed
                          </Badge>
                        </div>
                        <p className="text-emerald-700 dark:text-emerald-400 mb-4">
                          {result.message}
                        </p>
                        {result.result && (
                          <div className="mt-4 p-4 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                            <pre className="text-xs font-mono text-emerald-800 dark:text-emerald-300 overflow-auto">
                              {JSON.stringify(result.result, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={performBulkAction}
                    disabled={loading || !inputData.trim()}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </>
                    ) : options.dryRun ? (
                      <>
                        <Terminal className="mr-2 h-4 w-4" />
                        Run Dry Test
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Execute Operation
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setInputData("");
                      setResult(null);
                      setError("");
                    }}
                    variant="outline"
                    disabled={loading}
                    className="flex-1 h-12 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear & Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Guidelines Panel */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10 mr-3">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Operation Guidelines & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Safety Protocols
                </h4>
                <ul className="space-y-3">
                  {[
                    "Always start with Dry Run mode to preview changes",
                    "Verify data accuracy before live execution",
                    "Limit operations to 100 items maximum per batch",
                    "Schedule bulk operations during maintenance windows",
                    "Ensure database backups are current before live operations",
                    "Use the allowSuperAdminDeletion option with extreme caution",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  Data Formats & Examples
                </h4>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Comma-separated
                    </div>
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-300 block">
                      id_1, id_2, id_3, id_4, id_5
                    </code>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Newline-separated
                    </div>
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-300 block whitespace-pre">
                      id_1{"\n"}id_2{"\n"}id_3{"\n"}id_4{"\n"}id_5
                    </code>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      JSON format
                    </div>
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-300 block">
                      {'{"userIds": ["id1", "id2"], "role": "member"}'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkActionsPage;
