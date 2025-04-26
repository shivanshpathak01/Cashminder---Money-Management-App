import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    // Test the database connection
    const mongoose = await connectToDatabase();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Connected to MongoDB successfully',
      dbName: mongoose.connection.db.databaseName
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
