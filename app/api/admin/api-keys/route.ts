import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService, CreateApiKeyRequest, UpdateApiKeyRequest } from '@/lib/api-key';
import { requireApiKeyPermission } from '@/lib/api-key-middleware';

export const runtime = 'nodejs';

// GET /api/admin/api-keys - List all API keys
export async function GET(req: NextRequest) {
  try {
    // Check admin permission
    const authCheck = await requireApiKeyPermission('admin')(req);
    if (authCheck) {
      return authCheck;
    }

    const apiKeys = await apiKeyService.getAllApiKeys();
    
    // Remove sensitive data (actual keys) from response
    const sanitizedKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      userId: key.userId,
      permissions: key.permissions,
      isActive: key.isActive,
      createdAt: key.createdAt,
      lastUsed: key.lastUsed,
      expiresAt: key.expiresAt
    }));

    return NextResponse.json({
      success: true,
      data: sanitizedKeys,
      count: sanitizedKeys.length
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch API keys',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/api-keys - Create new API key
export async function POST(req: NextRequest) {
  try {
    // Check admin permission
    const authCheck = await requireApiKeyPermission('admin')(req);
    if (authCheck) {
      return authCheck;
    }

    const body: CreateApiKeyRequest = await req.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name is required'
        },
        { status: 400 }
      );
    }

    // Validate permissions
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

    const newApiKey = await apiKeyService.createApiKey(body);

    return NextResponse.json(
      {
        success: true,
        message: 'API key created successfully',
        data: {
          id: newApiKey.id,
          name: newApiKey.name,
          key: newApiKey.key, // Include the actual key only on creation
          userId: newApiKey.userId,
          permissions: newApiKey.permissions,
          isActive: newApiKey.isActive,
          createdAt: newApiKey.createdAt,
          expiresAt: newApiKey.expiresAt
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create API key',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 