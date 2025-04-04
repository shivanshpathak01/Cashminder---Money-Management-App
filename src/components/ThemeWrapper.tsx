'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { ReactNode } from 'react';

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  // We've moved all the theme detection logic to ThemeProvider
  // to avoid hydration mismatches
  return <ThemeProvider>{children}</ThemeProvider>;
}
