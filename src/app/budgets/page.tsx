'use client';

import { useEffect, useState } from 'react';
import { Budget, Category, Transaction } from '@/lib/types';
import { useRouter } from 'next/navigation';
import BudgetCard from '@/components/budgets/BudgetCard';
import BudgetForm from '@/components/budgets/BudgetForm';
import { FiPlus } from 'react-icons/fi';

// Mock data (same as in dashboard)
const mockCategories: Category[] = [
  { id: '1', name: 'Housing', color: '#4F46E5', is_income: false, is_default: true },
  { id: '2', name: 'Food', color: '#10B981', is_income: false, is_default: true },
  { id: '3', name: 'Transportation', color: '#F59E0B', is_income: false, is_default: true },
  { id: '4', name: 'Entertainment', color: '#EC4899', is_income: false, is_default: true },
  { id: '5', name: 'Utilities', color: '#6366F1', is_income: false, is_default: true },
  { id: '6', name: 'Salary', color: '#34D399', is_income: true, is_default: true },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    user_id: '1',
    amount: 2000,
    description: 'Salary',
    category_id: '6',
    date: new Date().toISOString(),
    is_income: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    amount: 800,
    description: 'Rent',
    category_id: '1',
    date: new Date().toISOString(),
    is_income: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '1',
    amount: 150,
    description: 'Groceries',
    category_id: '2',
    date: new Date().toISOString(),
    is_income: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: '1',
    amount: 50,
    description: 'Gas',
    category_id: '3',
    date: new Date().toISOString(),
    is_income: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    user_id: '1',
    amount: 30,
    description: 'Movie tickets',
    category_id: '4',
    date: new Date().toISOString(),
    is_income: false,
    created_at: new Date().toISOString(),
  },
];

// Mock budgets
const mockBudgets: Budget[] = [
  {
    id: '1',
    user_id: '1',
    category_id: '1',
    amount: 1000,
    period: 'monthly',
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    category_id: '2',
    amount: 300,
    period: 'monthly',
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '1',
    category_id: '3',
    amount: 200,
    period: 'monthly',
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export default function BudgetsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    // Check if user is logged in using localStorage
    const userJson = localStorage.getItem('cashminder_user');

    if (!userJson) {
      router.push('/auth/login');
      return;
    }

    try {
      // Parse user data
      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';
      const isNewUser = userData.isNewUser === true;

      // If this is a new user, show empty data
      if (isNewUser) {
        // For new users, initialize with empty data
        setBudgets([]);
      } else {
        // For returning users, try to load their data from localStorage
        const storedBudgets = localStorage.getItem(`cashminder_budgets_${userId}`);

        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        } else {
          // Start with empty budgets for new users
          setBudgets([]);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Start with empty budgets in case of error
      setBudgets([]);
    }

    setIsLoading(false);
  }, [router]);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        // Get the current user
        const userJson = localStorage.getItem('cashminder_user');
        if (!userJson) return;

        const userData = JSON.parse(userJson);
        const userId = userData.id || 'default';

        // Update budgets in state
        const updatedBudgets = budgets.filter((b) => b.id !== budgetId);
        setBudgets(updatedBudgets);

        // Save to localStorage
        localStorage.setItem(`cashminder_budgets_${userId}`, JSON.stringify(updatedBudgets));
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Failed to delete budget. Please try again.');
      }
    }
  };

  const handleSubmitBudget = (budgetData: Omit<Budget, 'id' | 'user_id' | 'created_at'>) => {
    try {
      // Get the current user
      const userJson = localStorage.getItem('cashminder_user');
      if (!userJson) return;

      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';

      let updatedBudgets: Budget[];

      if (editingBudget) {
        // Update existing budget
        updatedBudgets = budgets.map((b) =>
          b.id === editingBudget.id
            ? { ...b, ...budgetData }
            : b
        );
      } else {
        // Add new budget
        const newBudget: Budget = {
          id: `budget_${Date.now()}`,
          user_id: userId,
          created_at: new Date().toISOString(),
          ...budgetData,
        };
        updatedBudgets = [...budgets, newBudget];
      }

      // Update state
      setBudgets(updatedBudgets);

      // Save to localStorage
      localStorage.setItem(`cashminder_budgets_${userId}`, JSON.stringify(updatedBudgets));
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    }

    setShowForm(false);
    setEditingBudget(null);
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || {
      id: categoryId,
      name: 'Unknown',
      is_income: false,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Budgets</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={handleAddBudget}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Budget
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="mt-5 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingBudget ? 'Edit Budget' : 'Add Budget'}
          </h2>
          <BudgetForm
            categories={categories}
            onSubmit={handleSubmitBudget}
            onCancel={() => {
              setShowForm(false);
              setEditingBudget(null);
            }}
            initialData={editingBudget || undefined}
          />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.length > 0 ? (
            budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                category={getCategoryById(budget.category_id)}
                transactions={transactions}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              <p>No budgets found. Click "Add Budget" to create your first budget.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
