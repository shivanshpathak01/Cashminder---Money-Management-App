'use client';

import { useEffect, useState } from 'react';
import { SavingsGoal } from '@/lib/types';
import { useRouter } from 'next/navigation';
import GoalCard from '@/components/goals/GoalCard';
import GoalForm from '@/components/goals/GoalForm';
import { FiPlus } from 'react-icons/fi';

// Mock savings goals
const mockGoals: SavingsGoal[] = [
  {
    id: '1',
    user_id: '1',
    name: 'Emergency Fund',
    target_amount: 10000,
    current_amount: 5000,
    target_date: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    name: 'New Car',
    target_amount: 20000,
    current_amount: 2500,
    target_date: new Date(new Date().getFullYear() + 2, 0, 1).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: '1',
    name: 'Vacation',
    target_amount: 3000,
    current_amount: 1200,
    target_date: new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export default function GoalsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<SavingsGoal[]>(mockGoals);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  useEffect(() => {
    // Check if user is logged in using localStorage
    const userJson = localStorage.getItem('cashminder_user');

    if (!userJson) {
      router.push('/auth/login');
      return;
    }

    try {
      // Parse user data
      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';
      const isNewUser = userData.isNewUser === true;

      // If this is a new user, show empty data
      if (isNewUser) {
        // For new users, initialize with empty data
        setGoals([]);
      } else {
        // For returning users, try to load their data from localStorage
        const storedGoals = localStorage.getItem(`cashminder_goals_${userId}`);

        if (storedGoals) {
          setGoals(JSON.parse(storedGoals));
        } else {
          // Start with empty goals for new users
          setGoals([]);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Start with empty goals in case of error
      setGoals([]);
    }

    setIsLoading(false);
  }, [router]);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      try {
        // Get the current user
        const userJson = localStorage.getItem('cashminder_user');
        if (!userJson) return;

        const userData = JSON.parse(userJson);
        const userId = userData.id || 'default';

        // Update goals in state
        const updatedGoals = goals.filter((g) => g.id !== goalId);
        setGoals(updatedGoals);

        // Save to localStorage
        localStorage.setItem(`cashminder_goals_${userId}`, JSON.stringify(updatedGoals));
      } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Failed to delete goal. Please try again.');
      }
    }
  };

  const handleUpdateAmount = (goalId: string, newAmount: number) => {
    try {
      // Get the current user
      const userJson = localStorage.getItem('cashminder_user');
      if (!userJson) return;

      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';

      // Update goals in state
      const updatedGoals = goals.map((g) =>
        g.id === goalId
          ? { ...g, current_amount: newAmount }
          : g
      );
      setGoals(updatedGoals);

      // Save to localStorage
      localStorage.setItem(`cashminder_goals_${userId}`, JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error updating goal amount:', error);
      alert('Failed to update goal amount. Please try again.');
    }
  };

  const handleSubmitGoal = (goalData: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at'>) => {
    try {
      // Get the current user
      const userJson = localStorage.getItem('cashminder_user');
      if (!userJson) return;

      const userData = JSON.parse(userJson);
      const userId = userData.id || 'default';

      let updatedGoals: SavingsGoal[];

      if (editingGoal) {
        // Update existing goal
        updatedGoals = goals.map((g) =>
          g.id === editingGoal.id
            ? { ...g, ...goalData }
            : g
        );
      } else {
        // Add new goal
        const newGoal: SavingsGoal = {
          id: `goal_${Date.now()}`,
          user_id: userId,
          created_at: new Date().toISOString(),
          ...goalData,
        };
        updatedGoals = [...goals, newGoal];
      }

      // Update state
      setGoals(updatedGoals);

      // Save to localStorage
      localStorage.setItem(`cashminder_goals_${userId}`, JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Failed to save goal. Please try again.');
    }

    setShowForm(false);
    setEditingGoal(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading goals...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="pb-5 border-b border-light-border dark:border-dark-border sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold leading-tight text-light-text-primary dark:text-dark-text-primary">Savings Goals</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={handleAddGoal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-dark-bg bg-primary hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Goal
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="p-6 rounded-xl border bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border shadow-sm">
          <h2 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-4">
            {editingGoal ? 'Edit Savings Goal' : 'Add Savings Goal'}
          </h2>
          <GoalForm
            onSubmit={handleSubmitGoal}
            onCancel={() => {
              setShowForm(false);
              setEditingGoal(null);
            }}
            initialData={editingGoal || undefined}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onUpdateAmount={handleUpdateAmount}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-light-text-primary dark:text-dark-text-primary mb-2">No savings goals found</p>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">Click "Add Goal" to create your first savings goal.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
