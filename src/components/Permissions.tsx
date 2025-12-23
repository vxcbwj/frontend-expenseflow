// components/PermissionTest.tsx
import React from "react";
import { useCompany } from "../contexts/CompanyContext";
import { hasPermission } from "../utils/permissions";
import { UserProfile } from "../services/userAPI";

const PermissionTest: React.FC = () => {
  const user: UserProfile = JSON.parse(localStorage.getItem("user") || "{}");
  const { currentCompany } = useCompany();

  const permissions = {
    canManageUsers: hasPermission(user, "canManageUsers", currentCompany?.id),
    canManageCompany: hasPermission(
      user,
      "canManageCompany",
      currentCompany?.id
    ),
    canViewAnalytics: hasPermission(
      user,
      "canViewAnalytics",
      currentCompany?.id
    ),
    canManageExpenses: hasPermission(
      user,
      "canManageExpenses",
      currentCompany?.id
    ),
    canManageBudgets: hasPermission(
      user,
      "canManageBudgets",
      currentCompany?.id
    ),
    canManageEverything: hasPermission(
      user,
      "canManageEverything",
      currentCompany?.id
    ),
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h3 className="font-bold mb-3">🎛️ PERMISSION TEST PANEL</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        {Object.entries(permissions).map(([permission, hasPerm]) => (
          <div
            key={permission}
            className={`p-3 rounded border-2 ${
              hasPerm
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-100 opacity-50"
            }`}
          >
            <p className="font-semibold">{permission}</p>
            <p className="text-xs">
              {hasPerm ? "✅ Accessible" : "❌ Restricted"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionTest;
