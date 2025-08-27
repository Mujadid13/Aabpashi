# AaabPashi Web API Documentation

This document provides comprehensive information about the AaabPashi Web API endpoints. The API is built using Next.js 14 with TypeScript and provides authentication, field management, geospatial data, and water management functionalities.

## Base URL

```
Production: https://your-domain.com
Development: http://localhost:3000
```

## Authentication

The API supports two authentication methods:

### 1. JWT-based Authentication (Primary)

JWT-based authentication with phone number and OTP verification. Authentication tokens are stored in HTTP-only cookies for security.

#### Authentication Flow

1. **User Registration**: Submit phone number and user details to get OTP
2. **OTP Verification**: Verify OTP to complete registration and get auth tokens
3. **User Login**: Submit phone number to get OTP for existing users
4. **OTP Verification**: Verify OTP to complete login and get auth tokens
5. **Logout**: Clear authentication tokens

#### Token Types

- **auth_token**: HTTP-only cookie containing user ID and phone number (30-day expiry)
- **meta_token**: Accessible cookie containing user metadata like division and name (30-day expiry)

### 2. API Key Authentication (Alternative)

API key authentication for programmatic access, third-party integrations, and administrative operations.

#### API Key Features

- **File-based storage**: API keys stored in `data/api-keys/api-keys.json`
- **Permission-based access**: Granular permissions (read, write, admin, delete)
- **User association**: API keys can be associated with specific users
- **Expiration support**: Optional expiration dates
- **Key regeneration**: Ability to regenerate keys without changing metadata

#### Authentication Headers

API keys can be provided in two ways:

- `Authorization: Bearer <api-key>`
- `X-API-Key: <api-key>`

#### Permissions

- **read**: Read access to API endpoints
- **write**: Write access to API endpoints
- **admin**: Full administrative access (includes all other permissions)
- **delete**: Delete access to resources

#### Authentication Priority

1. API key authentication is checked first
2. If API key fails, JWT authentication is attempted
3. If both fail, request is rejected with 401 Unauthorized

## API Endpoints

### Authentication Endpoints

#### POST /[locale]/api/auth/signup

Register a new user and send OTP for verification.

**Request Body:**

```json
{
  "name": "John Doe",
  "city": "Lahore",
  "phone": "+923001234567",
  "receiverNetwork": "Jazz",
  "division": "Kasur",
  "farmsize": "5-10 acres",
  "role": "Farmer",
  "country": "Pakistan"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "name": "John Doe",
  "city": "Lahore",
  "phone": "+923001234567",
  "receiverNetwork": "Jazz",
  "division": "Kasur",
  "farmsize": "5-10 acres",
  "role": "Farmer",
  "country": "Pakistan"
}
```

#### POST /[locale]/api/auth/verifyotp-register

Verify OTP and complete user registration.

**Request Body:**

```json
{
  "phoneNumber": "+923001234567",
  "otp": "1234",
  "name": "John Doe",
  "city": "Lahore",
  "division": "Kasur",
  "receiverNetwork": "Jazz",
  "farmsize": "5-10 acres",
  "role": "Farmer",
  "country": "Pakistan"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified and user registered successfully."
}
```

#### POST /[locale]/api/auth/login

Send OTP to existing user for login.

**Request Body:**

```json
{
  "phoneNumber": "+923001234567"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phoneNumber": "+923001234567",
  "id": "64a1b2c3d4e5f6789012345",
  "division": "Kasur",
  "name": "John Doe"
}
```

#### POST /[locale]/api/auth/verifyotp-login

Verify OTP and complete user login.

**Request Body:**

```json
{
  "phoneNumber": "+923001234567",
  "otp": "1234"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logged in successfully"
}
```

#### POST /[locale]/api/auth/sendotp

Send OTP to a phone number (general purpose).

**Request Body:**

