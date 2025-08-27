# API Key System Documentation

This document describes the API key authentication system implemented in AaabPashi Web, which works alongside the existing JWT-based authentication.

## Overview

The API key system provides an alternative authentication method for programmatic access to the API. It's designed for:

- Third-party integrations
- Automated scripts and tools
- Service-to-service communication
- Administrative access

## Features

- **File-based storage**: API keys are stored in `data/api-keys/api-keys.json`
- **Permission-based access**: Granular permissions (read, write, admin, delete)
- **User association**: API keys can be associated with specific users
- **Expiration support**: Optional expiration dates for API keys
- **Key regeneration**: Ability to regenerate keys without changing metadata
- **Usage tracking**: Last used timestamps for monitoring
- **Dual authentication**: Works alongside existing JWT authentication

## Authentication Flow

### API Key Authentication

1. Client includes API key in request headers
2. Middleware validates the API key
3. If valid, request proceeds with API key context
4. If invalid, falls back to JWT authentication

### Headers Support

API keys can be provided in two ways:

- `Authorization: Bearer <api-key>`
- `X-API-Key: <api-key>`

## API Key Structure

```typescript
interface ApiKey {
  id: string; // Unique identifier
  name: string; // Human-readable name
  key: string; // The actual API key (prefixed with "aabpashi_")
  userId?: string; // Associated user ID (optional)
  permissions: string[]; // Array of permissions
  isActive: boolean; // Whether the key is active
  createdAt: string; // Creation timestamp
  lastUsed?: string; // Last usage timestamp
  expiresAt?: string; // Expiration timestamp (optional)
}
```

## Permissions

- **read**: Read access to API endpoints
- **write**: Write access to API endpoints
- **admin**: Full administrative access (includes all other permissions)
- **delete**: Delete access to resources

## API Endpoints

### Public Endpoints (No Authentication Required)

#### GET /api/docs

Access interactive Swagger UI documentation. This endpoint is publicly accessible and provides a beautiful, interactive interface for exploring the API.

#### GET /api/openapi

Get the OpenAPI 3.0 specification in JSON format. This endpoint is publicly accessible and provides machine-readable API schema.

### Management Endpoints (Admin Only)

#### GET /api/admin/api-keys

List all API keys (without exposing actual keys).

**Headers:**

```
Authorization: Bearer <admin-api-key>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123def456",
      "name": "My App",
      "userId": "user123",
      "permissions": ["read", "write"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastUsed": "2024-01-15T10:30:00.000Z",
      "expiresAt": "2024-02-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### POST /api/admin/api-keys

Create a new API key.

**Headers:**

```
Authorization: Bearer <admin-api-key>
```

**Request Body:**

```json
{
  "name": "My App",
  "userId": "user123",
  "permissions": ["read", "write"],
  "expiresInDays": 30
}
```

**Response:**

```json
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "id": "abc123def456",
    "name": "My App",
    "key": "aabpashi_1234567890abcdef...",
    "userId": "user123",
    "permissions": ["read", "write"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-02-01T00:00:00.000Z"
  }
}
```

#### GET /api/admin/api-keys/[id]

Get specific API key details.

#### PUT /api/admin/api-keys/[id]

Update API key properties.

#### DELETE /api/admin/api-keys/[id]

Delete an API key.

#### POST /api/admin/api-keys/[id]/revoke

Revoke (deactivate) an API key.

#### POST /api/admin/api-keys/[id]/regenerate

Regenerate an API key (creates new key, keeps metadata).

## CLI Management Tool

A command-line tool is provided for managing API keys:

### Installation

```bash
chmod +x scripts/generate-api-key.js
```

### Usage Examples

#### Create API Key

```bash
# Create a read-only key
node scripts/generate-api-key.js create "Read Only App" "read"

# Create a key with multiple permissions
node scripts/generate-api-key.js create "Full Access App" "read,write,admin"

# Create a key for a specific user
node scripts/generate-api-key.js create "User App" "read,write" "user123"

