import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from '@/lib/api-key';
import { requireApiKeyPermission } from '@/lib/api-key-middleware';

export const runtime = 'nodejs';
// POST /api/admin/api-keys/[id]/regenerate - Regenerate API key
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin permission
    const authCheck = await requireApiKeyPermission('admin')(req);
    if (authCheck) {
      return authCheck;
    }

    const { id } = await params;
    const regeneratedApiKey = await apiKeyService.regenerateApiKey(id);

    return NextResponse.json({
      success: true,
      message: 'API key regenerated successfully',
      data: {
        id: regeneratedApiKey.id,
        name: regeneratedApiKey.name,
        key: regeneratedApiKey.key, // Include the new key
        userId: regeneratedApiKey.userId,
        permissions: regeneratedApiKey.permissions,
        isActive: regeneratedApiKey.isActive,
        createdAt: regeneratedApiKey.createdAt,
        lastUsed: regeneratedApiKey.lastUsed,
        expiresAt: regeneratedApiKey.expiresAt
      }
    });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to regenerate API key',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 