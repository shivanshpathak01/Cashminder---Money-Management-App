import { NextRequest, NextResponse } from 'next/server';

// GET /api/mock-dashboard?userId=123
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Generate mock data - using zeros as requested by the user
    const mockData = {
      totalBalance: 0,
      income: 0,
      expenses: 0,
      savingsGoal: {
        current: 0,
        target: 10000,
        percentage: 0
      },
      recentTransactions: [
        // Empty array - user will add transactions
      ]
    };

    console.log('Serving mock dashboard data for userId:', userId);

    // Return mock dashboard data
    return NextResponse.json({
      success: true,
      data: mockData
    });
  } catch (error) {
    console.error('Error generating mock dashboard data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate mock dashboard data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
