export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-key-middleware';
const connectToDatabase = require('@/lib/db');

export async function POST(req: NextRequest) {
  // API key authentication
  const validation = await validateApiKey(req);
  if (!validation.isValid) {
    return NextResponse.json(
      { 
        success: false,
        message: 'Unauthorized - Invalid API key',
        error: validation.error 
      },
      { status: 401 }
    );
  }

  try {
    const user = await req.json();
    console.log('SYNC DEBUG: Incoming user payload:', user);
    // Extract userData from the payload
    const userData = user.userData || {};
    const phone = userData.mobile;
    if (!userData || !phone) {
      console.error('SYNC ERROR: Missing user data or phone field:', user);
      return NextResponse.json({ success: false, message: 'Missing user data' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db('WaterVation');
    const users = db.collection('Users');
    
    // Remove _id from user data to avoid MongoDB immutable field error
    const { _id, ...userDataWithoutId } = userData;

    // Debug log: log the payload being inserted
    console.log('SYNC DEBUG: Attempting to upsert user:', userDataWithoutId);
    
    // Upsert user by phone
    const upsertResult = await users.updateOne(
      { phone },
      { $set: { ...userDataWithoutId, createdAt: user.createdAt || new Date() } },
      { upsert: true }
    );
    // Debug log: log the result of the upsert
    console.log('SYNC DEBUG: Upsert result:', upsertResult);
    return NextResponse.json({ success: true, message: 'User synced (created/updated)' });
  } catch (error) {
    console.error('SYNC ERROR: Exception in create-user route:', error);
    return NextResponse.json({ success: false, message: 'Sync failed', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 