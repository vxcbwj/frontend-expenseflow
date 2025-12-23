import React, { useState } from "react";
import { expenseAPI, type Expense } from "../../services/expenseAPI";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import { hasPermission } from "@/utils/permissions";
import EditExpenseForm from "../expenses/EditExpenseForm";

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseUpdated: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onExpenseUpdated,
}) => {
  // Debug: Check if keys are unique
  React.useEffect(() => {
    if (expenses.length > 0) {
      const ids = expenses.map((e) => e.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn("⚠️ ExpenseList: Duplicate expense IDs found!");
      }
    }
  }, [expenses]);

  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Permission checks
  const canEditExpenses = hasPermission(
    user,
    "canManageExpenses",
    currentCompany?.id || ""
  );
  const canDeleteExpenses = hasPermission(
    user,
    "canManageExpenses",
    currentCompany?.id || ""
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      electricity: "text-blue-600",
      water: "text-cyan-600",
      internet: "text-purple-600",
      rent: "text-red-600",
      supplies: "text-green-600",
      salaries: "text-orange-600",
      marketing: "text-pink-600",
      transportation: "text-indigo-600",
      other: "text-gray-600",
    };
    return colors[category] || "text-gray-600";
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      setLoading(true);
      await expenseAPI.deleteExpense(expenseId);
      onExpenseUpdated();
    } catch (err: any) {
      setError("Failed to delete expense");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleSaveEdit = () => {
    setEditingExpense(null);
    onExpenseUpdated();
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  if (error) {
    return (
      <div
        key="expense-list-error"
        className="bg-accent-1 bg-opacity-20 border border-accent-1 text-accent-1 px-4 py-3 rounded-lg text-center"
      >
        {error}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div
        key="expense-list-empty"
        className="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <p className="text-lg">No expenses yet</p>
        <p className="text-sm">Add your first expense to see it here</p>
      </div>
    );
  }

  return (
    <div
      key="expense-list-container"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      {/* Edit Form */}
      {editingExpense && (
        <EditExpenseForm
          key={`edit-form-${editingExpense.id}`}
          expense={editingExpense}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Table Header */}
      <div
        key="table-header"
        className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Expense History
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {expenses.length} expenses total
        </p>
      </div>

      {/* Table Content */}
      <div key="table-content" className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr key="table-header-row">
              <th
                key="header-description"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                key="header-category"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                key="header-date"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                key="header-vendor"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Vendor
              </th>
              <th
                key="header-amount"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Amount
              </th>
              {(canEditExpenses || canDeleteExpenses) && (
                <th
                  key="header-actions"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {(expenses || []).map((expense, index) => (
              <tr
                key={`expense-row-${expense.id || index}`} // Added fallback to index
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {expense.description}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                      expense.category
                    )} bg-opacity-10`}
                  >
                    {expense.category.charAt(0).toUpperCase() +
                      expense.category.slice(1)}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(expense.date)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {expense.vendor || "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900 dark:text-white">
                  {formatCurrency(expense.amount)}
                </td>

                {(canEditExpenses || canDeleteExpenses) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canEditExpenses && (
                      <button
                        key={`edit-btn-${expense.id}`}
                        onClick={() => handleEditExpense(expense)}
                        className="text-primary hover:text-opacity-80 mr-3 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteExpenses && (
                      <button
                        key={`delete-btn-${expense.id}`}
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-accent-1 hover:text-opacity-80 transition-colors"
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
