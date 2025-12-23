import api from "./api";

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
