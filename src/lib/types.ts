// User type
export interface User {
  id: string;
  email: string;
  created_at: string;
  name?: string;
}

// Transaction type
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category_id: string;
  date: string;
  is_income: boolean;
  created_at: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  user_id?: string;
  is_income: boolean;
  is_default?: boolean;
}

// Budget type
export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  created_at: string;
}

// Savings Goal type
export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  created_at: string;
}

// Dashboard summary type
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topExpenseCategories: {
    category: Category;
    amount: number;
  }[];
  recentTransactions: Transaction[];
  budgetProgress: {
    category: Category;
    budgeted: number;
    spent: number;
    remaining: number;
  }[];
}
