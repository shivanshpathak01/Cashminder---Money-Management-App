'use client';

import { useEffect, useState } from 'react';
import { Category, Transaction } from '@/lib/types';
import { useRouter } from 'next/navigation';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { emitEvent, listenEvent, refreshTransactions } from '@/lib/eventBus';

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

  // Load transactions from localStorage
  const loadTransactions = () => {
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
  };

  // Initial load
  useEffect(() => {
    loadTransactions();
  }, [router]);

  // Listen for transaction changes
  useEffect(() => {
    // Set up event listener for transaction changes
    const removeListener = listenEvent('transactions_changed', (data) => {
      // Reload transactions when they change
      loadTransactions();
    });

    // Clean up event listener on unmount
    return () => {
      removeListener();
    };
  }, []);

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

        // Find the transaction before removing it
        const transactionToDelete = transactions.find(t => t.id === transactionId);

        // Update transactions in state
        const updatedTransactions = transactions.filter((t) => t.id !== transactionId);
        setTransactions(updatedTransactions);

        // Save to localStorage
        localStorage.setItem(`cashminder_transactions_${userId}`, JSON.stringify(updatedTransactions));

        // Emit event to notify other components
        if (transactionToDelete) {
          emitEvent('transaction_deleted', {
            userId,
            transactionId,
            transaction: transactionToDelete
          });
        }

        // Also emit a general transactions_changed event
        refreshTransactions(userId);
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const handleSubmitTransaction = (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): boolean => {
    console.log('Parent component received transaction data:', transactionData);

    try {
      // Get the current user
      const userJson = localStorage.getItem('cashminder_user');
      if (!userJson) {
        console.error('No user found in localStorage');
        return false;
      }

      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';
      console.log('User ID:', userId);

      let updatedTransactions: Transaction[];
      let eventType: 'transaction_created' | 'transaction_updated';
      let affectedTransaction: Transaction;

      if (editingTransaction) {
        // Update existing transaction
        const updatedTransaction = {
          ...editingTransaction,
          ...transactionData
        };

        updatedTransactions = transactions.map((t) =>
          t.id === editingTransaction.id ? updatedTransaction : t
        );

        eventType = 'transaction_updated';
        affectedTransaction = updatedTransaction;
      } else {
        // Add new transaction
        const newTransaction: Transaction = {
          id: `transaction_${Date.now()}`,
          user_id: userId,
          created_at: new Date().toISOString(),
          ...transactionData,
        };
        updatedTransactions = [newTransaction, ...transactions];

        eventType = 'transaction_created';
        affectedTransaction = newTransaction;
      }

      // Update state
      setTransactions(updatedTransactions);

      // Save to localStorage
      localStorage.setItem(`cashminder_transactions_${userId}`, JSON.stringify(updatedTransactions));

      // Emit event to notify other components
      emitEvent(eventType, {
        userId,
        transactionId: affectedTransaction.id,
        transaction: affectedTransaction
      });

      // Also emit a general transactions_changed event
      refreshTransactions(userId);

      // Hide the form only after successful submission
      console.log('Transaction saved successfully, hiding form');
      setShowForm(false);
      setEditingTransaction(null);

      // Return success
      return true;
    } catch (error) {
      console.error('Error saving transaction:', error);
      // Return failure - don't hide the form
      console.log('Transaction save failed, keeping form visible');
      return false;
    }
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
        <div className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="pb-5 border-b border-light-border dark:border-dark-border sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold leading-tight text-light-text-primary dark:text-dark-text-primary">Transactions</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <div className="mr-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiFilter className="text-light-text-muted dark:text-dark-text-muted" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
                className="block w-full pl-10 pr-10 py-2 text-base bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg"
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddTransaction}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-dark-bg bg-primary hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="p-6 rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm">
          <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
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
        <div>
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
