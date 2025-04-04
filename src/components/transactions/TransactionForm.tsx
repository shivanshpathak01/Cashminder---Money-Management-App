'use client';

import { Category, Transaction } from '@/lib/types';
import { useState } from 'react';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => void;
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
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
      amount: Number(amount),
      description,
      category_id: categoryId,
      date: new Date(date).toISOString(),
      is_income: isIncome,
    });
  };

  const filteredCategories = categories.filter(
    (category) => category.is_income === isIncome
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <div className="flex items-center space-x-4">
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
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="expense" className="ml-2 block text-sm text-gray-700">
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
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="income" className="ml-2 block text-sm text-gray-700">
                  Income
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="0.00"
          />
        </div>
        {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <div className="mt-1">
          <select
            id="category"
            name="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {errors.categoryId && <p className="mt-2 text-sm text-red-600">{errors.categoryId}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <div className="mt-1">
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}
