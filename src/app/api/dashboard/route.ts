import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

// GET /api/dashboard?userId=123
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID format'
      }, { status: 400 });
    }

    // Get user data
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Get transactions for the user
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    // Calculate dashboard data
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    // Get savings goal data (in a real app, this would come from a separate model)
    const savingsGoal = {
      current: totalBalance > 0 ? totalBalance * 0.2 : 0, // Assume 20% of balance is saved
      target: 10000,
      percentage: 0
    };

    savingsGoal.percentage = Math.min(100, Math.round((savingsGoal.current / savingsGoal.target) * 100));

    // Return dashboard data
    return NextResponse.json({
      success: true,
      data: {
        totalBalance,
        income: totalIncome,
        expenses: totalExpenses,
        savingsGoal,
        recentTransactions: transactions.slice(0, 5) // Return only the 5 most recent transactions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
