'use client';

import { SavingsGoal } from '@/lib/types';
import { useState } from 'react';

interface GoalFormProps {
  onSubmit: (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at'>) => void;
  onCancel: () => void;
  initialData?: Partial<SavingsGoal>;
}

export default function GoalForm({
  onSubmit,
  onCancel,
  initialData,
}: GoalFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [targetAmount, setTargetAmount] = useState(initialData?.target_amount?.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(initialData?.current_amount?.toString() || '0');
  const [targetDate, setTargetDate] = useState(
    initialData?.target_date
      ? new Date(initialData.target_date).toISOString().split('T')[0]
      : ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      newErrors.targetAmount = 'Please enter a valid target amount greater than 0';
    }

    if (!currentAmount || isNaN(Number(currentAmount)) || Number(currentAmount) < 0) {
      newErrors.currentAmount = 'Please enter a valid current amount (0 or greater)';
    }

    if (Number(currentAmount) > Number(targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot be greater than target amount';
    }

    if (targetDate && new Date(targetDate) <= new Date()) {
      newErrors.targetDate = 'Target date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name,
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount),
      target_date: targetDate ? new Date(targetDate).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          Goal Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="e.g., Emergency Fund, New Car, Vacation"
          />
        </div>
        {errors.name && <p className="mt-2 text-sm text-error-light dark:text-error-dark">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="targetAmount" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          Target Amount
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-light-text-secondary dark:text-dark-text-secondary sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="targetAmount"
            id="targetAmount"
            step="0.01"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="block w-full pl-7 pr-12 bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="0.00"
          />
        </div>
        {errors.targetAmount && <p className="mt-2 text-sm text-error-light dark:text-error-dark">{errors.targetAmount}</p>}
      </div>

      <div>
        <label htmlFor="currentAmount" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          Current Amount
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-light-text-secondary dark:text-dark-text-secondary sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="currentAmount"
            id="currentAmount"
            step="0.01"
            min="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="block w-full pl-7 pr-12 bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="0.00"
          />
        </div>
        {errors.currentAmount && <p className="mt-2 text-sm text-error-light dark:text-error-dark">{errors.currentAmount}</p>}
      </div>

      <div>
        <label htmlFor="targetDate" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          Target Date (Optional)
        </label>
        <div className="mt-1">
          <input
            type="date"
            name="targetDate"
            id="targetDate"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="block w-full bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        {errors.targetDate && <p className="mt-2 text-sm text-error-light dark:text-error-dark">{errors.targetDate}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary bg-light-accent dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-lg shadow-sm hover:bg-light-border dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-dark-bg bg-primary border border-transparent rounded-lg shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
}
