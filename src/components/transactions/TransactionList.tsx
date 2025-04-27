'use client';

import { Category, Transaction } from '@/lib/types';
import { formatCurrency, formatDate, truncateText } from '@/lib/utils';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export default function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm">
      {transactions.length > 0 ? (
        <ul className="divide-y divide-light-border dark:divide-dark-border">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <div className="block hover:bg-light-accent dark:hover:bg-dark-accent transition-colors">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary truncate">
                        {truncateText(transaction.description, 40)}
                      </p>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          <p>
                            {getCategoryName(transaction.category_id)} • {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0">
                      <p
                        className={`text-sm font-medium ${
                          transaction.is_income ? 'text-success-light dark:text-success-dark' : 'text-error-light dark:text-error-dark'
                        }`}
                      >
                        {transaction.is_income ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-1 rounded-full text-light-text-muted dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-1 rounded-full text-light-text-muted dark:text-dark-text-muted hover:text-error-light dark:hover:text-error-dark transition-colors"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-12 text-center text-light-text-secondary dark:text-dark-text-secondary bg-light-accent dark:bg-dark-accent">
          <svg className="w-16 h-16 mx-auto mb-4 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p className="font-medium text-light-text-primary dark:text-dark-text-primary">No transactions found</p>
          <p className="text-sm mt-1">Add some transactions to see them here</p>
        </div>
      )}
    </div>
  );
}
