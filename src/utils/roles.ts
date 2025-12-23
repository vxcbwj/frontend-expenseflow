// utils/roles.ts - FIXED VERSION
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  COMPANY_OWNER: "COMPANY_OWNER",
  COMPANY_ADMIN: "COMPANY_ADMIN",
  MEMBER: "MEMBER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.COMPANY_OWNER]: "Company Owner",
  [ROLES.COMPANY_ADMIN]: "Company Admin",
  [ROLES.MEMBER]: "Team Member",
};

// Role hierarchy - who can manage whom
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [ROLES.SUPER_ADMIN]: [ROLES.COMPANY_OWNER, ROLES.COMPANY_ADMIN, ROLES.MEMBER],
  [ROLES.COMPANY_OWNER]: [ROLES.COMPANY_ADMIN, ROLES.MEMBER],
  [ROLES.COMPANY_ADMIN]: [ROLES.MEMBER],
  [ROLES.MEMBER]: [],
};

// Check if a role can manage another role
export const canManageRole = (managerRole: Role, targetRole: Role): boolean => {
  return ROLE_HIERARCHY[managerRole]?.includes(targetRole) || false;
};

// Get role label
export const getRoleLabel = (role: string): string => {
  return ROLE_LABELS[role as Role] || role;
};

// Check if user has role
export const hasRole = (user: any, role: Role): boolean => {
  return user?.role === role || user?.globalRole === role;
};

// Get user's main company (for backward compatibility)
export const getUserMainCompany = (user: any): string | null => {
  if (!user) return null;
  if (user.globalRole === ROLES.SUPER_ADMIN) return null;
  return user.primaryCompanyId || user.companyRoles?.[0]?.companyId || null;
};

// Get all companies user can access (for backward compatibility)
export const getUserCompanies = (user: any): string[] => {
  if (!user) return [];
  if (user.globalRole === ROLES.SUPER_ADMIN) return [];
  return user.companyRoles?.map((cr: any) => cr.companyId) || [];
};

// Check if user is at least a certain role
export const isAtLeastRole = (user: any, minRole: Role): boolean => {
  if (!user?.globalRole && !user?.role) return false;

  const userRole = (user.globalRole || user.role) as Role;
  const roleHierarchyOrder = [
    ROLES.MEMBER,
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_OWNER,
    ROLES.SUPER_ADMIN,
  ] as const;

  const userIndex = roleHierarchyOrder.indexOf(userRole);
  const minIndex = roleHierarchyOrder.indexOf(minRole);

  return userIndex >= minIndex;
};
