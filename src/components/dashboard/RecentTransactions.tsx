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
      className="p-6 rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">Recent Transactions</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-light-accent dark:bg-dark-accent rounded-md px-2 py-1">
            <FiFilter className="text-light-text-muted dark:text-dark-text-muted w-4 h-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="text-xs border-none focus:ring-0 py-0 pl-1 pr-6 font-medium text-light-text-secondary dark:text-dark-text-secondary bg-transparent"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
          <Link
            href="/transactions"
            className="text-sm font-medium text-primary hover:text-primary-400"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-light-border dark:border-dark-border">
        <div className="overflow-x-auto">
          {recentTransactions.length > 0 ? (
            <motion.table
              className="min-w-full divide-y divide-light-border dark:divide-dark-border"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <thead className="bg-light-accent dark:bg-dark-accent">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-light-text-secondary dark:text-dark-text-secondary uppercase"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-light-text-secondary dark:text-dark-text-secondary uppercase"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-right text-light-text-secondary dark:text-dark-text-secondary uppercase"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-light-surface dark:bg-dark-surface divide-y divide-light-border dark:divide-dark-border">
                {recentTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    className="hover:bg-light-accent dark:hover:bg-dark-accent"
                    variants={rowVariants}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                  >
                    <td className="px-6 py-4 text-sm text-light-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-light-text-primary dark:text-dark-text-primary">
                      <div className="flex items-center">
                        {transaction.is_income ? (
                          <FiArrowUp className="w-4 h-4 mr-2 text-success-light dark:text-success-dark" />
                        ) : (
                          <FiArrowDown className="w-4 h-4 mr-2 text-error-light dark:text-error-dark" />
                        )}
                        {truncateText(transaction.description, 30)}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium text-right whitespace-nowrap ${
                      transaction.is_income ? 'text-success-light dark:text-success-dark' : 'text-error-light dark:text-error-dark'
                    }`}>
                      {transaction.is_income ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          ) : (
            <div className="py-12 text-center text-light-text-secondary dark:text-dark-text-secondary bg-light-accent dark:bg-dark-accent">
              <svg className="w-16 h-16 mx-auto mb-4 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="font-medium text-light-text-primary dark:text-dark-text-primary">No {filter !== 'all' ? filter : ''} transactions yet</p>
              <p className="text-sm mt-1 mb-4">Add some transactions to see them here</p>
              <a href="/transactions" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-dark-bg bg-primary hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Add Transaction
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
