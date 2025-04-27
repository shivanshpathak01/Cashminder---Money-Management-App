'use client';

import { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface IncomeExpenseChartProps {
  transactions: Transaction[];
}

type TimeFrame = 'week' | 'month' | 'year';

export default function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');

  // Group transactions by date according to the selected time frame
  const groupedData = groupTransactionsByTimeFrame(transactions, timeFrame);

  // Prepare data for the chart
  const labels = Object.keys(groupedData);
  const incomeData = labels.map(label => groupedData[label].income);
  const expenseData = labels.map(label => groupedData[label].expense);
  const netData = labels.map(label => groupedData[label].income - groupedData[label].expense);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(50, 255, 126, 0.7)',
        borderColor: 'rgb(50, 255, 126)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: expenseData.map(value => -value), // Negate for visual effect
        backgroundColor: 'rgba(255, 71, 87, 0.7)',
        borderColor: 'rgb(255, 71, 87)',
        borderWidth: 1,
      },
      {
        label: 'Net',
        data: netData,
        type: 'line' as const,
        borderColor: 'rgb(0, 198, 255)',
        backgroundColor: 'rgba(0, 198, 255, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(0, 198, 255)',
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1',
      }
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(Math.abs(Number(value)));
          }
        },
        grid: {
          borderDash: [2, 4],
        },
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(Number(value));
          }
        },
        grid: {
          display: false,
        },
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            let value = context.raw as number;

            // For expenses, we're displaying negative values as positive in the tooltip
            if (label === 'Expenses') {
              value = Math.abs(value);
            }

            return `${label}: ${formatCurrency(value)}`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13
        }
      },
      title: {
        display: true,
        text: 'Income vs. Expenses',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 15
        }
      }
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <motion.div
      className="p-6 rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">Income vs. Expenses</h3>
        <div className="flex space-x-1">
          {(['week', 'month', 'year'] as TimeFrame[]).map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeFrame === frame
                  ? 'bg-primary text-dark-bg dark:bg-primary'
                  : 'bg-light-accent text-light-text-secondary hover:bg-light-border dark:bg-dark-accent dark:text-dark-text-secondary dark:hover:bg-dark-border'
              }`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-72">
        {transactions.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary">
            <svg className="w-16 h-16 mb-4 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="mb-2 font-medium text-light-text-primary dark:text-dark-text-primary">No income or expense data yet</p>
            <p className="text-sm text-center">Add transactions to see your financial trends</p>
            <a href="/transactions" className="mt-4 px-4 py-2 text-sm font-medium text-dark-bg bg-primary rounded-md hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
              Add Transaction
            </a>
          </div>
        )}
      </div>

      {transactions.length > 0 ? (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-success-light/10 dark:bg-success-dark/10 p-3 rounded-lg border border-success-light/20 dark:border-success-dark/20">
            <p className="text-sm text-success-light dark:text-success-dark font-medium">Total Income</p>
            <p className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
              {formatCurrency(incomeData.reduce((sum, val) => sum + val, 0))}
            </p>
          </div>
          <div className="bg-error-light/10 dark:bg-error-dark/10 p-3 rounded-lg border border-error-light/20 dark:border-error-dark/20">
            <p className="text-sm text-error-light dark:text-error-dark font-medium">Total Expenses</p>
            <p className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
              {formatCurrency(expenseData.reduce((sum, val) => sum + val, 0))}
            </p>
          </div>
          <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg border border-primary/20 dark:border-primary/30">
            <p className="text-sm text-primary font-medium">Net Savings</p>
            <p className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
              {formatCurrency(netData.reduce((sum, val) => sum + val, 0))}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 border border-light-border dark:border-dark-border rounded-lg bg-light-accent dark:bg-dark-accent">
          <p className="text-center text-light-text-secondary dark:text-dark-text-secondary text-sm">
            Add income and expense transactions to see your financial summary
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Helper function to group transactions by time frame
function groupTransactionsByTimeFrame(transactions: Transaction[], timeFrame: TimeFrame) {
  const result: Record<string, { income: number; expense: number }> = {};

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group by the selected time frame
  sortedTransactions.forEach(transaction => {
    const date = new Date(transaction.date);
    let key: string;

    if (timeFrame === 'week') {
      // Get the week number and year
      const weekNumber = getWeekNumber(date);
      key = `Week ${weekNumber}`;
    } else if (timeFrame === 'month') {
      // Format as "Jan 2023"
      key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      // Format as "2023"
      key = date.getFullYear().toString();
    }

    if (!result[key]) {
      result[key] = { income: 0, expense: 0 };
    }

    if (transaction.is_income) {
      result[key].income += transaction.amount;
    } else {
      result[key].expense += transaction.amount;
    }
  });

  return result;
}

// Helper function to get the week number
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
