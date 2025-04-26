'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiFilter, FiDownload, FiTrash2, FiEdit, FiDollarSign, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { Transaction, Category } from '@/lib/types';
import AddTransactionForm from '../transactions/AddTransactionForm';

interface TransactionsManagerProps {
  transactions: Transaction[];
  categories: Category[];
  onTransactionAdded: () => void;
}

export default function TransactionsManager({ transactions, categories, onTransactionAdded }: TransactionsManagerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage
    const userJson = localStorage.getItem('cashminder_user');
    if (userJson) {
      const userData = JSON.parse(userJson);
      setUserId(userData.id || null);
    }

    // Apply filters
    if (filter === 'all') {
      setFilteredTransactions(transactions);
    } else if (filter === 'income') {
      setFilteredTransactions(transactions.filter(t => t.is_income));
    } else if (filter === 'expense') {
      setFilteredTransactions(transactions.filter(t => !t.is_income));
    }
  }, [transactions, filter]);

  const handleAddTransaction = async (transaction: {
    amount: number;
    description: string;
    category: string;
    date: string;
    type: 'income' | 'expense';
  }) => {
    if (!userId) {
      throw new Error('User not logged in');
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          date: transaction.date,
          type: transaction.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add transaction');
      }

      // Notify parent component to refresh data
      onTransactionAdded();
      
      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#CBD5E0';
  };

  return (
    <div className={`rounded-xl border ${
      isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50 border-gray-200'
    } backdrop-blur-sm overflow-hidden`}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Transactions
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
              {transactions.length > 0 
                ? `Showing ${filteredTransactions.length} of ${transactions.length} transactions` 
                : 'No transactions yet. Add your first one!'}
            </p>
          </div>
          
          <div className="flex mt-4 sm:mt-0 space-x-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <button
                className={`px-3 py-1.5 text-sm ${
                  filter === 'all'
                    ? isDark
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-800'
                    : isDark
                    ? 'bg-transparent text-gray-300 hover:bg-gray-800'
                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 text-sm flex items-center ${
                  filter === 'income'
                    ? isDark
                      ? 'bg-gray-800 text-green-400'
                      : 'bg-gray-100 text-green-600'
                    : isDark
                    ? 'bg-transparent text-gray-300 hover:bg-gray-800'
                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('income')}
              >
                <FiArrowUp className={`mr-1 ${filter === 'income' ? 'text-green-500' : ''}`} />
                Income
              </button>
              <button
                className={`px-3 py-1.5 text-sm flex items-center ${
                  filter === 'expense'
                    ? isDark
                      ? 'bg-gray-800 text-red-400'
                      : 'bg-gray-100 text-red-600'
                    : isDark
                    ? 'bg-transparent text-gray-300 hover:bg-gray-800'
                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('expense')}
              >
                <FiArrowDown className={`mr-1 ${filter === 'expense' ? 'text-red-500' : ''}`} />
                Expenses
              </button>
            </div>
            
            <motion.button
              className={`flex items-center px-3 py-1.5 rounded-lg ${
                isDark
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
            >
              <FiPlus className="mr-1" />
              <span className="text-sm">Add</span>
            </motion.button>
          </div>
        </div>
        
        {transactions.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <FiDollarSign className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">No transactions yet</p>
            <p className="text-sm mb-6">Start by adding your first transaction</p>
            <motion.button
              className={`flex items-center px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
            >
              <FiPlus className="mr-2" />
              <span>Add Transaction</span>
            </motion.button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <th className="pb-3 font-medium text-sm">Date</th>
                  <th className="pb-3 font-medium text-sm">Description</th>
                  <th className="pb-3 font-medium text-sm">Category</th>
                  <th className="pb-3 font-medium text-sm text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className={`py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatDate(transaction.date)}
                    </td>
                    <td className={`py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.description}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getCategoryColor(transaction.category_id) }}
                        ></div>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {getCategoryName(transaction.category_id)}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 text-right font-medium ${
                      transaction.is_income
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}>
                      {transaction.is_income ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {showAddForm && (
          <AddTransactionForm
            categories={categories}
            onAddTransaction={handleAddTransaction}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
