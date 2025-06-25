'use client';

import { Category } from '@/lib/types';
import { calculatePercentage, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface BudgetProgressProps {
  budgets: {
    category: Category;
    budgeted: number;
    spent: number;
    remaining: number;
  }[];
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [sortBy, setSortBy] = useState<'name' | 'percentage' | 'remaining'>('percentage');

  // Sort budgets based on selected criteria
  const sortedBudgets = [...budgets].sort((a, b) => {
    if (sortBy === 'name') {
      return a.category.name.localeCompare(b.category.name);
    } else if (sortBy === 'percentage') {
      const percentageA = calculatePercentage(a.spent, a.budgeted);
      const percentageB = calculatePercentage(b.spent, b.budgeted);
      return percentageB - percentageA; // Descending order
    } else {
      return a.remaining - b.remaining; // Ascending order (least remaining first)
    }
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className={`p-6 rounded-xl border finance-card ${
        isDark
          ? 'bg-dark-card border-dark-border shadow-lg'
          : 'bg-light-card border-light-border shadow-sm'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -2,
        boxShadow: isDark ? "var(--glow-primary)" : "var(--hover-shadow)"
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-rajdhani font-semibold leading-6 letter-spacing-wide ${
          isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
        }`}>
          BUDGET PROGRESS
        </h3>
        <div className="flex space-x-1 text-xs">
          <span className={`mr-2 font-rajdhani ${
            isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
          }`}>
            Sort by:
          </span>
          <button
            onClick={() => setSortBy('name')}
            className={`px-2 py-1 rounded font-rajdhani font-medium transition-all duration-200 ${
              sortBy === 'name'
                ? isDark
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-primary/10 text-primary border border-primary/20'
                : isDark
                ? 'text-dark-text-secondary hover:bg-dark-accent hover:text-dark-text-primary'
                : 'text-light-text-secondary hover:bg-light-accent hover:text-light-text-primary'
            }`}
          >
            NAME
          </button>
          <button
            onClick={() => setSortBy('percentage')}
            className={`px-2 py-1 rounded font-rajdhani font-medium transition-all duration-200 ${
              sortBy === 'percentage'
                ? isDark
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-primary/10 text-primary border border-primary/20'
                : isDark
                ? 'text-dark-text-secondary hover:bg-dark-accent hover:text-dark-text-primary'
                : 'text-light-text-secondary hover:bg-light-accent hover:text-light-text-primary'
            }`}
          >
            % USED
          </button>
          <button
            onClick={() => setSortBy('remaining')}
            className={`px-2 py-1 rounded font-rajdhani font-medium transition-all duration-200 ${
              sortBy === 'remaining'
                ? isDark
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-primary/10 text-primary border border-primary/20'
                : isDark
                ? 'text-dark-text-secondary hover:bg-dark-accent hover:text-dark-text-primary'
                : 'text-light-text-secondary hover:bg-light-accent hover:text-light-text-primary'
            }`}
          >
            REMAINING
          </button>
        </div>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedBudgets.length > 0 ? (
          sortedBudgets.map((budget) => {
            const percentage = calculatePercentage(budget.spent, budget.budgeted);
            let barColor, textColor, bgColor;

            if (percentage >= 90) {
              barColor = 'bg-danger';
              textColor = isDark ? 'text-red-400' : 'text-red-600';
              bgColor = isDark ? 'bg-red-900/20 border-red-800/30' : 'bg-red-50 border-red-200';
            } else if (percentage >= 75) {
              barColor = 'bg-warning';
              textColor = isDark ? 'text-yellow-400' : 'text-yellow-600';
              bgColor = isDark ? 'bg-yellow-900/20 border-yellow-800/30' : 'bg-yellow-50 border-yellow-200';
            } else {
              barColor = 'bg-success';
              textColor = isDark ? 'text-green-400' : 'text-green-600';
              bgColor = isDark ? 'bg-green-900/20 border-green-800/30' : 'bg-green-50 border-green-200';
            }

            return (
              <motion.div
                key={budget.category.id}
                className={`p-4 border rounded-xl transition-all duration-200 ${bgColor} ${
                  isDark
                    ? 'hover:bg-dark-accent/50 hover:border-dark-border'
                    : 'hover:bg-light-accent hover:border-light-border'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: budget.category.color || '#4F46E5' }}
                    />
                    <span className={`text-sm font-rajdhani font-semibold letter-spacing-wide ${
                      isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                    }`}>
                      {budget.category.name.toUpperCase()}
                    </span>
                  </div>
                  <span className={`text-sm font-orbitron font-bold ${
                    isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                  }`}>
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.budgeted)}
                  </span>
                </div>

                <div className={`w-full h-3 rounded-full ${
                  isDark ? 'bg-dark-accent' : 'bg-light-accent'
                }`}>
                  <motion.div
                    className={`h-3 rounded-full ${barColor} shadow-sm`}
                    style={{ width: '0%' }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs font-rajdhani font-bold ${textColor} letter-spacing-wide`}>
                    {percentage}% USED
                  </span>
                  <span className={`text-xs font-orbitron font-medium ${
                    isDark ? 'text-dark-text-muted' : 'text-light-text-muted'
                  }`}>
                    {formatCurrency(budget.remaining)} remaining
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className={`py-12 text-center rounded-xl ${
            isDark
              ? 'bg-dark-accent/50 border border-dark-border'
              : 'bg-light-accent border border-light-border'
          }`}>
            <svg className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className={`font-rajdhani font-bold text-lg letter-spacing-wide ${
              isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
            }`}>
              NO BUDGETS SET UP YET
            </p>
            <p className={`text-sm mt-2 mb-6 font-rajdhani ${
              isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
            }`}>
              Create a budget to track your spending and achieve your financial goals
            </p>
            <motion.a
              href="/budgets"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-rajdhani font-semibold rounded-xl shadow-sm text-dark-bg bg-primary hover:bg-primary-hover transition-all duration-200 letter-spacing-wide"
              whileHover={{ scale: 1.05, boxShadow: "var(--glow-primary)" }}
              whileTap={{ scale: 0.95 }}
            >
              CREATE BUDGET
            </motion.a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
