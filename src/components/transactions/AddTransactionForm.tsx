'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiCalendar, FiFileText, FiTag, FiArrowUp, FiArrowDown, FiX, FiCheck } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { Category } from '@/lib/types';

interface AddTransactionFormProps {
  categories: Category[];
  onAddTransaction: (transaction: {
    amount: number;
    description: string;
    category: string;
    date: string;
    type: 'income' | 'expense';
  }) => Promise<void>;
  onClose: () => void;
}

export default function AddTransactionForm({ categories, onAddTransaction, onClose }: AddTransactionFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await onAddTransaction({
        amount: Number(amount),
        description,
        category,
        date,
        type
      });
      
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setType('expense');
      
      // Close the form
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    (type === 'income' && c.is_income) || (type === 'expense' && !c.is_income)
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`w-full max-w-md p-6 rounded-xl shadow-xl ${
          isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'
        }`}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add New Transaction
          </h2>
          <motion.button
            className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <FiX className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className={`p-3 mb-4 rounded-lg flex items-center space-x-2 ${
                isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-500'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FiX className="flex-shrink-0 w-5 h-5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg border ${
                type === 'expense'
                  ? isDark
                    ? 'bg-red-900/30 border-red-800 text-red-200'
                    : 'bg-red-50 border-red-200 text-red-600'
                  : isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-300'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('expense')}
            >
              <FiArrowDown className={`w-5 h-5 mr-2 ${type === 'expense' ? 'text-red-500' : ''}`} />
              <span>Expense</span>
            </motion.button>
            
            <motion.button
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg border ${
                type === 'income'
                  ? isDark
                    ? 'bg-green-900/30 border-green-800 text-green-200'
                    : 'bg-green-50 border-green-200 text-green-600'
                  : isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-300'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('income')}
            >
              <FiArrowUp className={`w-5 h-5 mr-2 ${type === 'income' ? 'text-green-500' : ''}`} />
              <span>Income</span>
            </motion.button>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Amount
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
                <FiDollarSign className="w-5 h-5" />
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
                <FiFileText className="w-5 h-5" />
              </div>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="What was this for?"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Category
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
                <FiTag className="w-5 h-5" />
              </div>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg appearance-none ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              >
                <option value="">Select a category</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Date
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
                <FiCalendar className="w-5 h-5" />
              </div>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-2">
            <motion.button
              type="button"
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              className={`px-4 py-2 rounded-lg bg-indigo-600 text-white ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <FiCheck className="mr-2" />
                  Save Transaction
                </div>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
