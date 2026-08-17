import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from '@/lib/api-key';
import { requireApiKeyPermission } from '@/lib/api-key-middleware';

export const runtime = 'nodejs';
// POST /api/admin/api-keys/[id]/revoke - Revoke API key
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
    await apiKeyService.revokeApiKey(id);

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking API key:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to revoke API key',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 