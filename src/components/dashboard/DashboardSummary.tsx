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
        className="overflow-hidden bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
        variants={itemVariants}
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-md">
              <FiArrowUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Income</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</div>
                  {previousIncome > 0 && (
                    <div className="flex items-center mt-1">
                      {incomeChange > 0 ? (
                        <>
                          <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
                          <span className="text-xs font-medium text-green-500">
                            +{incomeChange.toFixed(1)}% from previous period
                          </span>
                        </>
                      ) : incomeChange < 0 ? (
                        <>
                          <FiTrendingDown className="w-4 h-4 mr-1 text-red-500" />
                          <span className="text-xs font-medium text-red-500">
                            {incomeChange.toFixed(1)}% from previous period
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-gray-500">
                          No change from previous period
                        </span>
                      )}
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="overflow-hidden bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
        variants={itemVariants}
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-red-100 rounded-md">
              <FiArrowDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Expenses</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</div>
                  {previousExpenses > 0 && (
                    <div className="flex items-center mt-1">
                      {expenseChange > 0 ? (
                        <>
                          <FiTrendingUp className="w-4 h-4 mr-1 text-red-500" />
                          <span className="text-xs font-medium text-red-500">
                            +{expenseChange.toFixed(1)}% from previous period
                          </span>
                        </>
                      ) : expenseChange < 0 ? (
                        <>
                          <FiTrendingDown className="w-4 h-4 mr-1 text-green-500" />
                          <span className="text-xs font-medium text-green-500">
                            {expenseChange.toFixed(1)}% from previous period
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-gray-500">
                          No change from previous period
                        </span>
                      )}
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="overflow-hidden bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
        variants={itemVariants}
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-md">
              <FiDollarSign className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Net Savings</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">{formatCurrency(netSavings)}</div>
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Savings Rate</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{savingsRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full"
                        style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
                      />
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
