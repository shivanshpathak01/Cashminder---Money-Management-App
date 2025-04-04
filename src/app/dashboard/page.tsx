'use client';

import DashboardSummary from '@/components/dashboard/DashboardSummary';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import { useEffect, useState } from 'react';
import { Category, Transaction } from '@/lib/types';
import { generateRandomColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Mock data for initial display
const mockCategories: Category[] = [
  { id: '1', name: 'Housing', color: '#4F46E5', is_income: false, is_default: true },
  { id: '2', name: 'Food', color: '#10B981', is_income: false, is_default: true },
  { id: '3', name: 'Transportation', color: '#F59E0B', is_income: false, is_default: true },
  { id: '4', name: 'Entertainment', color: '#EC4899', is_income: false, is_default: true },
  { id: '5', name: 'Utilities', color: '#6366F1', is_income: false, is_default: true },
  { id: '6', name: 'Salary', color: '#34D399', is_income: true, is_default: true },
];

// Helper function to create dates for the past few months
const getDateForMonthsAgo = (monthsAgo: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  return date.toISOString();
};

// Create more realistic transaction data spanning multiple months
const mockTransactions: Transaction[] = [
  // Current month
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
  // 1 month ago
  {
    id: '6',
    user_id: '1',
    amount: 1950,
    description: 'Salary',
    category_id: '6',
    date: getDateForMonthsAgo(1),
    is_income: true,
    created_at: getDateForMonthsAgo(1),
  },
  {
    id: '7',
    user_id: '1',
    amount: 800,
    description: 'Rent',
    category_id: '1',
    date: getDateForMonthsAgo(1),
    is_income: false,
    created_at: getDateForMonthsAgo(1),
  },
  {
    id: '8',
    user_id: '1',
    amount: 130,
    description: 'Groceries',
    category_id: '2',
    date: getDateForMonthsAgo(1),
    is_income: false,
    created_at: getDateForMonthsAgo(1),
  },
  // 2 months ago
  {
    id: '9',
    user_id: '1',
    amount: 1950,
    description: 'Salary',
    category_id: '6',
    date: getDateForMonthsAgo(2),
    is_income: true,
    created_at: getDateForMonthsAgo(2),
  },
  {
    id: '10',
    user_id: '1',
    amount: 800,
    description: 'Rent',
    category_id: '1',
    date: getDateForMonthsAgo(2),
    is_income: false,
    created_at: getDateForMonthsAgo(2),
  },
  {
    id: '11',
    user_id: '1',
    amount: 200,
    description: 'Utilities',
    category_id: '5',
    date: getDateForMonthsAgo(2),
    is_income: false,
    created_at: getDateForMonthsAgo(2),
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

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
        // For new users, initialize with empty data and default categories
        setTransactions([]);

        // Keep default categories for new users
        const defaultCategories = [
          { id: '1', name: 'Housing', color: '#4F46E5', is_income: false, is_default: true },
          { id: '2', name: 'Food', color: '#10B981', is_income: false, is_default: true },
          { id: '3', name: 'Transportation', color: '#F59E0B', is_income: false, is_default: true },
          { id: '4', name: 'Entertainment', color: '#EC4899', is_income: false, is_default: true },
          { id: '5', name: 'Utilities', color: '#6366F1', is_income: false, is_default: true },
          { id: '6', name: 'Salary', color: '#34D399', is_income: true, is_default: true },
        ];
        setCategories(defaultCategories);

        // After first load, mark user as not new anymore
        localStorage.setItem('cashminder_user', JSON.stringify({
          ...userData,
          isNewUser: false
        }));
      } else {
        // For returning users, try to load their data from localStorage
        const storedTransactions = localStorage.getItem(`cashminder_transactions_${userId}`);
        const storedCategories = localStorage.getItem(`cashminder_categories_${userId}`);

        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          // Fallback to mock data for returning users without stored data
          setTransactions(mockTransactions);
        }

        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to mock data in case of error
      setTransactions(mockTransactions);
    }

    setIsLoading(false);
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
        <div className="text-xl text-gray-500 dark:text-gray-400">
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
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {transactions.length > 0
            ? 'Welcome back! Here\'s an overview of your finances.'
            : 'Welcome to Cashminder! Start by adding transactions to see your financial overview.'}
        </p>
      </motion.div>

      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netSavings={netSavings}
        previousIncome={previousIncome}
        previousExpenses={previousExpenses}
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
        <RecentTransactions transactions={transactions} />
      </motion.div>
    </motion.div>
  );
}
