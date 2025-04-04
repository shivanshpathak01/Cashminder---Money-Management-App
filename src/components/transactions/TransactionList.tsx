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
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      {transactions.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <div className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {truncateText(transaction.description, 40)}
                      </p>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <p>
                            {getCategoryName(transaction.category_id)} • {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0">
                      <p
                        className={`text-sm font-medium ${
                          transaction.is_income ? 'text-green-600' : 'text-red-600'
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
                      className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-1 rounded-full text-gray-400 hover:text-red-500"
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
        <div className="py-12 text-center text-gray-500">
          <p>No transactions found</p>
        </div>
      )}
    </div>
  );
}
