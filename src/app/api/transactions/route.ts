import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

// GET /api/transactions?userId=123
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

    // Get optional query parameters for filtering
    const category = req.nextUrl.searchParams.get('category');
    const type = req.nextUrl.searchParams.get('type');
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '100');

    // Build query
    const query: any = { userId };

    if (category) {
      query.category = category;
    }

    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(limit);

    console.log(`Retrieved ${transactions.length} transactions for user ${userId}`);

    return NextResponse.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch transactions',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST /api/transactions
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.userId || !data.amount || !data.description || !data.category || !data.type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(data.userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID format'
      }, { status: 400 });
    }

    // Validate amount is a number
    if (isNaN(parseFloat(data.amount))) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be a number'
      }, { status: 400 });
    }

    // Create new transaction
    const newTransaction = new Transaction({
      ...data,
      amount: parseFloat(data.amount),
      date: data.date ? new Date(data.date) : new Date()
    });

    await newTransaction.save();
    console.log(`New transaction created: ${newTransaction._id} for user ${data.userId}`);

    return NextResponse.json({
      success: true,
      data: newTransaction
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create transaction',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT /api/transactions?id=123
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Transaction ID is required'
      }, { status: 400 });
    }

    const data = await req.json();

    await connectToDatabase();

    // Find and update the transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    console.log(`Transaction updated: ${id}`);

    return NextResponse.json({
      success: true,
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update transaction',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE /api/transactions?id=123
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Transaction ID is required'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Find and delete the transaction
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    console.log(`Transaction deleted: ${id}`);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete transaction',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