# Create a key with expiration
node scripts/generate-api-key.js create "Temporary App" "read" "user123" 30
```

#### List API Keys

```bash
node scripts/generate-api-key.js list
```

#### Delete API Key

```bash
node scripts/generate-api-key.js delete abc123def456
```

#### Revoke API Key

```bash
node scripts/generate-api-key.js revoke abc123def456
```

#### Regenerate API Key

```bash
node scripts/generate-api-key.js regenerate abc123def456
```

## Using API Keys in API Routes

### Basic Usage

```typescript
import { getUserId, isApiKeyAuth, hasApiKeyPermission } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    // Get user ID from request body or authentication
    const body = await req.json();
    let { userId } = body;

    if (!userId) {
      userId = getUserId(req);
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Check API key permissions if using API key auth
    if (isApiKeyAuth(req)) {
      const apiKeyUserId = req.headers.get("x-api-key-user-id");

      // User-specific API keys can only access their own data
      if (apiKeyUserId && apiKeyUserId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Check for required permissions
      if (!hasApiKeyPermission(req, "read")) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }
    }

    // Proceed with API logic...
  } catch (error) {
    // Error handling...
  }
}
```

### Permission Checking

```typescript
import { hasApiKeyPermission } from "@/lib/auth-utils";

// Check for specific permission
if (isApiKeyAuth(req) && !hasApiKeyPermission(req, "write")) {
  return NextResponse.json(
    { error: "Write permission required" },
    { status: 403 }
  );
}

// Admin permission includes all other permissions
if (isApiKeyAuth(req) && !hasApiKeyPermission(req, "admin")) {
  return NextResponse.json(
    { error: "Admin permission required" },
    { status: 403 }
  );
}
```

## Security Considerations

### API Key Security

- API keys are prefixed with "aabpashi\_" for identification
- Keys are 32 bytes of random data (64 hex characters)
- Keys are only shown once upon creation
- Expired or inactive keys are automatically rejected

### Access Control

- API keys can be associated with specific users
- User-specific keys can only access their associated user's data
- Admin keys can access any user's data
- Permissions are checked on each request

### Best Practices

1. **Store keys securely**: Never commit API keys to version control
2. **Use least privilege**: Grant only necessary permissions
3. **Rotate keys regularly**: Regenerate keys periodically
4. **Monitor usage**: Check last used timestamps
5. **Set expiration**: Use expiration dates for temporary access

## File Structure

```
lib/
├── api-key.ts              # API key service
├── api-key-middleware.ts   # Authentication middleware
└── auth-utils.ts          # Utility functions

app/api/admin/api-keys/
├── route.ts               # List and create keys
├── [id]/
│   ├── route.ts          # Get, update, delete key
│   ├── revoke/
│   │   └── route.ts      # Revoke key
│   └── regenerate/
│       └── route.ts      # Regenerate key

scripts/
└── generate-api-key.js   # CLI management tool

data/
└── api-keys/
    └── api-keys.json     # API key storage
```

## Integration with Existing Authentication

The API key system works alongside the existing JWT authentication:

1. **Priority**: API key authentication is checked first
2. **Fallback**: If API key fails, JWT authentication is attempted
3. **Headers**: Both authentication methods set appropriate headers
4. **Compatibility**: Existing API routes continue to work unchanged

### Header Mapping

| Authentication | Headers Set                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| API Key        | `x-api-key-id`, `x-api-key-name`, `x-api-key-permissions`, `x-api-key-user-id` |
| JWT            | `x-user-id`, `x-user-phone`                                                    |

## Error Responses

### Authentication Errors

```json
{
  "success": false,
  "message": "Unauthorized - Invalid API key",
  "error": "API key has expired"
}
```

### Permission Errors

```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions",
  "error": "Required permission: write"
}
```

## Monitoring and Logging

- API key usage is automatically tracked with timestamps
- Failed authentication attempts are logged
- Permission violations are logged
- Expired key attempts are logged

## Migration Guide

### For Existing API Routes

1. Import auth utilities: `import { getUserId, isApiKeyAuth, hasApiKeyPermission } from "@/lib/auth-utils"`
2. Use `getUserId(req)` to get user ID from either authentication method
3. Add permission checks for API key users if needed
4. Test with both JWT and API key authentication

### For New API Routes

1. Design with both authentication methods in mind
2. Use the auth utilities for consistent behavior
3. Implement appropriate permission checks
4. Consider user-specific vs admin access patterns

## Troubleshooting

### Common Issues

1. **"No valid authentication provided"**

   - Check that API key is properly formatted
   - Verify API key is active and not expired
   - Ensure API key is sent in correct header

2. **"Forbidden - Insufficient permissions"**

   - Check API key permissions
   - Verify required permission for endpoint
   - Consider using admin permission for testing

3. **"Cannot access other user's data"**
   - API key is user-specific but trying to access different user
   - Use admin API key or user-specific key for correct user

### Debugging

- Check API key status: `node scripts/generate-api-key.js list`
- Verify permissions in API key data
- Check request headers in browser dev tools
- Review server logs for authentication errors
