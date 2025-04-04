'use client';

import { Category } from '@/lib/types';
import { calculatePercentage, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface BudgetProgressProps {
  budgets: {
    category: Category;
    budgeted: number;
    spent: number;
    remaining: number;
  }[];
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
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
      className="p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Budget Progress</h3>
        <div className="flex space-x-1 text-xs">
          <span className="text-gray-500 mr-2">Sort by:</span>
          <button
            onClick={() => setSortBy('name')}
            className={`px-2 py-1 rounded ${sortBy === 'name' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Name
          </button>
          <button
            onClick={() => setSortBy('percentage')}
            className={`px-2 py-1 rounded ${sortBy === 'percentage' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            % Used
          </button>
          <button
            onClick={() => setSortBy('remaining')}
            className={`px-2 py-1 rounded ${sortBy === 'remaining' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Remaining
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
            let barColor = 'bg-green-500';
            let textColor = 'text-green-700';

            if (percentage >= 90) {
              barColor = 'bg-red-500';
              textColor = 'text-red-700';
            } else if (percentage >= 75) {
              barColor = 'bg-yellow-500';
              textColor = 'text-yellow-700';
            }

            return (
              <motion.div
                key={budget.category.id}
                className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: budget.category.color || '#4F46E5' }}
                    />
                    <span className="text-sm font-medium text-gray-700">{budget.category.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.budgeted)}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-gray-100 rounded-full">
                  <motion.div
                    className={`h-2.5 rounded-full ${barColor}`}
                    style={{ width: '0%' }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium ${textColor}`}>{percentage}% used</span>
                  <span className="text-xs font-medium text-gray-600">
                    {formatCurrency(budget.remaining)} remaining
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="font-medium">No budgets set up yet</p>
            <p className="text-sm mt-1 mb-4">Create a budget to track your spending</p>
            <a href="/budgets" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Create Budget
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
