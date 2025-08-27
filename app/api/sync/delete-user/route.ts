export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { apiKeyAuthMiddleware } from '@/lib/api-key-middleware';
const connectToDatabase = require('@/lib/db');
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  // API key authentication
  const authResult = await apiKeyAuthMiddleware(req);
  if (authResult) return authResult;

  try {
    const { phone, _id } = await req.json();
    if (!phone && !_id) {
      return NextResponse.json({ success: false, message: 'Missing user identifier' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db('WaterVation');
    const users = db.collection('Users');
    let result;
    if (_id) {
      result = await users.deleteOne({ _id: new ObjectId(_id) });
    } else {
      result = await users.deleteOne({ phone });
    }
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'User synced (deleted)' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sync failed', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 