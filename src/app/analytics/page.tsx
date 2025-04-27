'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { 
  FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar, 
  FiDollarSign, FiArrowUp, FiArrowDown 
} from 'react-icons/fi';

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('cashminder_user');
    if (!userData) {
      router.push('/auth');
      return;
    }
    
    setIsLoggedIn(true);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router]);

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

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', income: 3200, expenses: 2700 },
    { month: 'Feb', income: 3500, expenses: 2900 },
    { month: 'Mar', income: 3100, expenses: 3000 },
    { month: 'Apr', income: 4200, expenses: 3200 },
    { month: 'May', income: 3800, expenses: 3100 },
    { month: 'Jun', income: 4100, expenses: 3400 }
  ];

  const categoryData = [
    { category: 'Housing', amount: 1200, color: '#6366f1' },
    { category: 'Food', amount: 800, color: '#3b82f6' },
    { category: 'Transport', amount: 400, color: '#8b5cf6' },
    { category: 'Entertainment', amount: 300, color: '#ec4899' },
    { category: 'Utilities', amount: 250, color: '#10b981' },
    { category: 'Other', amount: 450, color: '#f59e0b' }
  ];

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
        {['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'Year to date', 'Custom'].map((period, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
              index === 2 
                ? `${isDark 
                    ? 'bg-primary-900/40 border border-primary-800/50 text-dark-text-primary' 
                    : 'bg-primary-50 border border-primary-100 text-primary-700'}`
                : `${isDark 
                    ? 'border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface' 
                    : 'border border-light-border text-light-text-secondary hover:text-light-text-primary hover:bg-light-border/50'}`
            }`}
          >
            {index === 5 && <FiCalendar className="w-4 h-4" />}
            <span>{period}</span>
          </button>
        ))}
      </motion.div>

      {/* Summary cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={itemVariants}
      >
        {[
          { title: 'Total Income', value: '$21,900', change: '+12%', icon: <FiArrowUp className="text-success-light dark:text-success-dark" />, trend: 'up' },
          { title: 'Total Expenses', value: '$18,300', change: '+8%', icon: <FiArrowDown className="text-error-light dark:text-error-dark" />, trend: 'up' },
          { title: 'Net Savings', value: '$3,600', change: '+32%', icon: <FiTrendingUp className="text-primary-500" />, trend: 'up' }
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
              <div className="p-2 rounded-full bg-opacity-10">
                {item.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
              {item.value}
            </div>
            <div className={`flex items-center text-sm ${
              item.trend === 'up' 
                ? (item.title === 'Total Expenses' 
                  ? 'text-error-light dark:text-error-dark' 
                  : 'text-success-light dark:text-success-dark')
                : 'text-warning-light dark:text-warning-dark'
            }`}>
              {item.trend === 'up' ? <FiTrendingUp className="mr-1" /> : <FiTrendingUp className="mr-1" />}
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
              {monthlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center w-1/6">
                  <div className="w-full flex justify-center space-x-1">
                    <motion.div 
                      className="w-5 bg-primary-500 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${data.income / 50}px` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                    <motion.div 
                      className="w-5 bg-secondary-500 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${data.expenses / 50}px` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                    />
                  </div>
                  <span className={`text-xs mt-2 ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
              <span className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
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
              {categoryData.map((category, index) => {
                const offset = index * 60;
                return (
                  <motion.div
                    key={index}
                    className="absolute w-32 h-32 rounded-full"
                    style={{
                      background: `conic-gradient(${category.color} 0deg, ${category.color} ${category.amount / 34}deg, transparent ${category.amount / 34}deg)`,
                      transform: `rotate(${offset}deg)`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                );
              })}
              <div className={`absolute text-lg font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                $3,400
              </div>
            </div>
            
            <div className="space-y-3">
              {categoryData.map((category, index) => (
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
                    ${category.amount}
                  </span>
                </motion.div>
              ))}
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
          {[
            { title: 'Spending in Food category increased by 15%', description: 'Your spending on Food has increased compared to last month. Consider reviewing your grocery expenses.', icon: <FiArrowUp className="text-error-light dark:text-error-dark" /> },
            { title: 'You saved 18% of your income this month', description: 'Great job! You\'re on track to meet your savings goal of 20% of income.', icon: <FiTrendingUp className="text-success-light dark:text-success-dark" /> },
            { title: 'Recurring subscriptions total $85/month', description: 'You have 5 active subscriptions. Review them to ensure you\'re using all services.', icon: <FiDollarSign className="text-primary-500" /> }
          ].map((insight, index) => (
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
                  {insight.icon}
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
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
