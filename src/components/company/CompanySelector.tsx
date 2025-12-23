// components/company/CompanySelector.tsx - FIXED VERSION
import React from "react";
import { useCompany } from "../../contexts/CompanyContext";

interface CompanySelectorProps {
  compact?: boolean;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  compact = false,
}) => {
  const { currentCompany, companies, setCurrentCompany, loading } =
    useCompany();

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value;
    setCurrentCompany(companyId); // Changed: pass companyId directly, not company object
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-full h-8"></div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
        No companies available
      </div>
    );
  }

  // Compact version for user menu
  if (compact) {
    return (
      <select
        value={currentCompany?.id || ""}
        onChange={handleCompanyChange}
        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    );
  }

  // Regular version
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
        Company:
      </span>
      <select
        value={currentCompany?.id || ""}
        onChange={handleCompanyChange}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-32 transition-colors"
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanySelector;
