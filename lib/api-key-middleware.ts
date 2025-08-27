import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from './api-key';

export interface AuthenticatedRequest extends NextRequest {
  apiKey?: {
    id: string;
    name: string;
    permissions: string[];
    userId?: string;
  };
}

export async function validateApiKey(req: NextRequest): Promise<{
  isValid: boolean;
  apiKey?: any;
  error?: string;
}> {
  try {
    // Check for API key in headers
    const authHeader = req.headers.get('authorization');
    const apiKeyHeader = req.headers.get('x-api-key');
    
    let apiKey: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7);
    } else if (apiKeyHeader) {
      apiKey = apiKeyHeader;
    }

    if (!apiKey) {
      return { isValid: false, error: 'No API key provided' };
    }

    const validation = await apiKeyService.validateApiKey(apiKey);
    return validation;
  } catch (error) {
    console.error('API key validation error:', error);
    return { isValid: false, error: 'Invalid API key' };
  }
}

export async function apiKeyAuthMiddleware(req: NextRequest): Promise<NextResponse | null> {
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

  // For App Router, we can't modify headers, so we return null to continue
  // The API key info can be accessed via the validation result
  return null;
}

export function requireApiKeyPermission(permission: string) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
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

    if (!validation.apiKey) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Unauthorized - No API key data'
        },
        { status: 401 }
      );
    }

    const hasPermission = validation.apiKey.permissions.includes(permission) || 
                         validation.apiKey.permissions.includes('admin');

    if (!hasPermission) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Forbidden - Insufficient permissions',
          error: `Required permission: ${permission}`
        },
        { status: 403 }
      );
    }

    // Add API key info to request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-api-key-id', validation.apiKey.id);
    requestHeaders.set('x-api-key-name', validation.apiKey.name);
    requestHeaders.set('x-api-key-permissions', validation.apiKey.permissions.join(','));
    if (validation.apiKey.userId) {
      requestHeaders.set('x-api-key-user-id', validation.apiKey.userId);
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  };
}

export function getApiKeyFromRequest(req: NextRequest): {
  id?: string;
  name?: string;
  permissions?: string[];
  userId?: string;
} {
  return {
    id: req.headers.get('x-api-key-id') || undefined,
    name: req.headers.get('x-api-key-name') || undefined,
    permissions: req.headers.get('x-api-key-permissions')?.split(',') || [],
    userId: req.headers.get('x-api-key-user-id') || undefined,
  };
} 