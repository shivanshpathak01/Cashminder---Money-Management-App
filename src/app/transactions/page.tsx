'use client';

import { useEffect, useState } from 'react';
import { Category, Transaction } from '@/lib/types';
import { useRouter } from 'next/navigation';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import { FiPlus, FiFilter } from 'react-icons/fi';

// Mock data (same as in dashboard)
const mockCategories: Category[] = [
  { id: '1', name: 'Housing', color: '#4F46E5', is_income: false, is_default: true },
  { id: '2', name: 'Food', color: '#10B981', is_income: false, is_default: true },
  { id: '3', name: 'Transportation', color: '#F59E0B', is_income: false, is_default: true },
  { id: '4', name: 'Entertainment', color: '#EC4899', is_income: false, is_default: true },
  { id: '5', name: 'Utilities', color: '#6366F1', is_income: false, is_default: true },
  { id: '6', name: 'Salary', color: '#34D399', is_income: true, is_default: true },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    user_id: '1',
    amount: 2000,
    description: 'Salary',
    category_id: '6',
    date: new Date().toISOString(),
    is_income: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    amount: 800,
    description: 'Rent',
    category_id: '1',
    date: new Date().toISOString(),
    is_income: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '1',
    amount: 150,
    description: 'Groceries',
    category_id: '2',
    date: new Date().toISOString(),
    is_income: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: '1',
    amount: 50,
    description: 'Gas',
    category_id: '3',
    date: new Date().toISOString(),
    is_income: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    user_id: '1',
    amount: 30,
    description: 'Movie tickets',
    category_id: '4',
    date: new Date().toISOString(),
    is_income: false,
    created_at: new Date().toISOString(),
  },
];

export default function TransactionsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    // Check if user is logged in using localStorage
    const userJson = localStorage.getItem('cashminder_user');

    if (!userJson) {
      router.push('/auth/login');
      return;
    }

    try {
      // Parse user data
      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';
      const isNewUser = userData.isNewUser === true;

      // If this is a new user, show empty data
      if (isNewUser) {
        // For new users, initialize with empty data
        setTransactions([]);
      } else {
        // For returning users, try to load their data from localStorage
        const storedTransactions = localStorage.getItem(`cashminder_transactions_${userId}`);

        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
        // If no stored transactions, keep the empty array (don't use mock data)
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Don't use mock data for transactions, start with empty
      setTransactions([]);
    }

    setIsLoading(false);
  }, [router]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        // Get the current user
        const userJson = localStorage.getItem('cashminder_user');
        if (!userJson) return;

        const userData = JSON.parse(userJson);
        const userId = userData.id || 'default';

        // Update transactions in state
        const updatedTransactions = transactions.filter((t) => t.id !== transactionId);
        setTransactions(updatedTransactions);

        // Save to localStorage
        localStorage.setItem(`cashminder_transactions_${userId}`, JSON.stringify(updatedTransactions));
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const handleSubmitTransaction = (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      // Get the current user
      const userJson = localStorage.getItem('cashminder_user');
      if (!userJson) return;

      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';

      let updatedTransactions: Transaction[];

      if (editingTransaction) {
        // Update existing transaction
        updatedTransactions = transactions.map((t) =>
          t.id === editingTransaction.id
            ? { ...t, ...transactionData }
            : t
        );
      } else {
        // Add new transaction
        const newTransaction: Transaction = {
          id: `transaction_${Date.now()}`,
          user_id: userId,
          created_at: new Date().toISOString(),
          ...transactionData,
        };
        updatedTransactions = [newTransaction, ...transactions];
      }

      // Update state
      setTransactions(updatedTransactions);

      // Save to localStorage
      localStorage.setItem(`cashminder_transactions_${userId}`, JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }

    setShowForm(false);
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'income') return t.is_income;
    if (filter === 'expense') return !t.is_income;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Transactions</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <div className="mr-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddTransaction}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="mt-5 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <TransactionForm
            categories={categories}
            onSubmit={handleSubmitTransaction}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
            initialData={editingTransaction || undefined}
          />
        </div>
      ) : (
        <div className="mt-5">
          <TransactionList
            transactions={filteredTransactions}
            categories={categories}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      )}
    </div>
  );
}
