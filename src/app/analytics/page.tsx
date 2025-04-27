'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import {
  FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar,
  FiDollarSign, FiArrowUp, FiArrowDown
} from 'react-icons/fi';
import { Transaction, Category } from '@/lib/types';
import {
  calculateAnalytics,
  getTimeRanges,
  AnalyticsSummary,
  TimeRange
} from '@/lib/analytics';
import { listenEvent } from '@/lib/eventBus';

// Default categories (same as in transactions page)
const defaultCategories: Category[] = [
  { id: '1', name: 'Housing', color: '#4F46E5', is_income: false, is_default: true },
  { id: '2', name: 'Food', color: '#10B981', is_income: false, is_default: true },
  { id: '3', name: 'Transportation', color: '#F59E0B', is_income: false, is_default: true },
  { id: '4', name: 'Entertainment', color: '#EC4899', is_income: false, is_default: true },
  { id: '5', name: 'Utilities', color: '#6366F1', is_income: false, is_default: true },
  { id: '6', name: 'Salary', color: '#34D399', is_income: true, is_default: true },
];

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [timeRanges] = useState(getTimeRanges());
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('last3months');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Function to load transactions and categories
  const loadTransactionsAndCategories = () => {
    // Check if user is logged in
    const userJson = localStorage.getItem('cashminder_user');
    if (!userJson) {
      console.log('No user found in localStorage, redirecting to auth');
      router.push('/auth');
      return;
    }

    try {
      // Parse user data
      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';
      console.log('Loading transactions for user:', userId);

      // Load transactions from localStorage
      const storedTransactions = localStorage.getItem(`cashminder_transactions_${userId}`);
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions);
        console.log('Loaded transactions from localStorage:', parsedTransactions.length);
        setTransactions(parsedTransactions);
      } else {
        console.log('No transactions found in localStorage');
        setTransactions([]);
      }

      // Load categories from localStorage or use defaults
      const storedCategories = localStorage.getItem(`cashminder_categories_${userId}`);
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        console.log('Loaded categories from localStorage:', parsedCategories.length);
        setCategories(parsedCategories);
      } else {
        console.log('Using default categories');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTransactionsAndCategories();
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
        console.log('Analytics detected new transaction:', data);
        loadTransactionsAndCategories();
      }
    });

    const removeUpdatedListener = listenEvent('transaction_updated', (data) => {
      if (data.userId === userId) {
        console.log('Analytics detected updated transaction:', data);
        loadTransactionsAndCategories();
      }
    });

    const removeDeletedListener = listenEvent('transaction_deleted', (data) => {
      if (data.userId === userId) {
        console.log('Analytics detected deleted transaction:', data);
        loadTransactionsAndCategories();
      }
    });

    const removeChangedListener = listenEvent('transactions_changed', (data) => {
      if (data.userId === userId) {
        console.log('Analytics detected transactions changed');
        loadTransactionsAndCategories();
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

  // Calculate analytics when transactions, categories, or time range changes
  useEffect(() => {
    if (transactions.length === 0) {
      // If no transactions, set empty analytics
      setAnalytics({
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        incomeChange: 0,
        expenseChange: 0,
        savingsChange: 0,
        monthlyData: getLastSixMonths(),
        categoryData: [],
        insights: []
      });
      return;
    }

    const timeRange = timeRanges[selectedTimeRange];
    const analyticsData = calculateAnalytics(transactions, categories, timeRange);
    setAnalytics(analyticsData);
  }, [transactions, categories, selectedTimeRange, timeRanges]);

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

  // Helper function to get last six months with zero values
  function getLastSixMonths() {
    const result = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        income: 0,
        expenses: 0
      });
    }

    return result;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`text-xl ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-500 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-7xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="pb-5 border-b border-light-border dark:border-dark-border mb-8"
        variants={itemVariants}
      >
        <h1 className={`text-3xl font-bold leading-tight ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          Financial Analytics
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          Gain insights into your spending patterns and financial health
        </p>
      </motion.div>

      {/* Time period selector */}
      <motion.div
        className="flex flex-wrap gap-2 mb-8"
        variants={itemVariants}
      >
        {Object.entries(timeRanges).map(([key, range], index) => (
          <button
            key={key}
            onClick={() => setSelectedTimeRange(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
              key === selectedTimeRange
                ? `${isDark
                    ? 'bg-primary/30 border border-primary/50 text-dark-text-primary'
                    : 'bg-primary/10 border border-primary/20 text-primary'}`
                : `${isDark
                    ? 'border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface'
                    : 'border border-light-border text-light-text-secondary hover:text-light-text-primary hover:bg-light-border/50'}`
            }`}
          >
            <span>{range.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Summary cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={itemVariants}
      >
        {[
          {
            title: 'Total Income',
            value: analytics ? `$${analytics.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
            change: analytics ? `${analytics.incomeChange > 0 ? '+' : ''}${analytics.incomeChange.toFixed(1)}%` : '0%',
            icon: <FiArrowUp className="text-success-light dark:text-success-dark" />,
            trend: analytics && analytics.incomeChange > 0 ? 'up' : 'down',
            isExpense: false
          },
          {
            title: 'Total Expenses',
            value: analytics ? `$${analytics.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
            change: analytics ? `${analytics.expenseChange > 0 ? '+' : ''}${analytics.expenseChange.toFixed(1)}%` : '0%',
            icon: <FiArrowDown className="text-error-light dark:text-error-dark" />,
            trend: analytics && analytics.expenseChange > 0 ? 'up' : 'down',
            isExpense: true
          },
          {
            title: 'Net Savings',
            value: analytics ? `$${analytics.netSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
            change: analytics ? `${analytics.savingsChange > 0 ? '+' : ''}${analytics.savingsChange.toFixed(1)}%` : '0%',
            icon: <FiTrendingUp className="text-primary" />,
            trend: analytics && analytics.savingsChange > 0 ? 'up' : 'down',
            isExpense: false
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-xl border ${
              isDark
                ? 'bg-dark-surface border-dark-border'
                : 'bg-light-surface border-light-border shadow-sm'
            }`}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                {item.title}
              </h3>
              <div className={`p-2 rounded-full ${
                item.title === 'Total Income'
                  ? 'bg-success-light/10 dark:bg-success-dark/10'
                  : item.title === 'Total Expenses'
                    ? 'bg-error-light/10 dark:bg-error-dark/10'
                    : 'bg-primary/10 dark:bg-primary/20'
              }`}>
                {item.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
              {item.value}
            </div>
            <div className={`flex items-center text-sm ${
              item.trend === 'up'
                ? (item.isExpense
                  ? 'text-error-light dark:text-error-dark'
                  : 'text-success-light dark:text-success-dark')
                : item.trend === 'down'
                  ? (item.isExpense
                    ? 'text-success-light dark:text-success-dark'
                    : 'text-error-light dark:text-error-dark')
                  : 'text-light-text-muted dark:text-dark-text-muted'
            }`}>
              {item.trend === 'up'
                ? <FiTrendingUp className="mr-1" />
                : item.trend === 'down'
                  ? <FiArrowDown className="mr-1" />
                  : <FiTrendingUp className="mr-1" />
              }
              <span>{item.change} from previous period</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Income vs Expenses Chart */}
        <motion.div
          className={`p-6 rounded-xl border ${
            isDark
              ? 'bg-dark-surface border-dark-border'
              : 'bg-light-surface border-light-border shadow-sm'
          }`}
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
              Income vs Expenses
            </h3>
            <FiBarChart2 className={`w-5 h-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
          </div>

          {/* Chart placeholder - in a real app, use a chart library */}
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-full flex items-end justify-between">
              {analytics && analytics.monthlyData.map((data, index) => {
                // Calculate the maximum value for scaling
                const maxValue = analytics.monthlyData.reduce((max, item) => {
                  const itemMax = Math.max(item.income, item.expenses);
                  return itemMax > max ? itemMax : max;
                }, 1); // Minimum 1 to avoid division by zero

                // Scale factor - max height is 180px
                const scaleFactor = maxValue > 0 ? 180 / maxValue : 0;

                return (
                  <div key={index} className="flex flex-col items-center w-1/6">
                    <div className="w-full flex justify-center space-x-1">
                      <motion.div
                        className="w-5 bg-primary rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(data.income * scaleFactor, 0)}px` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                      <motion.div
                        className="w-5 bg-secondary rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(data.expenses * scaleFactor, 0)}px` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                      />
                    </div>
                    <span className={`text-xs mt-2 ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
              <span className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
              <span className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Expenses</span>
            </div>
          </div>
        </motion.div>

        {/* Expense Categories Chart */}
        <motion.div
          className={`p-6 rounded-xl border ${
            isDark
              ? 'bg-dark-surface border-dark-border'
              : 'bg-light-surface border-light-border shadow-sm'
          }`}
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
              Expense Breakdown
            </h3>
            <FiPieChart className={`w-5 h-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
          </div>

          {/* Chart placeholder - in a real app, use a chart library */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>

              {analytics && analytics.categoryData.length > 0 ? (
                <>
                  {analytics.categoryData.map((category, index) => {
                    // Calculate total expenses
                    const totalExpenses = analytics.categoryData.reduce((sum, cat) => sum + cat.amount, 0);

                    // Calculate degrees for this category (out of 360)
                    const degrees = totalExpenses > 0 ? (category.amount / totalExpenses) * 360 : 0;

                    // Calculate rotation offset based on previous categories
                    const previousCategories = analytics.categoryData.slice(0, index);
                    const previousDegrees = previousCategories.reduce((sum, cat) => {
                      return sum + (totalExpenses > 0 ? (cat.amount / totalExpenses) * 360 : 0);
                    }, 0);

                    return (
                      <motion.div
                        key={index}
                        className="absolute w-32 h-32 rounded-full"
                        style={{
                          background: `conic-gradient(${category.color} 0deg, ${category.color} ${degrees}deg, transparent ${degrees}deg)`,
                          transform: `rotate(${previousDegrees}deg)`
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    );
                  })}

                  <div className={`absolute text-lg font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                    ${analytics.totalExpenses.toFixed(0)}
                  </div>
                </>
              ) : (
                <div className={`absolute text-base ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  No expense data
                </div>
              )}
            </div>

            <div className="space-y-3">
              {analytics && analytics.categoryData.length > 0 ? (
                analytics.categoryData.map((category, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                      <span className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                        {category.category}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                      ${category.amount.toFixed(2)}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  Add expense transactions to see your spending breakdown
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights section */}
      <motion.div
        className={`p-6 rounded-xl border ${
          isDark
            ? 'bg-dark-surface border-dark-border'
            : 'bg-light-surface border-light-border shadow-sm'
        } mb-8`}
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
            Financial Insights
          </h3>
          <FiTrendingUp className={`w-5 h-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
        </div>

        <div className="space-y-4">
          {analytics && analytics.insights.length > 0 ? (
            analytics.insights.map((insight, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${
                  isDark
                    ? 'border-dark-border bg-dark-surface/50'
                    : 'border-light-border bg-light-border/10'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${
                    isDark ? 'bg-dark-border' : 'bg-light-border/50'
                  } mr-3 mt-1`}>
                    {insight.type === 'positive' ? (
                      <FiTrendingUp className="text-success-light dark:text-success-dark" />
                    ) : insight.type === 'negative' ? (
                      <FiArrowUp className="text-error-light dark:text-error-dark" />
                    ) : (
                      <FiDollarSign className="text-primary" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-base font-medium mb-1 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                      {insight.title}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={`p-8 text-center ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              <FiDollarSign className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No insights available yet</p>
              <p className="text-sm">Add more transactions to get personalized financial insights</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
