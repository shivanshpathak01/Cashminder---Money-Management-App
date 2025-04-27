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
import { listenEvent } from '@/lib/eventBus';

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
      console.log('Fetching dashboard data for user:', userId);

      // Load transactions from localStorage
      const storedTransactions = localStorage.getItem(`cashminder_transactions_${userId}`);
      let userTransactions: Transaction[] = [];

      if (storedTransactions) {
        userTransactions = JSON.parse(storedTransactions);
        console.log('Loaded transactions from localStorage:', userTransactions.length);
        setTransactions(userTransactions);
      } else {
        console.log('No transactions found in localStorage');
        setTransactions([]);
      }

      // Calculate dashboard data from transactions
      const income = userTransactions
        .filter(t => t.is_income)
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = userTransactions
        .filter(t => !t.is_income)
        .reduce((sum, t) => sum + t.amount, 0);

      const totalBalance = income - expenses;

      // Set dashboard data
      setDashboardData({
        totalBalance,
        income,
        expenses,
        savingsGoal: 5000 // Default savings goal
      });

      console.log('Dashboard data calculated:', { totalBalance, income, expenses });

    } catch (error) {
      console.error('Error in dashboard data fetching process:', error);
      // Initialize with empty data
      setTransactions([]);
      setDashboardData({
        totalBalance: 0,
        income: 0,
        expenses: 0,
        savingsGoal: 5000
      });
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

  // Listen for transaction changes
  useEffect(() => {
    // Get user ID
    const userJson = localStorage.getItem('cashminder_user');
    if (!userJson) return;

    const userData = JSON.parse(userJson);
    const userId = userData.id || 'default';

    // Set up event listeners for all transaction events
    const removeCreatedListener = listenEvent('transaction_created', (data) => {
      if (data.userId === userId) {
        console.log('Dashboard detected new transaction:', data);
        fetchDashboardData(userId);
      }
    });

    const removeUpdatedListener = listenEvent('transaction_updated', (data) => {
      if (data.userId === userId) {
        console.log('Dashboard detected updated transaction:', data);
        fetchDashboardData(userId);
      }
    });

    const removeDeletedListener = listenEvent('transaction_deleted', (data) => {
      if (data.userId === userId) {
        console.log('Dashboard detected deleted transaction:', data);
        fetchDashboardData(userId);
      }
    });

    const removeChangedListener = listenEvent('transactions_changed', (data) => {
      if (data.userId === userId) {
        console.log('Dashboard detected transactions changed');
        fetchDashboardData(userId);
      }
    });

    // Clean up event listeners on unmount
    return () => {
      removeCreatedListener();
      removeUpdatedListener();
      removeDeletedListener();
      removeChangedListener();
    };
  }, []);

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
        <div className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading dashboard...
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
      className="container mx-auto px-4 py-8 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="pb-5 border-b border-light-border dark:border-dark-border mb-8"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold leading-tight text-light-text-primary dark:text-dark-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
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
