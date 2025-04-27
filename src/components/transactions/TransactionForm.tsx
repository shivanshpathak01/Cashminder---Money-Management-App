'use client';

import { Category, Transaction } from '@/lib/types';
import { useState } from 'react';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => boolean;
  onCancel: () => void;
  initialData?: Partial<Transaction>;
}

export default function TransactionForm({
  categories,
  onSubmit,
  onCancel,
  initialData,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [isIncome, setIsIncome] = useState(initialData?.is_income || false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check amount - must be a valid positive number
    if (!amount || amount.trim() === '') {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount))) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Check description - must not be empty
    if (!description || description.trim() === '') {
      newErrors.description = 'Description is required';
    }

    // Check category - must be selected
    if (!categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    // Check date - must be valid
    if (!date) {
      newErrors.date = 'Date is required';
    }

    // Set errors in state so they show up in the UI
    setErrors(newErrors);

    // Log validation results for debugging
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form validation:', { isValid, errors: newErrors, formData: { amount, description, categoryId, date } });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');

    // Clear previous errors
    setErrors({});

    // Validate the form
    if (!validateForm()) {
      console.log('Form validation failed, stopping submission');
      return; // Stop if validation fails
    }

    try {
      // Set submitting state to prevent multiple submissions
      setIsSubmitting(true);
      console.log('Form is valid, submitting data:', {
        amount: Number(amount),
        description,
        category_id: categoryId,
        date: new Date(date).toISOString(),
        is_income: isIncome,
      });

      // Submit the transaction data and get success status
      const success = onSubmit({
        amount: Number(amount),
        description,
        category_id: categoryId,
        date: new Date(date).toISOString(),
        is_income: isIncome,
      });

      console.log('Submission result:', success);

      // If submission failed, show error and stay on form
      if (!success) {
        console.log('Submission returned false, showing error');
        setErrors({ form: 'Failed to save transaction. Please try again.' });
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Error submitting transaction:', error);
      setErrors({ form: 'Failed to save transaction. Please try again.' });
      setIsSubmitting(false); // Reset submitting state on error
    }
  };

  const filteredCategories = categories.filter(
    (category) => category.is_income === isIncome
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Transaction Type</label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  id="expense"
                  name="transaction-type"
                  type="radio"
                  checked={!isIncome}
                  onChange={() => {
                    setIsIncome(false);
                    setCategoryId('');
                  }}
                  className="w-4 h-4 text-error-light dark:text-error-dark border-light-border dark:border-dark-border focus:ring-error-light dark:focus:ring-error-dark"
                />
                <label htmlFor="expense" className="ml-2 block text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Expense
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="income"
                  name="transaction-type"
                  type="radio"
                  checked={isIncome}
                  onChange={() => {
                    setIsIncome(true);
                    setCategoryId('');
                  }}
                  className="w-4 h-4 text-success-light dark:text-success-dark border-light-border dark:border-dark-border focus:ring-success-light dark:focus:ring-success-dark"
                />
                <label htmlFor="income" className="ml-2 block text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Income
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          Amount
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-light-text-secondary dark:text-dark-text-secondary sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full pl-7 pr-12 bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="0.00"
          />
        </div>
        {errors.amount && <p className="mt-2 text-sm text-error-light dark:text-error-dark">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          Description
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        {errors.description && <p className="mt-2 text-sm text-error-light dark:text-error-dark">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          Category
        </label>
        <div className="mt-1">
          <select
            id="category"
            name="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="block w-full bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="">Select a category</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {errors.categoryId && <p className="mt-2 text-sm text-error-light dark:text-error-dark">{errors.categoryId}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
          Date
        </label>
        <div className="mt-1">
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full bg-light-accent dark:bg-dark-accent border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        {errors.date && <p className="mt-2 text-sm text-error-light dark:text-error-dark">{errors.date}</p>}
      </div>

      {/* General form error message */}
      {errors.form && (
        <div className="p-3 rounded-md bg-error-light/10 dark:bg-error-dark/10 border border-error-light/20 dark:border-error-dark/20">
          <p className="text-sm text-error-light dark:text-error-dark">{errors.form}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary bg-light-accent dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-lg shadow-sm hover:bg-light-border dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-dark-bg bg-primary border border-transparent rounded-lg shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </form>
  );
}
