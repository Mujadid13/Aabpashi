# AaabPashi Web API Documentation

This directory contains comprehensive documentation for the AaabPashi Web API, including both human-readable and machine-readable formats.

## 📁 Files

### `API.md`

Comprehensive markdown documentation that includes:

- Detailed endpoint descriptions
- Request/response examples
- Authentication flow
- Error handling
- Rate limiting information
- Data validation rules
- Security features
- External service integrations

### `openapi.yaml`

OpenAPI 3.0 specification file containing:

- Complete API schema definitions
- Request/response models
- Authentication security schemes
- Endpoint parameters and responses
- Error response formats

## 🌐 Accessing Documentation

### Interactive Swagger UI

Visit `/docs` to access the beautiful, interactive Swagger UI interface where you can:

- Browse all API endpoints
- Test API calls directly in the browser
- View request/response schemas
- Understand authentication requirements
- See example requests and responses

### Machine-Readable OpenAPI Spec

Access the OpenAPI specification at `/api/openapi` for:

- Automated API client generation
- Integration with API tools
- Programmatic API discovery
- Schema validation

### Raw Documentation Files

- **API.md**: `/docs/API.md` - Detailed markdown documentation
- **OpenAPI YAML**: `/docs/openapi.yaml` - Machine-readable specification

## 🔧 For Developers

### Generating API Clients

Use the OpenAPI specification to generate client libraries:

```bash
# JavaScript/TypeScript
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api/openapi \
  -g typescript-fetch \
  -o ./generated-client

# Python
openapi-generator generate \
  -i http://localhost:3000/api/openapi \
  -g python \
  -o ./python-client

# Java
openapi-generator generate \
  -i http://localhost:3000/api/openapi \
  -g java \
  -o ./java-client
```

### Testing API Endpoints

The Swagger UI provides a "Try it out" feature for testing endpoints directly. Alternatively, you can use tools like:

- **Postman**: Import the OpenAPI spec directly
- **Insomnia**: Import the OpenAPI spec for automated endpoint setup
- **curl**: Use the examples from the documentation

### Authentication Testing

Most endpoints require authentication. To test authenticated endpoints:

1. First call the signup/login endpoints to get authentication cookies
2. The cookies will be automatically included in subsequent requests
3. For external tools, you'll need to manually handle cookie management

## 📋 API Overview

### Authentication Endpoints

- `POST /{locale}/api/auth/signup` - Register new user
- `POST /{locale}/api/auth/login` - Login existing user
- `POST /{locale}/api/auth/verifyotp-register` - Verify registration OTP
- `POST /{locale}/api/auth/verifyotp-login` - Verify login OTP
- `POST /{locale}/api/auth/sendotp` - Send OTP
- `POST /{locale}/api/auth/logout` - Logout user

### Field Management Endpoints

- `POST /api/savefield` - Save new field
- `POST /api/getfield` - Get user fields
- `POST /api/updatefield` - Update field polygon
- `POST /api/deletefield` - Delete field
- `POST /api/checkpolygon` - Get field polygon

### Geospatial & Water Management Endpoints

- `POST /api/getcanals` - Get canal information
- `POST /api/getwrs` - Get water release schedule
- `POST /api/getncd` - Get nearest canal data
- `POST /api/getGEE` - Get Google Earth Engine data
- `POST /api/getweather` - Get weather forecast

### Translation Endpoints

- `POST /api/translatecanal` - Translate canal names
- `POST /api/translatecanal1` - Translate up to 3 canal names

### Contact Management

- `POST /api/savecontact` - Save contact form

## 🛡️ Security

### Authentication

- JWT-based authentication with HTTP-only cookies
- Phone number + OTP verification
- 30-day token expiry

### Rate Limiting

- OTP endpoints: 1 request per phone number every 5 minutes
- Returns 429 status code when rate limit exceeded

### Input Validation

- All inputs are sanitized to prevent injection attacks
- Phone number format validation
- GeoJSON polygon validation
- Email and name format validation

## 🔗 External Integrations

The API integrates with several external services:

- **Veevo SMS API**: OTP delivery via SMS
- **Google Translate API**: Multilingual support (English/Urdu)
- **Open-Meteo API**: Weather forecast data
- **Google Earth Engine API**: Satellite imagery and analysis
- **Custom Python APIs**: Advanced geospatial processing

## 🗄️ Database

### MongoDB Collections

- `Users`: User registration and profile data
- `Fields`: Agricultural field information
- `contact`: Contact form submissions
- `{division}_Canals`: Division-specific canal data
- `{division}_Canal_RP`: Canal priority data
- `{division}_RP`: Rotation schedule data
- `{division}_shp`: Shapefile data for divisions

### Redis

- OTP storage (5-minute expiry)
- Rate limiting counters

## 📝 Environment Variables

Required environment variables for API functionality:

```env
VEEVO_API_KEY=your_veevo_api_key
GOOGLE_CLOUD_API_KEY=your_google_translate_api_key
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_PYTHON_API_URL=your_python_api_url
NEXT_PUBLIC_PYTHON_API_URL1=your_secondary_python_api_url
NEXT_PUBLIC_GEE_API_URL=your_google_earth_engine_api_url
```

## 🌍 Localization

The API supports multiple locales:

- `en`: English (default)
- `ur`: Urdu

Authentication endpoints accept a `{locale}` parameter to specify the language for error messages and responses.

## 📞 Support

For API support and questions:

- Email: support@aabpashi.com
- Documentation: [/docs](/docs)
- OpenAPI Spec: [/api/openapi](/api/openapi)

## 📄 License

This API documentation is part of the AaabPashi project. Please refer to the main project license for usage terms.
