import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "../../contexts/CompanyContext";
import { companyAPI, type CreateCompanyData } from "../../services/companyAPI";
import { isSuperAdmin } from "@/utils/permissions";

const CompanyManagement: React.FC = () => {
  const { user } = useAuth();
  const { companies, fetchCompanies, loading } = useCompany();
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [formData, setFormData] = useState<CreateCompanyData>({
    name: "",
    industry: "",
    currency: "USD",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  // Only super admin can access this page
  if (!isSuperAdmin(user)) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page is only accessible to super administrators.
          </p>
        </div>
      </div>
    );
  }

  // Create or Update Company
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      if (editingCompany) {
        // Update existing company
        await companyAPI.updateCompany(editingCompany.id, formData);
      } else {
        // Create new company
        await companyAPI.createCompany(formData);
      }

      await fetchCompanies();
      setShowForm(false);
      setEditingCompany(null);
      setFormData({ name: "", industry: "", currency: "USD" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save company");
    } finally {
      setFormLoading(false);
    }
  };

  // Edit Company
  const handleEditCompany = (company: any) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      industry: company.industry,
      currency: company.currency,
    });
    setShowForm(true);
    setError("");
  };

  // Delete Company
  const handleDeleteCompany = async (companyId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this company? This will also delete all expenses associated with it."
      )
    ) {
      return;
    }

    try {
      await companyAPI.deleteCompany(companyId);
      await fetchCompanies();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete company");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Cancel edit/create
  const handleCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
    setFormData({ name: "", industry: "", currency: "USD" });
    setError("");
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading companies...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Company Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Super Admin Dashboard
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCompany(null);
            setFormData({ name: "", industry: "", currency: "USD" });
            setShowForm(!showForm);
          }}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {showForm ? "✕ Cancel" : "＋ Add Company"}
        </button>
      </div>

      {/* Add/Edit Company Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            {editingCompany ? "Edit Company" : "Add New Company"}
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="DZD">DZD (د.ج)</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {formLoading
                  ? editingCompany
                    ? "Updating..."
                    : "Creating..."
                  : editingCompany
                  ? "Update Company"
                  : "Create Company"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {company.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Industry: {company.industry}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Currency: {company.currency}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created:{" "}
              {company.createdAt
                ? new Date(company.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEditCompany(company)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCompany(company.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No companies yet. Create your first company to get started!</p>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