```json
{
  "phoneNumber": "+923001234567",
  "receiverNetwork": "Jazz"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### POST /[locale]/api/auth/logout

Logout user and clear authentication tokens.

**Response:**

```json
{
  "message": "Logout successful"
}
```

### Field Management Endpoints

#### POST /api/savefield

Save a new field for the authenticated user.

**Request Body:**

```json
{
  "fieldName": "North Field",
  "cropTypes": ["Wheat", "Cotton"],
  "soilType": "Clay",
  "location": {
    "lat": 31.5204,
    "lng": 74.3587
  },
  "userId": "64a1b2c3d4e5f6789012345"
}
```

**Response:**

```json
{
  "message": "Field data saved successfully",
  "data": {
    "fieldName": "North Field",
    "cropTypes": ["Wheat", "Cotton"],
    "soilType": "Clay",
    "location": {
      "lat": 31.5204,
      "lng": 74.3587
    },
    "userId": "64a1b2c3d4e5f6789012345",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/getfield

Retrieve all fields for a specific user.

**Request Body:**

```json
{
  "userId": "64a1b2c3d4e5f6789012345"
}
```

**Response:**

```json
{
  "fields": [
    {
      "_id": "64a1b2c3d4e5f6789012346",
      "fieldName": "North Field",
      "cropTypes": ["Wheat", "Cotton"],
      "soilType": "Clay",
      "location": {
        "lat": 31.5204,
        "lng": 74.3587
      },
      "userId": "64a1b2c3d4e5f6789012345",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/updatefield

Update field polygon geometry.

**Request Body:**

```json
{
  "fieldId": "64a1b2c3d4e5f6789012346",
  "polygon": {
    "type": "Polygon",
    "coordinates": [
      [
        [74.3587, 31.5204],
        [74.359, 31.5204],
        [74.359, 31.5207],
        [74.3587, 31.5207],
        [74.3587, 31.5204]
      ]
    ]
  }
}
```

**Response:**

```json
{
  "message": "Polygon updated successfully."
}
```

#### POST /api/deletefield

Delete a field.

**Request Body:**

```json
{
  "_id": "64a1b2c3d4e5f6789012346"
}
```

**Response:**

```json
{
  "message": "Field deleted successfully."
}
```

#### POST /api/checkpolygon

Get polygon and field name for a specific field.

**Request Body:**

```json
{
  "fieldId": "64a1b2c3d4e5f6789012346"
}
```

**Response:**

```json
{
  "polygon": {
    "type": "Polygon",
    "coordinates": [
      [
        [74.3587, 31.5204],
        [74.359, 31.5204],
        [74.359, 31.5207],
        [74.3587, 31.5207],
        [74.3587, 31.5204]
      ]
    ]
  },
  "fieldName": "North Field"
}
```

### Geospatial and Water Management Endpoints

#### POST /api/getcanals

Get canal information for a specific division.

**Request Body:**

```json
{
  "division": "Kasur"
}
```

**Response:**

```json
[
  {
    "name": "Main Canal",
    "type": "Primary",
    "status": "Active"
  }
]
```

#### POST /api/getwrs

Get water release schedule data for a canal.

**Request Body:**

```json
{
  "canal": "Main Canal",
  "division": "Kasur"
}
```

**Response:**

```json
{
  "schedule": "Water release schedule data",
  "priority": "High",
  "rotation": "Weekly"
}
```

#### POST /api/getncd

Get nearest canal data based on location and division.

**Request Body:**

```json
{
  "position": {
    "lon": 74.3587,
    "lat": 31.5204
  },
  "division": "Kasur"
}
```

**Response:**

```json
{
  "nearest_canal": "Main Canal",
  "distance": "2.5 km",
  "water_availability": "Available"
}
```

#### POST /api/getGEE

Get Google Earth Engine data for a polygon.

**Request Body:**

```json
{
  "polygon": {
    "type": "Polygon",
    "coordinates": [
      [
        [74.3587, 31.5204],
        [74.359, 31.5204],
        [74.359, 31.5207],
        [74.3587, 31.5207],
        [74.3587, 31.5204]
      ]
    ]
  }
}
```

**Response:**

```json
{
  "ndvi": 0.75,
  "precipitation": 25.5,
  "temperature": 28.3,
  "soil_moisture": 0.65
}
```

#### POST /api/getweather

Get weather forecast for a location.

**Request Body:**

```json
{
  "position": {
    "lat": 31.5204,
    "lon": 74.3587
  }
}
```

**Response:**

```json
{
  "daily": {
    "time": ["2024-01-01", "2024-01-02"],
    "temperature_2m_max": [25.5, 26.1],
    "temperature_2m_min": [15.2, 16.0],
    "precipitation_sum": [0, 2.5],
    "relative_humidity_2m_max": [85, 80],
    "relative_humidity_2m_min": [45, 50]
  }
}
```

### Translation Endpoints

#### POST /api/translatecanal

Translate canal names or text to Urdu.

**Request Body:**

```json
{
  "text": ["Main Canal", "Secondary Canal"],
  "target": "ur"
}
```

**Response:**

```json
{
  "translation": ["مین کینال", "ثانوی کینال"]
}
```

#### POST /api/translatecanal1

Translate up to 3 canal names to Urdu.

**Request Body:**

```json
{
  "text": ["Canal 1", "Canal 2", "Canal 3"],
  "target": "ur"
}
```

**Response:**

```json
{
  "translation": ["کینال 1", "کینال 2", "کینال 3"]
}
```

### API Key Management Endpoints

#### GET /api/admin/api-keys

List all API keys (admin only).

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

Create a new API key (admin only).

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

Get specific API key details (admin only).

#### PUT /api/admin/api-keys/[id]

Update API key properties (admin only).

#### DELETE /api/admin/api-keys/[id]

Delete an API key (admin only).

#### POST /api/admin/api-keys/[id]/revoke

Revoke (deactivate) an API key (admin only).

#### POST /api/admin/api-keys/[id]/regenerate

Regenerate an API key (admin only).

### Contact Management

#### POST /api/savecontact

Save contact form submission.

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "3001234567",
  "email": "john@example.com",
  "userMessage": "I need help with water management"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Contact saved successfully"
}
```

### User Sync Endpoints

These endpoints are used for cross-platform user database synchronization. They are protected by API key authentication and are intended for internal use only.

#### Field Mapping System

The sync system includes a comprehensive field mapping system that adapts AabPashi user data to the specific API format expected by each external platform. Each platform has its own field mapper that handles:

**Uniform Endpoint Structure:**
All platforms use the same endpoint structure for consistency and easier implementation:

- `POST /api/sync/create-user` - Create/upsert user
- `POST /api/sync/update-user` - Update user
- `POST /api/sync/delete-user` - Delete user
- `GET /api/health` - Health check

The field mappers handle the data transformation while keeping the endpoint structure consistent.

- **Data Transformation**: Converting AabPashi field names to platform-specific field names
- **Structure Adaptation**: Restructuring data to match platform API requirements
- **Source Tracking**: Including source platform information for audit trails
- **Metadata Preservation**: Storing original data in platform-specific metadata fields

**Available Field Mappers:**

1. **Farmovation User Server** (`farmovation`)

   - Maps to Farmovation User Server API format
   - Splits name into firstName/lastName
   - Generates email from phone number
   - Includes comprehensive metadata

2. **Farmovation Marketplace Platform** (`farmovation_marketplace`)

   - Maps to Farmovation Marketplace API format for e-commerce sellers
   - Creates seller profiles with business information
   - Includes marketplace-specific fields (status, verification, ratings)
   - Business-focused data structure with specializations

3. **Generic Platform** (`generic`)
   - Default mapper for unknown platforms
   - Preserves all original fields
   - Adds source platform tracking

**Field Mapping CLI Tools:**

```bash
# List all available field mappers
npm run mappers:list

# Get detailed info about a specific mapper
npm run mappers:info <mapper-name>

# Test field mapping with sample data
npm run mappers:test <mapper-name>

# Create a new custom field mapper
npm run mappers:create <mapper-name> <display-name>
```

#### POST /api/sync/create-user

Create or upsert a user in the local database.

**Headers:**

```
X-API-Key: <internal-api-key>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "+923001234567",
  "city": "Lahore",
  "division": "Kasur",
  "role": "Farmer",
  ...
}
```

**Response:**

```json
{
  "success": true,
  "message": "User synced (created/updated)"
}
```

#### POST /api/sync/update-user

Update a user in the local database.

**Headers:**

```
X-API-Key: <internal-api-key>
```

**Request Body:**

```json
{
  "phone": "+923001234567",
  "city": "Lahore",
  ...
}
```

**Response:**

```json
{
  "success": true,
  "message": "User synced (updated)"
}
```

#### POST /api/sync/delete-user

Delete a user from the local database.

**Headers:**

```
X-API-Key: <internal-api-key>
```

**Request Body:**

```json
{
  "phone": "+923001234567"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User synced (deleted)"
}
```

### Documentation and Help Endpoints

#### GET /api/docs

Access interactive Swagger UI documentation. This endpoint is publicly accessible and provides a beautiful, interactive interface for exploring the API.

**Features:**

- Browse all API endpoints
- Test API calls directly in the browser
- View request/response schemas
- Understand authentication requirements
- See example requests and responses

#### GET /api/openapi

Get the OpenAPI 3.0 specification in JSON format. This endpoint is publicly accessible and provides machine-readable API schema.

**Use Cases:**

- Automated API client generation
- Integration with API tools
- Programmatic API discovery
- Schema validation

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development)"
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created successfully
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Authentication required
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists
- **429**: Too Many Requests - Rate limiting applied
- **500**: Internal Server Error

## Rate Limiting

OTP requests are rate-limited to prevent abuse:

- One OTP per phone number every 5 minutes
- Returns 429 status code when rate limit exceeded

## Data Validation

### Phone Number Format

- Accepts: `+923001234567` or `3001234567`
- Automatically adds `+92` prefix if missing
- Must be valid Pakistani mobile number format

### Name Validation

- Must contain only letters and spaces
- Full name required (minimum 2 words)
- Automatically capitalized

### Location Validation

- Latitude: Valid decimal degree (-90 to 90)
- Longitude: Valid decimal degree (-180 to 180)

## Security Features

1. **Input Sanitization**: All inputs are sanitized to prevent injection attacks
2. **HTTP-Only Cookies**: Authentication tokens stored securely
3. **CORS Protection**: Configured for production environment
4. **Rate Limiting**: OTP endpoints have rate limiting
5. **Environment Variables**: Sensitive data stored in environment variables
6. **API Key Security**: API keys are cryptographically secure and prefixed for identification
7. **Permission-based Access**: Granular permissions for API key users
8. **User Association**: API keys can be restricted to specific users
9. **Key Expiration**: Optional expiration dates for temporary access
10. **Key Regeneration**: Ability to rotate keys without changing metadata

## Environment Variables Required

```
# Core API Keys
VEEVO_API_KEY=your_veevo_api_key
GOOGLE_CLOUD_API_KEY=your_google_translate_api_key
JWT_SECRET=your_jwt_secret_key

# External API URLs
NEXT_PUBLIC_PYTHON_API_URL=your_python_api_url
NEXT_PUBLIC_PYTHON_API_URL1=your_secondary_python_api_url
NEXT_PUBLIC_GEE_API_URL=your_google_earth_engine_api_url

# Multi-Platform Sync Configuration
FARMOVATION_API_URL=https://user-server.sam.farmovation.tech/api/v1
FARMOVATION_API_KEY=your-farmovation-api-key-here
FARMOVATION_MARKETPLACE_API_URL=https://marketplace.farmovation.tech
FARMOVATION_MARKETPLACE_API_KEY=your-farmovation-marketplace-api-key-here
```

## API Key Management

### CLI Tool

Use the provided CLI tool for managing API keys:

```bash
# Create an admin API key
node scripts/generate-api-key.js create "Admin Key" "admin"

# Create a read-only key for a specific user
node scripts/generate-api-key.js create "User App" "read" "user123"

# List all API keys
node scripts/generate-api-key.js list

# Delete an API key
node scripts/generate-api-key.js delete abc123def456
```

### File Storage

API keys are stored in `data/api-keys/api-keys.json`. This file should be:

- Backed up regularly
- Not committed to version control
- Secured with appropriate file permissions

## Database Collections

### Users Collection

- Stores user registration data
- Fields: name, phone, city, division, farmsize, role, country, receiverNetwork, createdAt

### Fields Collection

- Stores user field information
- Fields: fieldName, cropTypes, soilType, location, polygon, userId, createdAt

### Contact Collection

- Stores contact form submissions
- Fields: name, phone, email, userMessage, createdAt

### Division-specific Collections

- `{division}_Canals`: Canal information per division
- `{division}_Canal_RP`: Canal priority data
- `{division}_RP`: Rotation schedule data
- `{division}_shp`: Shapefile data for divisions

## Integration APIs

### External Services

1. **Veevo SMS API**: For OTP delivery
2. **Google Translate API**: For multilingual support
3. **Open-Meteo API**: For weather data
4. **Google Earth Engine API**: For satellite imagery and analysis
5. **Custom Python APIs**: For advanced geospatial processing

## Localization

The API supports multiple locales through the `[locale]` parameter in authentication endpoints:

- `en`: English (default)
- `ur`: Urdu

## Performance Considerations

1. **Database Indexing**: Indexes on frequently queried fields (userId, phone)
2. **Caching**: Redis used for OTP storage and rate limiting
3. **External API Optimization**: Efficient data fetching from external services
4. **Image Optimization**: Optimized responses for geospatial data

## Monitoring and Logging

- Server-side error logging for debugging
- Request/response logging for API usage monitoring
- Error tracking for external API failures
