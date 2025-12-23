// utils/backendAdapter.ts - FIXED
import { UserProfile } from "../services/userAPI";

export const adaptBackendUserForFrontend = (backendUser: any): UserProfile => {
  const companyRoles = backendUser.companyRoles || [];

  return {
    id: backendUser.id || backendUser._id,
    email: backendUser.email,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    phone: backendUser.phone,
    avatar: backendUser.avatar,

    // Main role field (required)
    role: backendUser.globalRole || backendUser.role || "member",

    // Backward compatibility fields
    assignedCompanies: companyRoles.map((cr: any) => cr.companyId),
    assignedCompanyId:
      backendUser.primaryCompanyId || companyRoles[0]?.companyId,

    // Backend structure
    globalRole: backendUser.globalRole || backendUser.role,
    companyRoles: companyRoles,
    primaryCompanyId: backendUser.primaryCompanyId,

    preferences: backendUser.preferences || {
      theme: "auto",
      currency: "USD",
      language: "en",
    },
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
  };
};

export const getAssignedCompanies = (user: UserProfile): string[] => {
  return user.companyRoles?.map((cr) => cr.companyId) || [];
};

export const getAssignedCompanyId = (user: UserProfile): string | undefined => {
  return user.primaryCompanyId || user.companyRoles?.[0]?.companyId;
};
