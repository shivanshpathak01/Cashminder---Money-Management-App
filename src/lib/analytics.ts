'use client';

import { Transaction, Category } from './types';

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  incomeChange: number;
  expenseChange: number;
  savingsChange: number;
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
  }[];
  categoryData: {
    category: string;
    amount: number;
    color: string;
  }[];
  insights: {
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
  }[];
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

export function getTimeRanges(): { [key: string]: TimeRange } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Last 7 days
  const last7Start = new Date(today);
  last7Start.setDate(today.getDate() - 6);
  
  // Last 30 days
  const last30Start = new Date(today);
  last30Start.setDate(today.getDate() - 29);
  
  // Last 3 months
  const last3MonthsStart = new Date(today);
  last3MonthsStart.setMonth(today.getMonth() - 3);
  last3MonthsStart.setDate(1);
  
  // Last 6 months
  const last6MonthsStart = new Date(today);
  last6MonthsStart.setMonth(today.getMonth() - 6);
  last6MonthsStart.setDate(1);
  
  // Year to date
  const yearToDateStart = new Date(today.getFullYear(), 0, 1);
  
  return {
    'last7days': {
      startDate: last7Start,
      endDate: today,
      label: 'Last 7 days'
    },
    'last30days': {
      startDate: last30Start,
      endDate: today,
      label: 'Last 30 days'
    },
    'last3months': {
      startDate: last3MonthsStart,
      endDate: today,
      label: 'Last 3 months'
    },
    'last6months': {
      startDate: last6MonthsStart,
      endDate: today,
      label: 'Last 6 months'
    },
    'yearToDate': {
      startDate: yearToDateStart,
      endDate: today,
      label: 'Year to date'
    }
  };
}

export function filterTransactionsByDateRange(transactions: Transaction[], startDate: Date, endDate: Date): Transaction[] {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
}

export function getPreviousPeriodTransactions(
  transactions: Transaction[], 
  currentStartDate: Date, 
  currentEndDate: Date
): Transaction[] {
  const periodLength = currentEndDate.getTime() - currentStartDate.getTime();
  const previousStartDate = new Date(currentStartDate.getTime() - periodLength);
  const previousEndDate = new Date(currentEndDate.getTime() - periodLength);
  
  return filterTransactionsByDateRange(transactions, previousStartDate, previousEndDate);
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getMonthlyData(transactions: Transaction[], months = 6): { month: string; income: number; expenses: number }[] {
  const result: { month: string; income: number; expenses: number }[] = [];
  const now = new Date();
  
  // Initialize with zero values for the last 'months' months
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      month: monthDate.toLocaleString('default', { month: 'short' }),
      income: 0,
      expenses: 0
    });
  }
  
  // Fill in actual data
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    const monthDiff = (now.getFullYear() - transactionDate.getFullYear()) * 12 + now.getMonth() - transactionDate.getMonth();
    
    if (monthDiff >= 0 && monthDiff < months) {
      const index = months - 1 - monthDiff;
      if (transaction.is_income) {
        result[index].income += transaction.amount;
      } else {
        result[index].expenses += transaction.amount;
      }
    }
  });
  
  return result;
}

export function getCategoryData(transactions: Transaction[], categories: Category[]): { category: string; amount: number; color: string }[] {
  // Filter to only expense transactions
  const expenseTransactions = transactions.filter(t => !t.is_income);
  
  // Group by category and sum amounts
  const categoryAmounts: { [key: string]: number } = {};
  expenseTransactions.forEach(transaction => {
    if (!categoryAmounts[transaction.category_id]) {
      categoryAmounts[transaction.category_id] = 0;
    }
    categoryAmounts[transaction.category_id] += transaction.amount;
  });
  
  // Convert to required format
  const result = Object.entries(categoryAmounts).map(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      category: category ? category.name : 'Unknown',
      amount,
      color: category?.color || '#6366f1'
    };
  });
  
  // Sort by amount (descending)
  return result.sort((a, b) => b.amount - a.amount);
}

