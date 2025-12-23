// App.tsx - CLEAN VERSION (unused variables removed)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { CompanyProvider } from "./contexts/CompanyContext";
import { AuthProvider } from "./contexts/AuthContext";
import { usePermissions } from "./hooks/userPermissions";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import CompanyManagement from "./components/company/CompanyManagement";
import AnalyticsPage from "./pages/AnalyticsPage";
import BudgetPage from "./pages/BudgetPage";
import ExpenseListPage from "./pages/ExpenseListPage";
import SuperAdminPage from "./pages/SuperAdminPage";
import SystemStatsPage from "./pages/SystemStatsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SuperAdminSearchPage from "./pages/SuperAdminSearchPage";
import BulkActionsPage from "./pages/BulkActionsPage";
import CompanyUsersPage from "./pages/CompanyUsersPage";
import CompanyOwnerManagement from "./components/company/CompanyOwnerManagement";
import RoleTestPage from "./pages/RolesTestPage";
import LandingPage from "./pages/LandingPage";

// ========== ROUTE PROTECTION COMPONENTS ==========
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSuperAdmin } = usePermissions();

  if (!isSuperAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = usePermissions();

  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// ========== MAIN APP CONTENT ==========
function AppContent() {
  const isLoggedIn = !!localStorage.getItem("token");
  const { isDark } = useTheme();

  // Start with sidebar collapsed by default
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : true;
  });

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "sidebarCollapsed",
      JSON.stringify(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector("[data-sidebar]");
      const toggleButton = document.querySelector("[data-toggle-button]");

      if (
        window.innerWidth < 1024 &&
        !isSidebarCollapsed &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsSidebarCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarCollapsed]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "dark" : ""
      }`}
    >
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar
            onToggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          <div className="flex">
            {/* Sidebar with toggle functionality */}
            {isLoggedIn && (
              <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
              />
            )}

            {/* Main content with dynamic margin */}
            <main
              className={`
                flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300
                ${isLoggedIn && !isSidebarCollapsed ? "lg:ml-64" : ""}
                mt-16 p-6
              `}
            >
              <div className="max-w-7xl mx-auto">
                <Routes>
                  {/* ========== PUBLIC ROUTES ========== */}
                  <Route
                    path="/"
                    element={
                      // Check auth WITHOUT triggering API calls
                      localStorage.getItem("token") ? (
                        <Navigate to="/dashboard" />
                      ) : (
                        <LandingPage />
                      )
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* ========== SUPER ADMIN ONLY ROUTES ========== */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <SuperAdminRoute>
                          <SuperAdminPage />
                        </SuperAdminRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/system-stats"
                    element={
                      <ProtectedRoute>
                        <SuperAdminRoute>
                          <SystemStatsPage />
                        </SuperAdminRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/audit-logs"
                    element={
                      <ProtectedRoute>
                        <SuperAdminRoute>
                          <AuditLogsPage />
                        </SuperAdminRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/search"
                    element={
                      <ProtectedRoute>
                        <SuperAdminRoute>
                          <SuperAdminSearchPage />
                        </SuperAdminRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/super-admin/bulk-actions"
                    element={
                      <ProtectedRoute>
                        <SuperAdminRoute>
                          <BulkActionsPage />
                        </SuperAdminRoute>
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== ALL AUTHENTICATED USERS ========== */}
                  {/* Profile - Everyone can access their own profile */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== MEMBER ACCESS ONLY (No Admin/Owner pages) ========== */}
                  {/* Dashboard - Shows different views based on role */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Expenses - Members can view, owners/admins can manage */}
                  <Route
                    path="/expenses"
                    element={
                      <ProtectedRoute>
                        <ExpenseListPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Budgets - Members can view, owners/admins can manage */}
                  <Route
                    path="/budgets"
                    element={
                      <ProtectedRoute>
                        <BudgetPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Analytics - Members can view (read-only), owners/admins have filters */}
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== ADMIN/OWNER ONLY ROUTES (BLOCK MEMBERS) ========== */}
                  {/* Company Management - Owners/Admins only */}
                  <Route
                    path="/companies"
                    element={
                      <ProtectedRoute>
                        <AdminRoute>
                          <CompanyManagement />
                        </AdminRoute>
                      </ProtectedRoute>
                    }
                  />

                  {/* My Companies - Owners/Admins only */}
                  <Route
                    path="/my-companies"
                    element={
                      <ProtectedRoute>
                        <AdminRoute>
                          <CompanyOwnerManagement />
                        </AdminRoute>
                      </ProtectedRoute>
                    }
                  />

                  {/* Team Management - Owners/Admins only */}
                  <Route
                    path="/company-users/:companyId"
                    element={
                      <ProtectedRoute>
                        <AdminRoute>
                          <CompanyUsersPage />
                        </AdminRoute>
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== DEVELOPMENT/TEST ROUTES ========== */}
                  <Route
                    path="/role-test"
                    element={
                      <ProtectedRoute>
                        <RoleTestPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== 404 ROUTE ========== */}
                  <Route
                    path="*"
                    element={
                      <div className="text-center py-20">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                          404
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                          Page not found
                        </p>
                      </div>
                    }
                  />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompanyProvider>
          <AppContent />
        </CompanyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
