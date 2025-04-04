'use client';

import { SavingsGoal } from '@/lib/types';
import { calculatePercentage, formatCurrency, formatDate } from '@/lib/utils';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goalId: string) => void;
  onUpdateAmount: (goalId: string, newAmount: number) => void;
}

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onUpdateAmount,
}: GoalCardProps) {
  const percentage = calculatePercentage(goal.current_amount, goal.target_amount);
  const remaining = goal.target_amount - goal.current_amount;

  const handleAddFunds = () => {
    const amount = prompt('Enter amount to add:', '0');
    if (amount !== null) {
      const numAmount = Number(amount);
      if (!isNaN(numAmount) && numAmount > 0) {
        const newAmount = Math.min(goal.current_amount + numAmount, goal.target_amount);
        onUpdateAmount(goal.id, newAmount);
      }
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{goal.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(goal)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500"
            >
              <FiEdit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1 rounded-full text-gray-400 hover:text-red-500"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(goal.current_amount)}
          </p>
          <p className="ml-2 text-sm text-gray-500">
            of {formatCurrency(goal.target_amount)}
          </p>
        </div>
        
        <div className="mt-4">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {percentage}% complete • {formatCurrency(remaining)} to go
          </div>
        </div>
        
        {goal.target_date && (
          <div className="mt-4 text-sm text-gray-500">
            Target date: {formatDate(goal.target_date)}
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={handleAddFunds}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );
}
