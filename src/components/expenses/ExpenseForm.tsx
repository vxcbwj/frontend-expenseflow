// components/expenses/expenseform.tsx
import React, { useState } from "react";
import { expenseAPI, type CreateExpenseData } from "../../services/expenseAPI";
import { useCompany } from "../../contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseFormProps {
  onExpenseAdded: () => void;
  compact?: boolean; // Optional prop for compact version
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onExpenseAdded,
  compact = false,
}) => {
  const { currentCompany } = useCompany();
  const categories = [
    "electricity",
    "water",
    "internet",
    "rent",
    "supplies",
    "salaries",
    "marketing",
    "transportation",
    "other",
  ];

  const [formData, setFormData] = useState<CreateExpenseData>({
    amount: 0,
    category: "other",
    description: "",
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    companyId: currentCompany?.id || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    if (currentCompany) {
      setFormData((prev) => ({
        ...prev,
        companyId: currentCompany.id,
      }));
    }
  }, [currentCompany]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // check if company is selected
    if (!formData.companyId) {
      setError("Please select a company first");
      setLoading(false);
      return;
    }

    // Basic validation
    if (formData.amount <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description");
      setLoading(false);
      return;
    }

    try {
      await expenseAPI.createExpense(formData);
      setSuccess("Expense added successfully!");

      // Reset form
      setFormData({
        amount: 0,
        category: "other",
        description: "",
        date: new Date().toISOString().split("T")[0],
        vendor: "",
        companyId: currentCompany?.id || "",
      });

      // Refresh parent component
      onExpenseAdded();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  // Compact version for sidebar
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Amount */}
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              >
                Amount
              </label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount || ""}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                className="h-9"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              >
                Description
              </label>
              <Input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="What was this for?"
                className="h-9"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full h-9">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                "Add Expense"
              )}
            </Button>

            {/* Messages */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                {success}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              >
                Amount ($)
              </label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount || ""}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
            >
              Description
            </label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="What was this expense for?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor */}
            <div className="space-y-2">
              <label
                htmlFor="vendor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              >
                Vendor (Optional)
              </label>
              <Input
                type="text"
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                placeholder="Who did you pay?"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
              >
                Date
              </label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Expense...
              </>
            ) : (
              "Add Expense"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
