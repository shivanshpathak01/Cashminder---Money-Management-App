'use client';

import { Category } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, LinearScale, BarElement } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import { useState } from 'react';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, Title, LinearScale, BarElement);

interface ExpenseChartProps {
  categories: {
    category: Category;
    amount: number;
  }[];
}

export default function ExpenseChart({ categories }: ExpenseChartProps) {
  const [chartType, setChartType] = useState<'pie' | 'doughnut'>('doughnut');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate total expenses
  const totalExpenses = categories.reduce((sum, item) => sum + item.amount, 0);

  // Sort categories by amount (descending)
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);

  // Filter categories based on selection
  const displayCategories = selectedCategory
    ? sortedCategories.filter(item => item.category.id === selectedCategory)
    : sortedCategories;

  const data = {
    labels: displayCategories.map((item) => item.category.name),
    datasets: [
      {
        data: displayCategories.map((item) => item.amount),
        backgroundColor: displayCategories.map((item) => item.category.color || '#4F46E5'),
        borderColor: displayCategories.map(() => '#ffffff'),
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalExpenses) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13
        },
        displayColors: true,
        boxPadding: 5
      },
      title: {
        display: true,
        text: 'Expense Distribution',
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          bottom: 15
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    cutout: chartType === 'doughnut' ? '60%' : undefined,
  };

  const handleToggleChartType = () => {
    setChartType(chartType === 'pie' ? 'doughnut' : 'pie');
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <motion.div
      className="p-6 rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">Expense Breakdown</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleToggleChartType}
            className="px-3 py-1 text-xs font-medium rounded-md bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
          >
            {chartType === 'pie' ? 'Switch to Doughnut' : 'Switch to Pie'}
          </button>
        </div>
      </div>

      <div className="mt-4 h-72">
        {categories.length > 0 ? (
          <div className="relative h-full">
            {chartType === 'pie' ? (
              <Pie data={data} options={options} />
            ) : (
              <Doughnut data={data} options={options} />
            )}

            {chartType === 'doughnut' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Total</p>
                  <p className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary">
            <svg className="w-16 h-16 mb-4 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mb-2 font-medium text-light-text-primary dark:text-dark-text-primary">No expense data yet</p>
            <p className="text-sm text-center">Add transactions to see your expense breakdown</p>
            <a href="/transactions" className="mt-4 px-4 py-2 text-sm font-medium text-dark-bg bg-primary rounded-md hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
              Add Transaction
            </a>
          </div>
        )}
      </div>

      {categories.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Top Expenses</h4>
          <div className="space-y-2">
            {sortedCategories.slice(0, 3).map((item) => (
              <motion.div
                key={item.category.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  selectedCategory === item.category.id
                    ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30'
                    : 'hover:bg-light-accent dark:hover:bg-dark-accent border border-transparent'
                }`}
                onClick={() => handleCategoryClick(item.category.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.category.color || '#00C6FF' }}
                  />
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{item.category.name}</span>
                </div>
                <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{formatCurrency(item.amount)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
