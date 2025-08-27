import { NextRequest } from 'next/server';

export interface AuthInfo {
  type: 'jwt' | 'api-key';
  userId?: string;
  phone?: string;
  apiKeyId?: string;
  apiKeyName?: string;
  apiKeyPermissions?: string[];
}

export function getAuthInfo(req: NextRequest): AuthInfo {
  // Check if API key authentication was used
  const apiKeyId = req.headers.get('x-api-key-id');
  const apiKeyName = req.headers.get('x-api-key-name');
  const apiKeyPermissions = req.headers.get('x-api-key-permissions')?.split(',') || [];
  const apiKeyUserId = req.headers.get('x-api-key-user-id');

  if (apiKeyId) {
    return {
      type: 'api-key',
      userId: apiKeyUserId || undefined,
      apiKeyId,
      apiKeyName: apiKeyName || undefined,
      apiKeyPermissions
    };
  }

  // Check if JWT authentication was used
  const userId = req.headers.get('x-user-id');
  const phone = req.headers.get('x-user-phone');

  if (userId || phone) {
    return {
      type: 'jwt',
      userId: userId || undefined,
      phone: phone || undefined
    };
  }

  // No authentication found
  return {
    type: 'jwt' // Default type, but no actual auth data
  };
}

export function isApiKeyAuth(req: NextRequest): boolean {
  return req.headers.get('x-api-key-id') !== null;
}

export function isJwtAuth(req: NextRequest): boolean {
  return req.headers.get('x-user-id') !== null || req.headers.get('x-user-phone') !== null;
}

export function hasApiKeyPermission(req: NextRequest, permission: string): boolean {
  const apiKeyPermissions = req.headers.get('x-api-key-permissions')?.split(',') || [];
  return apiKeyPermissions.includes(permission) || apiKeyPermissions.includes('admin');
}

export function getUserId(req: NextRequest): string | undefined {
  return req.headers.get('x-user-id') || req.headers.get('x-api-key-user-id') || undefined;
}

export function requireAuth(req: NextRequest): AuthInfo {
  const authInfo = getAuthInfo(req);
  
  if (!authInfo.userId && !authInfo.apiKeyId) {
    throw new Error('Authentication required');
  }
  
  return authInfo;
} 