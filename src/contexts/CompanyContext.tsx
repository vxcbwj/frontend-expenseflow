// contexts/CompanyContext.tsx - FULLY TYPED VERSION
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import api from "../services/api";

// ========== TYPE DEFINITIONS ==========

interface Company {
  id: string;
  _id: string;
  name: string;
  industry: string;
  currency: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  ownerId?: string;
  userRole?: string;
  canManage?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CompanyUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  globalRole: string;
  companyRole: string;
  joinedAt: string;
}

interface CreateCompanyData {
  name: string;
  industry: string;
  currency?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  description?: string;
  logo?: string;
}

interface UpdateCompanyData {
  name?: string;
  industry?: string;
  currency?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}

interface CompanyContextType {
  companies: Company[];
  currentCompany: Company | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCompanies: () => Promise<Company[]>;
  setCurrentCompany: (companyId: string | null) => void;
  createCompany: (companyData: CreateCompanyData) => Promise<{
    success: boolean;
    company?: Company;
    error?: string;
  }>;
  updateCompany: (
    companyId: string,
    companyData: UpdateCompanyData
  ) => Promise<{
    success: boolean;
    company?: Company;
    error?: string;
  }>;
  deleteCompany: (companyId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  getCompanyUsers: (companyId: string) => Promise<{
    success: boolean;
    users?: CompanyUser[];
    error?: string;
  }>;

  // Helpers
  hasCompanies: boolean;
  canManageCurrentCompany: boolean;
}

interface CompanyProviderProps {
  children: ReactNode;
}

// ========== CONTEXT CREATION ==========

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// ========== PROVIDER COMPONENT ==========

export const CompanyProvider: React.FC<CompanyProviderProps> = ({
  children,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch companies
  const fetchCompanies = useCallback(async (): Promise<Company[]> => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching companies...");

      const response = await api.get("/companies");

      if (response.data.success) {
        const companiesData: Company[] = response.data.companies || [];
        console.log(`✅ Fetched ${companiesData.length} companies`);

        setCompanies(companiesData);

        // Set current company if not already set
        if (!currentCompany && companiesData.length > 0) {
          const savedCompanyId = localStorage.getItem("currentCompanyId");
          if (savedCompanyId) {
            const savedCompany = companiesData.find(
              (c) => c.id === savedCompanyId || c._id === savedCompanyId
            );
            if (savedCompany) {
              setCurrentCompany(savedCompany);
            } else {
              setCurrentCompany(companiesData[0]);
            }
          } else {
            setCurrentCompany(companiesData[0]);
          }
        }

        return companiesData;
      } else {
        throw new Error(response.data.error || "Failed to fetch companies");
      }
    } catch (err: any) {
      console.error("❌ CompanyContext: Fetch companies error:", err);

      // Handle specific error cases
      if (err.response?.status === 401) {
        setError("Authentication required. Please log in again.");
        console.log("⚠️ 401 Unauthorized - Token may be invalid");

        // Clear auth data if token is invalid
        if (!localStorage.getItem("token")) {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } else if (err.response?.status === 403) {
        setError("Access denied to companies");
        console.log("⚠️ 403 Forbidden - User may not have company access");
      } else {
        setError(err.message || "Failed to load companies");
      }

      setCompanies([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentCompany]);

  // Set current company
  const setCurrentCompanyById = useCallback(
    (companyId: string | null) => {
      if (!companyId) {
        setCurrentCompany(null);
        localStorage.removeItem("currentCompanyId");
        return;
      }

      const company = companies.find(
        (c) => c.id === companyId || c._id === companyId
      );

      if (company) {
        setCurrentCompany(company);
        localStorage.setItem("currentCompanyId", company.id || company._id);
        console.log(`✅ Current company set to: ${company.name}`);
      } else {
        console.warn(`⚠️ Company with ID ${companyId} not found`);
      }
    },
    [companies]
  );

  // Create new company
  const createCompany = useCallback(
    async (
      companyData: CreateCompanyData
    ): Promise<{ success: boolean; company?: Company; error?: string }> => {
      setLoading(true);
      setError(null);

      try {
        console.log("🏢 Creating new company:", companyData.name);

        const response = await api.post("/companies", companyData);

        if (response.data.success) {
          console.log(
            "✅ Company created successfully:",
            response.data.company
          );

          // Refresh companies list
          await fetchCompanies();

          // Set as current company
          if (response.data.company) {
            setCurrentCompany(response.data.company);
            localStorage.setItem("currentCompanyId", response.data.company.id);
          }

          return { success: true, company: response.data.company };
        } else {
          throw new Error(response.data.error || "Failed to create company");
        }
      } catch (err: any) {
        console.error("❌ Create company error:", err);
        const errorMsg =
          err.response?.data?.error ||
          err.message ||
          "Failed to create company";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchCompanies]
  );

  // Update company
  const updateCompany = useCallback(
    async (
      companyId: string,
      companyData: UpdateCompanyData
    ): Promise<{ success: boolean; company?: Company; error?: string }> => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Updating company:", companyId);

        const response = await api.put(`/companies/${companyId}`, companyData);

        if (response.data.success) {
          console.log("✅ Company updated successfully");

          // Refresh companies list
          await fetchCompanies();

          // Update current company if it's the one being updated
          if (
            currentCompany &&
            (currentCompany.id === companyId ||
              currentCompany._id === companyId)
          ) {
            setCurrentCompany(response.data.company);
          }

          return { success: true, company: response.data.company };
        } else {
          throw new Error(response.data.error || "Failed to update company");
        }
      } catch (err: any) {
        console.error("❌ Update company error:", err);
        const errorMsg =
          err.response?.data?.error ||
          err.message ||
          "Failed to update company";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchCompanies, currentCompany]
  );

  // Delete company
  const deleteCompany = useCallback(
    async (
      companyId: string
    ): Promise<{ success: boolean; error?: string }> => {
      setLoading(true);
      setError(null);

      try {
        console.log("🗑️ Deleting company:", companyId);

        const response = await api.delete(`/companies/${companyId}`);

        if (response.data.success) {
          console.log("✅ Company deleted successfully");

          // Refresh companies list
          await fetchCompanies();

          // Clear current company if it was deleted
          if (
            currentCompany &&
            (currentCompany.id === companyId ||
              currentCompany._id === companyId)
          ) {
            setCurrentCompany(null);
            localStorage.removeItem("currentCompanyId");
          }

          return { success: true };
        } else {
          throw new Error(response.data.error || "Failed to delete company");
        }
      } catch (err: any) {
        console.error("❌ Delete company error:", err);
        const errorMsg =
          err.response?.data?.error ||
          err.message ||
          "Failed to delete company";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchCompanies, currentCompany]
  );

  // Get company users
  const getCompanyUsers = useCallback(
    async (
      companyId: string
    ): Promise<{ success: boolean; users?: CompanyUser[]; error?: string }> => {
      setLoading(true);
      setError(null);

      try {
        console.log("👥 Fetching users for company:", companyId);

        const response = await api.get(`/companies/${companyId}/users`);

        if (response.data.success) {
          console.log(
            `✅ Fetched ${response.data.data?.users?.length || 0} users`
          );
          return {
            success: true,
            users: response.data.data?.users || [],
          };
        } else {
          throw new Error(
            response.data.error || "Failed to fetch company users"
          );
        }
      } catch (err: any) {
        console.error("❌ Get company users error:", err);
        const errorMsg =
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch company users";
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initialize on mount and when auth changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("🔄 CompanyContext: Initializing with token");
      fetchCompanies();
    } else {
      console.log("⚠️ CompanyContext: No token found, skipping initialization");
      setCompanies([]);
      setCurrentCompany(null);
    }
  }, [fetchCompanies]);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("🔄 CompanyContext: Auth changed, refreshing companies");
        fetchCompanies();
      } else {
        console.log("⚠️ CompanyContext: Auth cleared, resetting companies");
        setCompanies([]);
        setCurrentCompany(null);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, [fetchCompanies]);

  // Context value
  const contextValue: CompanyContextType = {
    companies,
    currentCompany,
    loading,
    error,

    // Actions
    fetchCompanies,
    setCurrentCompany: setCurrentCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyUsers,

    // Helpers
    hasCompanies: companies.length > 0,
    canManageCurrentCompany:
      currentCompany?.userRole === "owner" ||
      currentCompany?.userRole === "admin",
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

// ========== CUSTOM HOOK ==========

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within CompanyProvider");
  }
  return context;
};

// ========== HELPER FUNCTIONS ==========

export const companyHelpers = {
  getCompanyById: (
    companies: Company[],
    companyId: string
  ): Company | undefined => {
    return companies.find((c) => c.id === companyId || c._id === companyId);
  },

  getCompanyName: (company: Company | null | undefined): string => {
    return company?.name || "Unknown Company";
  },

  formatCompanyData: (company: Company | null) => {
    if (!company) return null;

    return {
      id: company.id || company._id,
      name: company.name,
      industry: company.industry,
      currency: company.currency,
      userRole: company.userRole,
      canManage: company.userRole === "owner" || company.userRole === "admin",
    };
  },
};
