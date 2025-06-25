'use client';

import { formatCurrency, calculatePercentage } from '@/lib/utils';
import { FiArrowDown, FiArrowUp, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface DashboardSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  previousIncome?: number;
  previousExpenses?: number;
}

export default function DashboardSummary({
  totalIncome,
  totalExpenses,
  netSavings,
  previousIncome = 0,
  previousExpenses = 0,
}: DashboardSummaryProps) {
  // Calculate percentage changes
  const incomeChange = previousIncome > 0 ? ((totalIncome - previousIncome) / previousIncome) * 100 : 0;
  const expenseChange = previousExpenses > 0 ? ((totalExpenses - previousExpenses) / previousExpenses) * 100 : 0;

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

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
      className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="p-6 rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm finance-card"
        variants={itemVariants}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -3px rgba(50, 255, 126, 0.1), 0 4px 6px -2px rgba(50, 255, 126, 0.05)"
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-rajdhani font-semibold text-light-text-secondary dark:text-dark-text-secondary letter-spacing-wide">
            TOTAL INCOME
          </h3>
          <div className="p-2 rounded-full bg-success-light/10 dark:bg-success-dark/10">
            <FiArrowUp className="text-success-light dark:text-success-dark" />
          </div>
        </div>
        <div className="text-2xl font-orbitron font-bold mb-2 text-light-text-primary dark:text-dark-text-primary letter-spacing-wide">
          {formatCurrency(totalIncome)}
        </div>
        {previousIncome > 0 && (
          <div className="flex items-center text-sm">
            {incomeChange > 0 ? (
              <>
                <FiTrendingUp className="mr-1 text-success-light dark:text-success-dark" />
                <span className="text-success-light dark:text-success-dark">
                  +{incomeChange.toFixed(1)}% from previous period
                </span>
              </>
            ) : incomeChange < 0 ? (
              <>
                <FiTrendingDown className="mr-1 text-error-light dark:text-error-dark" />
                <span className="text-error-light dark:text-error-dark">
                  {incomeChange.toFixed(1)}% from previous period
                </span>
              </>
            ) : (
              <span className="text-light-text-muted dark:text-dark-text-muted">
                No change from previous period
              </span>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        className="p-6 rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm finance-card"
        variants={itemVariants}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -3px rgba(255, 77, 77, 0.1), 0 4px 6px -2px rgba(255, 77, 77, 0.05)"
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-rajdhani font-semibold text-light-text-secondary dark:text-dark-text-secondary letter-spacing-wide">
            TOTAL EXPENSES
          </h3>
          <div className="p-2 rounded-full bg-error-light/10 dark:bg-error-dark/10">
            <FiArrowDown className="text-error-light dark:text-error-dark" />
          </div>
        </div>
        <div className="text-2xl font-orbitron font-bold mb-2 text-light-text-primary dark:text-dark-text-primary letter-spacing-wide">
          {formatCurrency(totalExpenses)}
        </div>
        {previousExpenses > 0 && (
          <div className="flex items-center text-sm">
            {expenseChange > 0 ? (
              <>
                <FiTrendingUp className="mr-1 text-error-light dark:text-error-dark" />
                <span className="text-error-light dark:text-error-dark">
                  +{expenseChange.toFixed(1)}% from previous period
                </span>
              </>
            ) : expenseChange < 0 ? (
              <>
                <FiTrendingDown className="mr-1 text-success-light dark:text-success-dark" />
                <span className="text-success-light dark:text-success-dark">
                  {expenseChange.toFixed(1)}% from previous period
                </span>
              </>
            ) : (
              <span className="text-light-text-muted dark:text-dark-text-muted">
                No change from previous period
              </span>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        className="p-6 rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm finance-card"
        variants={itemVariants}
        whileHover={{
          y: -5,
          boxShadow: "var(--glow-primary)"
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-rajdhani font-semibold text-light-text-secondary dark:text-dark-text-secondary letter-spacing-wide">
            NET SAVINGS
          </h3>
          <div className="p-2 rounded-full bg-primary/10">
            <FiTrendingUp className="text-primary" />
          </div>
        </div>
        <div className="text-2xl font-orbitron font-bold mb-2 text-light-text-primary dark:text-dark-text-primary letter-spacing-wide">
          {formatCurrency(netSavings)}
        </div>
        <div className="mt-1">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">Savings Rate</span>
            <span className="font-medium text-primary">{savingsRate.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-light-accent dark:bg-dark-bg rounded-full">
            <div
              className="h-2 bg-blue-gradient rounded-full"
              style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
