import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './lib/jwt';

export async function middleware(request: NextRequest) {
  // Temporarily disabled middleware for debugging
  return NextResponse.next();
}

// Temporarily disable middleware matcher for debugging
export const config = {
  matcher: [],
};
