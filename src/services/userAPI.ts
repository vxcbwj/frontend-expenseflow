// services/userAPI.ts - COMPLETE UPDATED VERSION
import api from "./api";

// Updated to match backend User model
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;

  // Main role field (maps to backend's globalRole)
  role: string; // "super_admin", "company_owner", "company_admin", "member"

  // For backward compatibility
  assignedCompanies?: string[];
  assignedCompanyId?: string;

  // Backend structure
  globalRole?: string;
  companyRoles?: Array<{
    companyId: string;
    role: "member" | "owner" | "admin";
    joinedAt: string;
  }>;
  primaryCompanyId?: string;

  preferences: {
    theme: "light" | "dark" | "auto";
    currency: string;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferences?: {
    theme?: "light" | "dark" | "auto";
    currency?: string;
    language?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Helper to normalize backend response to UserProfile
export const normalizeBackendUser = (backendUser: any): UserProfile => {
  const companyRoles = backendUser.companyRoles || [];

  return {
    id: backendUser.id || backendUser._id,
    email: backendUser.email,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    phone: backendUser.phone,
    avatar: backendUser.avatar,

    // Main role field
    role: backendUser.globalRole || backendUser.role || "MEMBER",

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

export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<{
    success: boolean;
    message: string;
    user: UserProfile;
  }> => {
    const response = await api.get("/auth/profile");
    return {
      ...response.data,
      user: normalizeBackendUser(response.data.user),
    };
  },

  // Update user profile
  updateProfile: async (
    profileData: UpdateProfileData
  ): Promise<{
    success: boolean;
    message: string;
    user: UserProfile;
  }> => {
    const response = await api.put("/auth/profile", profileData);
    return {
      ...response.data,
      user: normalizeBackendUser(response.data.user),
    };
  },

  // Change password
  changePassword: async (
    passwordData: ChangePasswordData
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api.put("/auth/password", passwordData);
    return response.data;
  },
};

// Dashboard types
export interface SystemOverview {
  totalUsers: number;
  totalCompanies: number;
  totalExpenses: number;
  totalExpenseAmount: number;
  totalBudget: number;
  activeTimeframe: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface RecentActivity {
  newUsers: Array<{
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
  }>;
  newCompanies: Array<{
    _id: string;
    name: string;
    industry: string;
    createdAt: string;
  }>;
}

export interface GrowthMetrics {
  userGrowth: Array<{
    _id: string;
    count: number;
  }>;
  companyGrowth: Array<{
    _id: string;
    count: number;
  }>;
}

export interface AnalyticsData {
  dailyActivity: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  expensesByCategory: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
}

export interface SystemHealth {
  database: string;
  uptime: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
}

export interface DashboardData {
  overview: SystemOverview;
  recentActivity: RecentActivity;
  growthMetrics: GrowthMetrics;
  analytics: AnalyticsData;
  systemHealth: SystemHealth;
}

// System Stats types
export interface RoleDistribution {
  _id: string;
  count: number;
}

export interface MonthlyExpense {
  _id: string;
  totalAmount: number;
  averageAmount: number;
  count: number;
}

export interface TopUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  totalAmount: number;
  count: number;
}

export interface TopCompany {
  companyId: string;
  companyName: string;
  industry: string;
  totalAmount: number;
  count: number;
}

export interface SystemStatsData {
  roleDistribution: RoleDistribution[];
  companyUserDistribution: Array<{
    _id: number;
    companyCount: number;
  }>;
  monthlyExpenses: MonthlyExpense[];
  topUsersByExpenses: TopUser[];
  topCompaniesByExpenses: TopCompany[];
}

// Audit Log types
export interface AuditLog {
  type: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userEmail: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Search types
export interface SearchResult {
  users?: Array<{
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
  }>;
  companies?: Array<{
    _id: string;
    name: string;
    industry: string;
    createdAt: string;
    isActive: boolean;
  }>;
  expenses?: Array<{
    _id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
    vendor: string;
    companyId: {
      _id: string;
      name: string;
    };
  }>;
}

// Bulk Actions types
export interface BulkActionRequest {
  action: string;
  data: any;
  options?: Record<string, any>;
}

export const superAdminAPI = {
  // Get dashboard data
  getDashboard: async (
    timeframe?: string
  ): Promise<{
    success: boolean;
    data: DashboardData;
  }> => {
    const params = new URLSearchParams();
    if (timeframe) params.append("timeframe", timeframe);

    const url = `/super-admin/dashboard${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await api.get(url);
    return response.data;
  },

  // Get system statistics
  getSystemStats: async (): Promise<{
    success: boolean;
    data: SystemStatsData;
  }> => {
    const response = await api.get("/super-admin/system-stats");
    return response.data;
  },

  // Get audit logs
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    success: boolean;
    data: AuditLogsResponse;
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.action) queryParams.append("action", params.action);
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const url = `/super-admin/audit-logs${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await api.get(url);
    return response.data;
  },

  // Search across all entities
  search: async (
    query: string,
    entity?: string,
    limit?: number
  ): Promise<{
    success: boolean;
    data: SearchResult;
    query: string;
    entity: string;
  }> => {
    const params = new URLSearchParams();
    params.append("query", query);
    if (entity) params.append("entity", entity);
    if (limit) params.append("limit", limit.toString());

    const response = await api.get(`/super-admin/search?${params.toString()}`);
    return response.data;
  },

  // Perform bulk actions
  performBulkAction: async (
    action: string,
    data: any,
    options?: Record<string, any>
  ): Promise<{
    success: boolean;
    message: string;
    result: any;
  }> => {
    const response = await api.post("/super-admin/bulk-actions", {
      action,
      data,
      options,
    });
    return response.data;
  },

  // Get server health
  getServerHealth: async (): Promise<{
    status: string;
    database: string;
    timestamp: string;
  }> => {
    const response = await api.get("/health");
    return response.data;
  },
};

// Defines what an expense looks like in TS
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  vendor?: string;
  isRecurring?: boolean;
  companyId: string;
}

export interface CreateExpenseData {
  amount: number;
  category: string;
  description: string;
  date?: string;
  vendor?: string;
  isRecurring?: boolean;
  companyId: string;
}

// Expense API calls
export const expenseAPI = {
  // Get all expenses for logged-in user Added companyId parameter
  getExpenses: async (
    companyId?: string
  ): Promise<{
    success: boolean;
    message: string;
    count: number;
    expenses: Expense[];
  }> => {
    const url = companyId ? `/expenses?companyId=${companyId}` : "/expenses";
    const response = await api.get(url);
    return response.data;
  },

  // Create new expense
  createExpense: async (
    expenseData: CreateExpenseData
  ): Promise<{
    success: boolean;
    message: string;
    expense: Expense;
  }> => {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  },

  // Update existing expense
  updateExpense: async (
    id: string,
    expenseData: Partial<CreateExpenseData>
  ): Promise<{
    success: boolean;
    message: string;
    expense: Expense;
  }> => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};

// services/companyUsersAPI.ts
import api2 from "./api";

export interface CompanyUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  globalRole: string;
  companyRole: string;
  department?: string;
  isActive: boolean;
  joinedAt?: string;
}

export interface CompanyUsersResponse {
  success: boolean;
  users: CompanyUser[];
  company: {
    id: string;
    name: string;
    industry: string;
  };
}

export interface InviteUserData {
  email: string;
  role: string;
  department?: string;
}

export const companyUsersAPI = {
  // Get all users for a company
  getCompanyUsers: async (companyId: string): Promise<CompanyUsersResponse> => {
    const response = await api2.get(`/company-users/${companyId}`);
    return response.data;
  },

  // Add user to company
  inviteUser: async (
    companyId: string,
    userData: InviteUserData
  ): Promise<{
    success: boolean;
    message: string;
    user: CompanyUser;
  }> => {
    const response = await api2.post(
      `/company-users/${companyId}/invite`,
      userData
    );
    return response.data;
  },

  // Update user role in company
  updateUserRole: async (
    companyId: string,
    userId: string,
    updateData: { role?: string; department?: string; isActive?: boolean }
  ): Promise<{
    success: boolean;
    message: string;
    user: CompanyUser;
  }> => {
    const response = await api2.put(
      `/company-users/${companyId}/users/${userId}`,
      updateData
    );
    return response.data;
  },

  // Remove user from company
  removeUser: async (
    companyId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api2.delete(
      `/company-users/${companyId}/users/${userId}`
    );
    return response.data;
  },
};

// Define what a Company looks like
export interface Company {
  id: string;
  name: string;
  industry: string;
  currency: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  website?: string;
  taxId?: string;
  fiscalYearStart?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
  industry: string;
  currency?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  website?: string;
}

// Company API calls
export const companyAPI = {
  // Get all companies for the logged-in user
  getCompanies: async (): Promise<{
    success: boolean;
    companies: Company[];
  }> => {
    const response = await api2.get("/companies");
    return response.data;
  },

  // Create a new company
  createCompany: async (
    companyData: CreateCompanyData
  ): Promise<{
    success: boolean;
    message: string;
    company: Company;
  }> => {
    const response = await api2.post("/companies", companyData);
    return response.data;
  },

  //Update an existing company
  updateCompany: async (
    id: string,
    companyData: Partial<CreateCompanyData>
  ): Promise<{
    success: boolean;
    message: string;
    company: Company;
  }> => {
    const response = await api2.put(`/companies/${id}`, companyData);
    return response.data;
  },

  //Delete a company
  deleteCompany: async (
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api2.delete(`/companies/${id}`);
    return response.data;
  },
};

// Define what a Budget looks like
export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  name?: string;
  description?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetData {
  category: string;
  amount: number;
  period?: string;
  startDate?: string;
  endDate?: string;
  name?: string;
  description?: string;
  companyId: string;
}

export interface UpdateBudgetData {
  category?: string;
  amount?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Budget with spending progress
export interface BudgetWithProgress extends Budget {
  currentSpending: number;
  percentageUsed: number;
  remaining: number;
  status: "on_track" | "warning" | "exceeded";
}

export const budgetAPI = {
  // Get all budgets for user
  getBudgets: async (
    companyId?: string
  ): Promise<{
    success: boolean;
    message: string;
    count: number;
    budgets: Budget[];
  }> => {
    const url = companyId ? `/budgets?companyId=${companyId}` : "/budgets";
    const response = await api2.get(url);
    return response.data;
  },

  // Create new budget
  createBudget: async (
    budgetData: CreateBudgetData
  ): Promise<{
    success: boolean;
    message: string;
    budget: Budget;
  }> => {
    const response = await api2.post("/budgets", budgetData);
    return response.data;
  },

  // Update budget
  updateBudget: async (
    id: string,
    budgetData: UpdateBudgetData
  ): Promise<{
    success: boolean;
    message: string;
    budget: Budget;
  }> => {
    const response = await api2.put(`/budgets/${id}`, budgetData);
    return response.data;
  },

  // Delete budget
  deleteBudget: async (
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api2.delete(`/budgets/${id}`);
    return response.data;
  },
};

export interface OverviewData {
  totalSpent: number;
  totalExpenses: number;
  monthlyAverage: number;
  largestExpense: number;
  topCategory: string;
  topCategoryAmount: number;
  averageExpense: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  average: number;
}

export interface MonthlyTrend {
  month: string;
  amount: number;
  count: number;
  monthKey: string;
}

export interface AnalyticsFilters {
  dateRange?: string; // "30days" | "3months" | "6months" | "custom"
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

export const analyticsAPI = {
  // Get overview metrics
  getOverview: async (
    filters?: AnalyticsFilters
  ): Promise<{
    success: boolean;
    data: OverviewData;
  }> => {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append("companyId", filters.companyId);
    if (filters?.dateRange) params.append("dateRange", filters.dateRange);

    const response = await api2.get(`/analytics/overview?${params.toString()}`);
    return response.data;
  },

  // Get category breakdown
  getCategories: async (
    filters?: AnalyticsFilters
  ): Promise<{
    success: boolean;
    data: CategoryBreakdown[];
  }> => {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append("companyId", filters.companyId);
    if (filters?.dateRange) params.append("dateRange", filters.dateRange);

    const response = await api2.get(
      `/analytics/categories?${params.toString()}`
    );
    return response.data;
  },

  // Get monthly trends
  getTrends: async (
    filters?: AnalyticsFilters
  ): Promise<{
    success: boolean;
    data: MonthlyTrend[];
  }> => {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append("companyId", filters.companyId);
    if (filters?.dateRange) params.append("dateRange", filters.dateRange);
    params.append("months", "6"); // Default to 6 months for trends

    const response = await api2.get(`/analytics/trends?${params.toString()}`);
    return response.data;
  },
};
