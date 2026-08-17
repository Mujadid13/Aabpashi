import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService, UpdateApiKeyRequest } from '@/lib/api-key';
import { requireApiKeyPermission } from '@/lib/api-key-middleware';

export const runtime = 'nodejs';

// GET /api/admin/api-keys/[id] - Get specific API key
export async function GET(
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
    const apiKey = await apiKeyService.getApiKeyById(id);

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'API key not found'
        },
        { status: 404 }
      );
    }

    // Remove sensitive data (actual key) from response
    const sanitizedKey = {
      id: apiKey.id,
      name: apiKey.name,
      userId: apiKey.userId,
      permissions: apiKey.permissions,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
      lastUsed: apiKey.lastUsed,
      expiresAt: apiKey.expiresAt
    };

    return NextResponse.json({
      success: true,
      data: sanitizedKey
    });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch API key',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/api-keys/[id] - Update API key
export async function PUT(
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
    const body: UpdateApiKeyRequest = await req.json();

    // Validate permissions if provided
    if (body.permissions) {
      const validPermissions = ['read', 'write', 'admin', 'delete'];
      const invalidPermissions = body.permissions.filter(p => !validPermissions.includes(p));
      if (invalidPermissions.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid permissions: ${invalidPermissions.join(', ')}`,
            error: 'Valid permissions are: read, write, admin, delete'
          },
          { status: 400 }
        );
      }
    }

    const updatedApiKey = await apiKeyService.updateApiKey(id, body);

    return NextResponse.json({
      success: true,
      message: 'API key updated successfully',
      data: {
        id: updatedApiKey.id,
        name: updatedApiKey.name,
        userId: updatedApiKey.userId,
        permissions: updatedApiKey.permissions,
        isActive: updatedApiKey.isActive,
        createdAt: updatedApiKey.createdAt,
        lastUsed: updatedApiKey.lastUsed,
        expiresAt: updatedApiKey.expiresAt
      }
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update API key',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/api-keys/[id] - Delete API key
export async function DELETE(
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
    await apiKeyService.deleteApiKey(id);

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete API key',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 