import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

// Combine Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    return dateString;
  }
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Generate random color
export function generateRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA5A5', '#A5FFD6',
    '#FFC145', '#FF6B8B', '#845EC2', '#D65DB1', '#FF9671',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Truncate text
export function truncateText(text: string, maxLength: number = 25): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
