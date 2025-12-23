import api from "./api";

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
