// components/TestPermissionSwitch.tsx - UPDATED
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { getRoleLabel } from "../utils/roles";

const TestPermissionSwitch: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
        <p className="text-yellow-700">No user logged in</p>
      </div>
    );
  }

  // Get user role safely
  const userRole = user.role || user.globalRole || "member";

  return (
    <div className="p-4 border border-blue-200 bg-blue-50 rounded-md text-sm">
      <h3 className="font-semibold mb-2">🧪 Permission Test</h3>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Current Role:</span>{" "}
          {getRoleLabel(userRole)}
        </p>
        <p>
          <span className="font-medium">Permissions Available:</span>
        </p>
        <ul className="ml-4 space-y-1">
          <li className="text-xs">
            • {userRole === "super_admin" ? "✅" : "❌"} Super Admin Access
          </li>
          <li className="text-xs">
            •{" "}
            {userRole === "super_admin" || userRole === "company_owner"
              ? "✅"
              : "❌"}{" "}
            Company Management
          </li>
          <li className="text-xs">
            •{" "}
            {userRole === "super_admin" ||
            userRole === "company_owner" ||
            userRole === "company_admin"
              ? "✅"
              : "❌"}{" "}
            Expense Management
          </li>
          <li className="text-xs">
            • {userRole === "member" ? "✅" : "❌"} View Only Access
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TestPermissionSwitch;
