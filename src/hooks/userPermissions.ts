// hooks/userPermissions.ts - COMPLETELY UPDATED WITH FIXED ROLE CHECKS
import { useAuth } from "../contexts/AuthContext";
import { useCallback, useMemo } from "react";

export const usePermissions = () => {
  const { user } = useAuth();

  // Memoize user data to prevent unnecessary re-renders
  const memoizedUser = useMemo(
    () => ({
      id: user?.id,
      email: user?.email,
      role: user?.role,
      globalRole: user?.globalRole,
      companyRoles: user?.companyRoles,
    }),
    [user]
  );

  // Helper: Get user's role - FIXED to use lowercase
  const getUserRole = useCallback((): string => {
    return (
      memoizedUser.globalRole?.toLowerCase() ||
      memoizedUser.role?.toLowerCase() ||
      "member"
    );
  }, [memoizedUser]);

  // ========== FIXED ROLE CHECKING FUNCTIONS ==========

  // Check if user is super admin - FIXED
  const isSuperAdmin = useCallback((): boolean => {
    const role = getUserRole();
    console.log(role);
    return role === "super_admin";
  }, [getUserRole]);

  // Check if user is company owner - FIXED
  const isAdmin = useCallback((): boolean => {
    const role = getUserRole();
    return role === "company_owner";
  }, [getUserRole]);

  // Check if user is company admin - FIXED
  const isCompanyAdmin = useCallback(
    (companyId?: string): boolean => {
      const role = getUserRole();

      // Check global role first
      if (role === "company_admin") {
        return true;
      }

      // Company owners are also admins for their companies
      if (role === "company_owner") {
        if (companyId) {
          const companyRole = getCompanyRole(companyId);
          return companyRole === "owner" || companyRole === "admin";
        }
        return true;
      }

      return false;
    },
    [getUserRole]
  );

  // Check if user is member - FIXED
  const isMember = useCallback((): boolean => {
    const role = getUserRole();
    return role === "member";
  }, [getUserRole]);

  // Alias for isCompanyAdmin without parameters
  const isCompanyAdminNoParam = useCallback((): boolean => {
    return isCompanyAdmin();
  }, [isCompanyAdmin]);

  // ========== PERMISSION CHECKING FUNCTIONS ==========

  // Check if user can view dashboard
  const canViewDashboard = useCallback((): boolean => {
    return !isSuperAdmin() || !isMember(); // Super admin cannot view company dashboard
  }, [isSuperAdmin, isMember]);

  // Check if user can view companies
  const canViewCompanies = useCallback((): boolean => {
    return !isSuperAdmin(); // Super admin cannot view companies
  }, [isSuperAdmin]);

  // Check if user can manage companies (create/edit/delete)
  const canManageCompanies = useCallback((): boolean => {
    return isAdmin(); // Only company owners can manage companies
  }, [isAdmin]);

  // Check if user can view expenses
  const canViewExpenses = useCallback((): boolean => {
    return !isSuperAdmin(); // Super admin cannot view expenses
  }, [isSuperAdmin]);

  // Check if user can manage expenses (create/edit/delete)
  const canManageExpenses = useCallback(
    (companyId?: string): boolean => {
      if (isSuperAdmin()) return false; // Super admin cannot manage expenses
      if (isMember()) return false; // Members cannot manage expenses

      if (companyId) {
        const companyRole = getCompanyRole(companyId);
        return companyRole === "owner" || companyRole === "admin";
      }

      return isAdmin() || isCompanyAdmin();
    },
    [isSuperAdmin, isMember, isAdmin, isCompanyAdmin]
  );

  // Check if user can view budgets
  const canViewBudgets = useCallback((): boolean => {
    return !isSuperAdmin(); // Super admin cannot view budgets
  }, [isSuperAdmin]);

  // Check if user can manage budgets
  const canManageBudgets = useCallback(
    (companyId?: string): boolean => {
      return canManageExpenses(companyId); // Same permission as expenses
    },
    [canManageExpenses]
  );

  // Check if user can view analytics
  const canViewAnalytics = useCallback((): boolean => {
    return !isSuperAdmin(); // Super admin cannot view analytics
  }, [isSuperAdmin]);

  // Check if user can manage analytics (if needed)
  const canManageAnalytics = useCallback((): boolean => {
    return !isSuperAdmin() && !isMember(); // Super admin & members cannot manage
  }, [isSuperAdmin, isMember]);

  // Check if user can view users
  const canViewUsers = useCallback((): boolean => {
    return isAdmin(); // Only company owners can view/manage users
  }, [isAdmin]);

  // Check if user can manage users in a specific company
  const canManageUsers = useCallback(
    (companyId: string): boolean => {
      if (isSuperAdmin()) return false; // Super admin cannot manage company users

      const companyRole = getCompanyRole(companyId);
      return companyRole === "owner"; // Only company owners can manage users
    },
    [isSuperAdmin]
  );

  // Check if user can view super admin routes
  const canViewSuperAdmin = useCallback((): boolean => {
    return isSuperAdmin(); // Only super admin can view super admin routes
  }, [isSuperAdmin]);

  // Check if user can view profile
  const canViewProfile = useCallback((): boolean => {
    return true; // All roles can view their own profile
  }, []);

  // Check if user can create expenses
  const canCreateExpenses = useCallback(
    (companyId?: string): boolean => {
      if (isSuperAdmin()) return false;
      if (isAdmin() || isCompanyAdmin()) return true;

      // Members can only create if they have permission
      if (companyId) {
        const companyRole = getCompanyRole(companyId);
        return companyRole === "member"; // Members can create their own expenses
      }

      return isMember();
    },
    [isSuperAdmin, isAdmin, isCompanyAdmin, isMember]
  );

  // ========== HELPER FUNCTIONS ==========

  // Get company IDs
  const getCompanyIds = useCallback((): string[] => {
    if (isSuperAdmin()) return []; // Super admin has no company access
    return memoizedUser.companyRoles?.map((cr) => cr.companyId) || [];
  }, [memoizedUser, isSuperAdmin]);

  // Get company role - FIXED to handle missing companyId
  const getCompanyRole = useCallback(
    (companyId: string): string | null => {
      if (!memoizedUser.companyRoles || !companyId) return null;
      const role = memoizedUser.companyRoles.find(
        (cr) => cr.companyId === companyId
      )?.role;
      return role || null;
    },
    [memoizedUser]
  );

  // Get user's primary company ID
  const getPrimaryCompanyId = useCallback((): string | null => {
    if (!memoizedUser.companyRoles || memoizedUser.companyRoles.length === 0) {
      return null;
    }
    // Return the first company ID or primary company if available
    return memoizedUser.companyRoles[0]?.companyId || null;
  }, [memoizedUser]);

  // Memoized debug info
  const debugInfo = useMemo(() => {
    return {
      user: memoizedUser,
      permissions: {
        isSuperAdmin: isSuperAdmin(),
        isAdmin: isAdmin(),
        isCompanyOwner: isAdmin(), // Alias
        isCompanyAdmin: isCompanyAdmin(),
        isMember: isMember(),
        canViewDashboard: canViewDashboard(),
        canViewCompanies: canViewCompanies(),
        canManageCompanies: canManageCompanies(),
        canViewSuperAdmin: canViewSuperAdmin(),
        canCreateExpenses: canCreateExpenses(),
      },
    };
  }, [
    memoizedUser,
    isSuperAdmin,
    isAdmin,
    isCompanyAdmin,
    isMember,
    canViewDashboard,
    canViewCompanies,
    canManageCompanies,
    canViewSuperAdmin,
    canCreateExpenses,
  ]);

  return {
    user: memoizedUser,

    // Core role checkers - FIXED
    isSuperAdmin,
    isAdmin, // Company Owner
    isCompanyOwner: isAdmin, // Alias for Company Owner
    isCompanyAdmin: isCompanyAdminNoParam, // No parameters version
    isCompanyAdminForCompany: isCompanyAdmin, // With parameters version
    isMember,

    // Navigation permissions
    canViewDashboard,
    canViewCompanies,
    canManageCompanies,
    canViewSuperAdmin,

    // Feature permissions
    canViewExpenses,
    canManageExpenses: (companyId?: string) => canManageExpenses(companyId),
    canViewBudgets,
    canManageBudgets: (companyId?: string) => canManageBudgets(companyId),
    canViewAnalytics,
    canManageAnalytics,
    canCreateExpenses: (companyId?: string) => canCreateExpenses(companyId),

    // User management
    canViewUsers,
    canManageUsers,

    // Profile
    canViewProfile,

    // Helper functions
    getCompanyIds,
    getCompanyRole,
    getPrimaryCompanyId,

    // Debug info
    debugInfo,
  };
};
