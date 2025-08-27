export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { apiKeyAuthMiddleware } from '@/lib/api-key-middleware';
const connectToDatabase = require('@/lib/db');

export async function POST(req: NextRequest) {
  // API key authentication
  const authResult = await apiKeyAuthMiddleware(req);
  if (authResult) return authResult;

  try {
    const user = await req.json();
    if (!user || !user.phone) {
      return NextResponse.json({ success: false, message: 'Missing user data' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db('WaterVation');
    const users = db.collection('Users');
    // Update user by phone
    const result = await users.updateOne(
      { phone: user.phone },
      { $set: { ...user } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'User synced (updated)' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sync failed', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 