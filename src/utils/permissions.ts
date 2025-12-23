// frontend/src/utils/permissions.ts - UPDATED
import { UserProfile } from "../services/userAPI";
import { ROLES } from "./roles";

export const hasPermission = (
  user: UserProfile | null,
  permission: string,
  companyId?: string
): boolean => {
  if (!user) return false;

  const userRole = user.role || user.globalRole;

  // SUPER ADMIN can do everything
  if (userRole === ROLES.SUPER_ADMIN) {
    return true;
  }

  // For backward compatibility - check assigned companies
  if (companyId && user.assignedCompanies) {
    if (!user.assignedCompanies.includes(companyId)) {
      return false;
    }
  }

  // COMPANY OWNER permissions (UPDATED)
  if (userRole === ROLES.COMPANY_OWNER) {
    const companyOwnerPermissions = [
      "MANAGE_COMPANIES", // Their own companies
      "MANAGE_COMPANY_USERS", // Users in their companies
      "MANAGE_EXPENSES",
      "MANAGE_BUDGETS",
      "VIEW_ANALYTICS",
      "VIEW_EXPENSES",
      "VIEW_BUDGETS",
      "CREATE_EXPENSE",
      "INVITE_USERS", // Can invite members/admins
      "canManageCompany",
      "canEditCompanySettings",
      "canManageUsers",
      "canAssignCompanyAdmins",
    ];
    return companyOwnerPermissions.includes(permission);
  }

  // COMPANY ADMIN permissions (UPDATED)
  if (userRole === ROLES.COMPANY_ADMIN) {
    const companyAdminPermissions = [
      "MANAGE_EXPENSES",
      "MANAGE_BUDGETS",
      "VIEW_ANALYTICS",
      "VIEW_EXPENSES",
      "VIEW_BUDGETS",
      "CREATE_EXPENSE",
      "canManageExpenses",
      "canManageBudgets",
      "canViewAllExpenses",
      "canApproveExpenses",
      "canRejectExpenses",
      "canManageCategories",
    ];
    return companyAdminPermissions.includes(permission);
  }

  // MEMBER permissions
  if (userRole === ROLES.MEMBER) {
    const memberPermissions = [
      "VIEW_EXPENSES",
      "VIEW_BUDGETS",
      "VIEW_ANALYTICS",
      "CREATE_EXPENSE", // Can they create expenses?
      "canCreateExpenses",
      "canViewOwnExpenses",
      "canEditOwnExpenses",
      "canDeleteOwnExpenses",
    ];
    return memberPermissions.includes(permission);
  }

  return false;
};

// Helper functions - FIXED
export const isSuperAdmin = (user: UserProfile | null): boolean => {
  const userRole = user?.role || user?.globalRole;
  return userRole === ROLES.SUPER_ADMIN;
};

export const isCompanyOwner = (
  user: UserProfile | null,
  companyId?: string
): boolean => {
  const userRole = user?.role || user?.globalRole;
  if (userRole !== ROLES.COMPANY_OWNER) return false;

  if (companyId && user?.companyRoles) {
    return user.companyRoles.some(
      (cr) => cr.companyId === companyId && cr.role === "owner"
    );
  }
  return true;
};

export const isCompanyAdmin = (
  user: UserProfile | null,
  companyId?: string
): boolean => {
  const userRole = user?.role || user?.globalRole;
  if (userRole !== ROLES.COMPANY_ADMIN && userRole !== ROLES.COMPANY_OWNER) {
    return false;
  }

  if (companyId && user?.companyRoles) {
    return user.companyRoles.some(
      (cr) =>
        cr.companyId === companyId &&
        (cr.role === "admin" || cr.role === "owner")
    );
  }
  return true;
};

export const isMember = (
  user: UserProfile | null,
  companyId?: string
): boolean => {
  const userRole = user?.role || user?.globalRole;
  if (userRole === ROLES.MEMBER) {
    if (companyId && user?.companyRoles) {
      return user.companyRoles.some(
        (cr) => cr.companyId === companyId && cr.role === "member"
      );
    }
    return true;
  }
  return false;
};