export function generateInsights(
  currentPeriodData: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    categoryData: { category: string; amount: number; color: string }[];
  },
  previousPeriodData: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    categoryData: { category: string; amount: number; color: string }[];
  }
): { title: string; description: string; type: 'positive' | 'negative' | 'neutral' }[] {
  const insights: { title: string; description: string; type: 'positive' | 'negative' | 'neutral' }[] = [];
  
  // Savings rate insight
  const savingsRate = currentPeriodData.totalIncome > 0 
    ? (currentPeriodData.netSavings / currentPeriodData.totalIncome) * 100 
    : 0;
  
  if (savingsRate > 20) {
    insights.push({
      title: `You saved ${savingsRate.toFixed(0)}% of your income this period`,
      description: 'Great job! You\'re saving a significant portion of your income.',
      type: 'positive'
    });
  } else if (savingsRate > 0) {
    insights.push({
      title: `You saved ${savingsRate.toFixed(0)}% of your income this period`,
      description: 'Consider setting a goal to save at least 20% of your income.',
      type: 'neutral'
    });
  } else if (currentPeriodData.totalIncome > 0) {
    insights.push({
      title: 'Your expenses exceeded your income this period',
      description: 'Try to reduce expenses or increase income to avoid depleting your savings.',
      type: 'negative'
    });
  }
  
  // Category spending insights
  if (currentPeriodData.categoryData.length > 0 && previousPeriodData.categoryData.length > 0) {
    // Find the category with the biggest increase
    const currentCategoryMap = new Map(
      currentPeriodData.categoryData.map(item => [item.category, item.amount])
    );
    
    const previousCategoryMap = new Map(
      previousPeriodData.categoryData.map(item => [item.category, item.amount])
    );
    
    let biggestIncrease = { category: '', change: 0, percentage: 0 };
    
    currentPeriodData.categoryData.forEach(({ category, amount }) => {
      const previousAmount = previousCategoryMap.get(category) || 0;
      if (previousAmount > 0) {
        const change = amount - previousAmount;
        const percentage = (change / previousAmount) * 100;
        
        if (percentage > 15 && change > biggestIncrease.change) {
          biggestIncrease = { category, change, percentage };
        }
      }
    });
    
    if (biggestIncrease.category) {
      insights.push({
        title: `Spending in ${biggestIncrease.category} increased by ${biggestIncrease.percentage.toFixed(0)}%`,
        description: `Your spending on ${biggestIncrease.category} has increased compared to last period. Consider reviewing these expenses.`,
        type: 'negative'
      });
    }
    
    // Top spending category
    if (currentPeriodData.categoryData.length > 0) {
      const topCategory = currentPeriodData.categoryData[0];
      const topCategoryPercentage = (topCategory.amount / currentPeriodData.totalExpenses) * 100;
      
      insights.push({
        title: `${topCategory.category} is your top spending category (${topCategoryPercentage.toFixed(0)}%)`,
        description: `You spent $${topCategory.amount.toFixed(2)} on ${topCategory.category} this period.`,
        type: 'neutral'
      });
    }
  }
  
  // Income trend insight
  const incomeChange = calculatePercentageChange(
    currentPeriodData.totalIncome, 
    previousPeriodData.totalIncome
  );
  
  if (Math.abs(incomeChange) > 10) {
    insights.push({
      title: `Your income ${incomeChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(incomeChange).toFixed(0)}%`,
      description: incomeChange > 0 
        ? 'Great job increasing your income! Consider allocating some of this increase to savings.'
        : 'Your income has decreased. You might need to adjust your budget accordingly.',
      type: incomeChange > 0 ? 'positive' : 'negative'
    });
  }
  
  return insights;
}

export function calculateAnalytics(
  transactions: Transaction[], 
  categories: Category[],
  timeRange: TimeRange
): AnalyticsSummary {
  // Filter transactions by date range
  const currentPeriodTransactions = filterTransactionsByDateRange(
    transactions,
    timeRange.startDate,
    timeRange.endDate
  );
  
  // Get previous period transactions
  const previousPeriodTransactions = getPreviousPeriodTransactions(
    transactions,
    timeRange.startDate,
    timeRange.endDate
  );
  
  // Calculate current period totals
  const currentIncome = currentPeriodTransactions
    .filter(t => t.is_income)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const currentExpenses = currentPeriodTransactions
    .filter(t => !t.is_income)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const currentNetSavings = currentIncome - currentExpenses;
  
  // Calculate previous period totals
  const previousIncome = previousPeriodTransactions
    .filter(t => t.is_income)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const previousExpenses = previousPeriodTransactions
    .filter(t => !t.is_income)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const previousNetSavings = previousIncome - previousExpenses;
  
  // Calculate percentage changes
  const incomeChange = calculatePercentageChange(currentIncome, previousIncome);
  const expenseChange = calculatePercentageChange(currentExpenses, previousExpenses);
  const savingsChange = calculatePercentageChange(currentNetSavings, previousNetSavings);
  
  // Get monthly data
  const monthlyData = getMonthlyData(transactions);
  
  // Get category data
  const categoryData = getCategoryData(currentPeriodTransactions, categories);
  
  // Generate insights
  const insights = generateInsights(
    {
      totalIncome: currentIncome,
      totalExpenses: currentExpenses,
      netSavings: currentNetSavings,
      categoryData
    },
    {
      totalIncome: previousIncome,
      totalExpenses: previousExpenses,
      netSavings: previousNetSavings,
      categoryData: getCategoryData(previousPeriodTransactions, categories)
    }
  );
  
  return {
    totalIncome: currentIncome,
    totalExpenses: currentExpenses,
    netSavings: currentNetSavings,
    incomeChange,
    expenseChange,
    savingsChange,
    monthlyData,
    categoryData,
    insights
  };
}
