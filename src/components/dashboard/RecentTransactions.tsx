'use client';

import { Transaction } from '@/lib/types';
import { formatCurrency, formatDate, truncateText } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiArrowDown, FiArrowUp, FiFilter } from 'react-icons/fi';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter transactions based on selection
  const filteredTransactions = sortedTransactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction.is_income;
    return !transaction.is_income;
  });

  // Take only the 5 most recent transactions for the dashboard
  const recentTransactions = filteredTransactions.slice(0, 5);

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

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-lg shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Transactions</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <FiFilter className="text-gray-400 w-4 h-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="text-xs border-none focus:ring-0 py-0 pl-1 pr-6 font-medium text-gray-600 bg-transparent"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
          <Link
            href="/transactions"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100">
        <div className="overflow-x-auto">
          {recentTransactions.length > 0 ? (
            <motion.table
              className="min-w-full divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    className="hover:bg-gray-50"
                    variants={rowVariants}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        {transaction.is_income ? (
                          <FiArrowUp className="w-4 h-4 mr-2 text-green-500" />
                        ) : (
                          <FiArrowDown className="w-4 h-4 mr-2 text-red-500" />
                        )}
                        {truncateText(transaction.description, 30)}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium text-right whitespace-nowrap ${
                      transaction.is_income ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.is_income ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          ) : (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="font-medium">No {filter !== 'all' ? filter : ''} transactions yet</p>
              <p className="text-sm mt-1 mb-4">Add some transactions to see them here</p>
              <a href="/transactions" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add Transaction
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
