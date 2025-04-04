'use client';

import { Budget, Category, Transaction } from '@/lib/types';
import { calculatePercentage, formatCurrency, formatDate } from '@/lib/utils';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface BudgetCardProps {
  budget: Budget;
  category: Category;
  transactions: Transaction[];
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
}

export default function BudgetCard({
  budget,
  category,
  transactions,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  // Calculate spent amount for this budget's category
  const spent = transactions
    .filter(
      (t) =>
        t.category_id === budget.category_id &&
        !t.is_income &&
        new Date(t.date) >= new Date(budget.start_date) &&
        (!budget.end_date || new Date(t.date) <= new Date(budget.end_date))
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = Math.max(0, budget.amount - spent);
  const percentage = calculatePercentage(spent, budget.amount);

  let statusColor = 'bg-green-500';
  if (percentage >= 90) {
    statusColor = 'bg-red-500';
  } else if (percentage >= 75) {
    statusColor = 'bg-yellow-500';
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{category.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(budget)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500"
            >
              <FiEdit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(budget.id)}
              className="p-1 rounded-full text-gray-400 hover:text-red-500"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-1 text-sm text-gray-500">
          {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} budget
        </div>
        
        <div className="mt-4 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(budget.amount)}
          </p>
          <p className="ml-2 text-sm text-gray-500">budget</p>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              {formatCurrency(spent)} spent
            </span>
            <span className="text-sm font-medium text-gray-500">
              {formatCurrency(remaining)} remaining
            </span>
          </div>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${statusColor}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {percentage}% of budget used
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <div>
            From: {formatDate(budget.start_date)}
          </div>
          {budget.end_date && (
            <div>
              To: {formatDate(budget.end_date)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
