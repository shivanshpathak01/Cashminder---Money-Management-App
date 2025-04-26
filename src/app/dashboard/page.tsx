'use client';

import DashboardSummary from '@/components/dashboard/DashboardSummary';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import TransactionsManager from '@/components/dashboard/TransactionsManager';
import { useEffect, useState } from 'react';
import { Category, Transaction } from '@/lib/types';
import { generateRandomColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Default categories for new users
const defaultCategories: Category[] = [
  { id: '1', name: 'Housing', color: '#4F46E5', is_income: false, is_default: true },
  { id: '2', name: 'Food', color: '#10B981', is_income: false, is_default: true },
  { id: '3', name: 'Transportation', color: '#F59E0B', is_income: false, is_default: true },
  { id: '4', name: 'Entertainment', color: '#EC4899', is_income: false, is_default: true },
  { id: '5', name: 'Utilities', color: '#6366F1', is_income: false, is_default: true },
  { id: '6', name: 'Salary', color: '#34D399', is_income: true, is_default: true },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savingsGoal: {
      current: 0,
      target: 10000,
      percentage: 0
    }
  });

  const fetchDashboardData = async (userId: string) => {
    try {
      setIsLoading(true);

      // Try to fetch from the real API first
      try {
        const response = await fetch(`/api/dashboard?userId=${userId}`);

        if (response.ok) {
          const data = await response.json();

          if (data.success) {
            setDashboardData({
              totalBalance: data.data.totalBalance,
              income: data.data.income,
              expenses: data.data.expenses,
              savingsGoal: data.data.savingsGoal
            });

            // Set transactions from API response
            if (data.data.recentTransactions && data.data.recentTransactions.length > 0) {
              // Convert MongoDB transactions to our Transaction type
              const formattedTransactions = data.data.recentTransactions.map((t: any) => ({
                id: t._id || `temp-${Math.random().toString(36).substring(2, 9)}`,
                user_id: t.userId,
                amount: t.amount,
                description: t.description,
                category_id: t.category,
                date: t.date,
                is_income: t.type === 'income',
                created_at: t.createdAt || t.date
              }));

              setTransactions(formattedTransactions);
              setIsLoading(false);
              return; // Successfully fetched data, exit the function
            } else {
              // No transactions yet
              setTransactions([]);
              setIsLoading(false);
              return; // Successfully fetched data, exit the function
            }
          }
        }

        // If we get here, the main API call failed, so we'll try the mock API
        throw new Error('Main API failed, trying mock API');

      } catch (mainApiError) {
        console.log('Falling back to mock API:', mainApiError);

        // Try the mock API as fallback
        const mockResponse = await fetch(`/api/mock-dashboard?userId=${userId}`);

        if (mockResponse.ok) {
          const mockData = await mockResponse.json();

          if (mockData.success) {
            setDashboardData({
              totalBalance: mockData.data.totalBalance,
              income: mockData.data.income,
              expenses: mockData.data.expenses,
              savingsGoal: mockData.data.savingsGoal
            });

            // Initialize with empty transactions for mock data
            setTransactions([]);
            console.log('Using mock dashboard data');
          } else {
            console.error('Failed to fetch mock dashboard data:', mockData.error);
            setTransactions([]);
          }
        } else {
          console.error('Failed to fetch from mock API');
          setTransactions([]);
        }
      }
    } catch (error) {
      console.error('Error in dashboard data fetching process:', error);
      // Initialize with empty data
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle transaction added event
  const handleTransactionAdded = () => {
    // Refresh dashboard data
    const userJson = localStorage.getItem('cashminder_user');
    if (userJson) {
      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';
      fetchDashboardData(userId);
    }
  };

  useEffect(() => {
    // Check if user is logged in using localStorage
    const userJson = localStorage.getItem('cashminder_user');

    if (!userJson) {
      router.push('/auth');
      return;
    }

    try {
      // Parse user data
      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';

      // Fetch dashboard data
      fetchDashboardData(userId);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoading(false);
      setTransactions([]);
    }
  }, [router]);

  // Calculate summary data for current period (this month)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentPeriodTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth &&
           transactionDate.getFullYear() === currentYear;
  });

  const previousPeriodTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return transactionDate.getMonth() === previousMonth &&
           transactionDate.getFullYear() === previousYear;
  });

  // Current period totals
  const totalIncome = currentPeriodTransactions
    .filter(t => t.is_income)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentPeriodTransactions
    .filter(t => !t.is_income)
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  // Previous period totals for comparison
  const previousIncome = previousPeriodTransactions
    .filter(t => t.is_income)
    .reduce((sum, t) => sum + t.amount, 0);

  const previousExpenses = previousPeriodTransactions
    .filter(t => !t.is_income)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate expense breakdown by category
  const expensesByCategory = categories
    .filter(c => !c.is_income)
    .map(category => {
      const amount = transactions
        .filter(t => t.category_id === category.id && !t.is_income)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category,
        amount,
      };
    })
    .filter(item => item.amount > 0);

  // Calculate budget progress
  const budgets = categories
    .filter(c => !c.is_income)
    .map(category => {
      const spent = transactions
        .filter(t => t.category_id === category.id && !t.is_income)
        .reduce((sum, t) => sum + t.amount, 0);

      // Mock budget amounts
      const budgetAmount = category.id === '1' ? 1000 :
                          category.id === '2' ? 300 :
                          category.id === '3' ? 200 :
                          category.id === '4' ? 100 :
                          category.id === '5' ? 150 : 100;

      return {
        category,
        budgeted: budgetAmount,
        spent,
        remaining: Math.max(0, budgetAmount - spent),
      };
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500 dark:text-gray-300">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="pb-5 border-b border-gray-200 dark:border-gray-700"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
          {transactions.length > 0
            ? 'Welcome back! Here\'s an overview of your finances.'
            : 'Welcome to Cashminder! Start by adding transactions to see your financial overview.'}
        </p>
      </motion.div>

      <DashboardSummary
        totalIncome={dashboardData.income}
        totalExpenses={dashboardData.expenses}
        netSavings={dashboardData.totalBalance}
        previousIncome={0}
        previousExpenses={0}
      />

      <motion.div
        className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-2"
        variants={itemVariants}
      >
        <ExpenseChart categories={expensesByCategory} />
        <IncomeExpenseChart transactions={transactions} />
      </motion.div>

      <motion.div
        className="mt-5"
        variants={itemVariants}
      >
        <BudgetProgress budgets={budgets} />
      </motion.div>

      <motion.div
        className="mt-5"
        variants={itemVariants}
      >
        <TransactionsManager
          transactions={transactions}
          categories={categories}
          onTransactionAdded={handleTransactionAdded}
        />
      </motion.div>
    </motion.div>
  );
}
