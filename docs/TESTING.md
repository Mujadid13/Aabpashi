# Testing Guide for AabPashi Web

This document provides comprehensive information about testing the AabPashi Web platform, including the API key system, authentication flow, and cross-platform sync features.

## Overview

The testing suite consists of shell scripts and Node.js scripts that test various aspects of the platform:

- **API Key System**: Creation, authentication, management, and permissions
- **Authentication Flow**: Signup, OTP verification, login, logout, rate limiting
- **Cross-Platform Sync**: User synchronization between platform instances
- **Input Validation**: Data format validation and error handling
- **Environment Setup**: Configuration and dependency checks

## Prerequisites

Before running tests, ensure you have:

1. **Node.js and npm** installed
2. **curl** command-line tool available
3. **Development server** running (`npm run dev`)
4. **Environment variables** configured (optional, some tests will be skipped)
5. **Docker containers** running (for cross-platform sync tests)

## Running Tests

### Master Test Suite

Run all tests with a single command:

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Run complete test suite
./scripts/test-all.sh

# Or use npm script
npm run test-all
```

### Individual Test Scripts

Run specific test suites:

```bash
# Test API key system only
./scripts/test-api-keys.sh
npm run test-api-keys

# Test authentication flow only
./scripts/test-auth-flow.sh
npm run test-auth

# Test cross-platform sync
npx ts-node scripts/test-user-sync.js
```

## Test Coverage

### 1. API Key System Tests

**File**: `scripts/test-api-keys.sh`

**What it tests**:

- API key creation (admin and user keys)
- API key authentication with valid/invalid keys
- API key management (listing, retrieval)
- Cross-platform sync endpoints
- Permission-based access control

**Expected behavior**:

- First API key creation should succeed without authentication
- Subsequent key creation requires admin authentication
- Valid API keys should authenticate successfully
- Invalid API keys should be rejected with 401 status
- Sync endpoints should work with admin API keys

### 2. Authentication Flow Tests

**File**: `scripts/test-auth-flow.sh`

**What it tests**:

- User signup process
- OTP sending and verification
- User login process
- Authenticated endpoint access
- Logout functionality
- Rate limiting on OTP endpoints
- Input validation for phone numbers and required fields

**Expected behavior**:

- Signup should accept valid user data
- OTP sending should work for valid phone numbers
- Login should work for existing users
- Rate limiting should prevent abuse
- Invalid inputs should be rejected with appropriate errors

### 3. Cross-Platform Sync Tests

**File**: `scripts/test-user-sync.js`

**What it tests**:

- AabPashi sync API endpoints
- Field mapping between platforms
- External platform API communication
- User creation in external systems
- Data transformation validation
- Error handling and retry logic

**Expected behavior**:

- AabPashi sync API should accept user data
- Field mapping should transform data correctly
- External platform API should receive valid payload
- User should be created successfully in external system
- Test should complete with success status

**Test Flow**:

1. **AabPashi Sync API Test**: Creates test user via sync endpoint
2. **Field Mapping Test**: Validates data transformation
3. **Farmovation API Test**: Sends payload to external platform
4. **User Verification**: Confirms user creation in external system

**Sample Output**:

```
🧪 Testing Cross-Platform User Sync...
=====================================

📋 Test Configuration:
- AabPashi API: http://localhost:3000/api/sync/create-user
- Farmovation API: https://api.farmovation.tech/api/v1/sync/create-user
- Test User: Test User (+923001234567)

🔍 Step 1: Testing AabPashi Sync API...
✅ AabPashi sync API test: PASSED
   Response: {"success":true,"message":"User created successfully"}

🔍 Step 2: Testing Field Mapping...
✅ Field mapping test: PASSED
   Mapped payload: {
     "userData": {
       "email": "3001234567@aabpashi.com",
       "mobile": "3001234567",
       "first_name": "Test",
       "last_name": "User"
     },
     "originalId": "aabpashi-3001234567",
     "operation": "create",
     "timestamp": "2025-07-10T14:06:50.000Z"
   }

🔍 Step 3: Testing Farmovation API...
✅ Farmovation API test: PASSED
   Response: {"success":true,"message":"User created successfully"}

🔍 Step 4: Verifying User in Farmovation System...
✅ User verified in Farmovation system

🎉 All tests passed! Cross-platform sync is working correctly.
```

### 4. Environment and Basic Tests

**What it tests**:

- Server availability
- Environment file presence
- Basic endpoint accessibility

**Expected behavior**:

- Server should be running on localhost:3000
- Basic endpoints should respond
- Environment file should exist (optional)

## Test Results

### Output Location

Test results are saved to the `test-results/` directory:

```
test-results/
├── test_report_YYYYMMDD_HHMMSS.txt    # Summary report
├── API_Key_System_YYYYMMDD_HHMMSS.log # Detailed API key logs
├── Authentication_Flow_YYYYMMDD_HHMMSS.log # Detailed auth logs
└── field_mapping_test_YYYY-MM-DDTHH-MM-SS-sssZ.json # Field mapping results
```

### Understanding Results

#### Success Rate Categories

- **GOOD (80-100%)**: All major functionality working correctly
- **FAIR (60-79%)**: Most functionality working, some issues to address
- **POOR (<60%)**: Significant issues requiring immediate attention

#### Test Status Types

- **PASSED**: Test completed successfully
- **FAILED**: Test encountered errors or unexpected behavior
- **SKIPPED**: Test was not run (usually due to missing prerequisites)

### Sample Test Report

```
Test Results - Wed Jul 9 19:44:39 CEST 2025
========================================

Environment file missing: SKIPPED

Basic endpoint test: PASSED

Running API Key System...
  Status: PASSED

Running Authentication Flow...
  Status: PASSED

Running Cross-Platform Sync...
  Status: PASSED

Test Summary
============
Total Tests: 5
Passed: 4
Failed: 0
Skipped: 1

Success Rate: 80%
```

## Cross-Platform Sync Testing

### Prerequisites for Sync Tests

1. **Docker containers running**:

   ```bash
   npm run docker:dev
   # or
   docker-compose up -d
   ```

2. **Environment variables configured**:

   ```env
   FARMOVATION_API_URL=https://api.farmovation.tech
   FARMOVATION_API_KEY=your-farmovation-api-key
   ```

3. **API keys created**:
   ```bash
   node scripts/generate-api-key.js create "Admin Key" "admin"
   ```

### Running Sync Tests

```bash
# Test cross-platform sync
npx ts-node scripts/test-user-sync.js

# Test with Docker
docker-compose exec aabpashi-app npx ts-node scripts/test-user-sync.js
```

### Sync Test Components

#### 1. AabPashi Sync API Test

- **Endpoint**: `/api/sync/create-user`
- **Method**: POST
- **Authentication**: API key required
- **Payload**: User data with name, phone, city, division, role
- **Expected**: Success response with user creation confirmation

#### 2. Field Mapping Test

- **Purpose**: Validates data transformation between platforms
- **Input**: AabPashi user data format
- **Output**: Farmovation-compatible payload
- **Validation**: Checks all required fields are present and correctly formatted

#### 3. Farmovation API Test

- **Endpoint**: `https://api.farmovation.tech/api/v1/sync/create-user`
- **Method**: POST
- **Authentication**: Farmovation API key
- **Payload**: Transformed user data with operation and timestamp
- **Expected**: Success response from Farmovation system

#### 4. User Verification

- **Purpose**: Confirms user was actually created in external system
- **Method**: Checks user existence in Farmovation database
- **Validation**: Verifies user data matches expected values

### Field Mapping Validation

The test validates the following field transformations:

| AabPashi Field | Farmovation Field         | Transformation                          |
| -------------- | ------------------------- | --------------------------------------- |
| `name`         | `first_name`, `last_name` | Split by first space                    |
| `phone`        | `mobile`                  | Remove '+' and format as digits         |
| `phone`        | `email`                   | Generate as `<digits>@aabpashi.com`     |
| `_id`          | `originalId`              | Use as external ID or generate fallback |
| -              | `operation`               | Set to 'create'                         |
| -              | `timestamp`               | Current ISO timestamp                   |

### Troubleshooting Sync Tests

#### Common Issues

1. **Docker containers not running**:

   ```bash
   # Start containers
   npm run docker:dev

   # Check status
   docker-compose ps
   ```

2. **Missing environment variables**:

   ```bash
   # Check environment
   docker-compose exec aabpashi-app env | grep FARMOVATION
   ```

3. **API key not found**:

   ```bash
   # Create API key
   docker-compose exec aabpashi-app node scripts/generate-api-key.js create "Admin Key" "admin"
   ```

4. **Network connectivity issues**:

   ```bash
   # Test connectivity
   curl -X GET https://api.farmovation.tech/health
   ```

5. **Field mapping errors**:
   ```bash
   # Check field mapper configuration
   cat config/sync-platforms.json
   cat lib/sync-field-mappers.ts
   ```

#### Debug Mode

Run tests with verbose output:

```bash
# Enable debug logging
DEBUG=* npx ts-node scripts/test-user-sync.js
```

## Troubleshooting

### Common Issues

#### 1. Server Not Running

**Error**: `Server is not running at http://localhost:3000`

**Solution**:

```bash
npm run dev
# or
npm run docker:dev
```

#### 2. Permission Denied

**Error**: `Permission denied` when running scripts

**Solution**:

```bash
chmod +x scripts/*.sh
```

#### 3. API Key Creation Fails

**Error**: `Unauthorized - No valid authentication provided`

**Solution**: This is expected if API keys already exist. The first API key creation doesn't require authentication, but subsequent ones do.

#### 4. Environment File Missing

**Warning**: `Environment file missing: SKIPPED`

**Solution**: Create a `.env.local` file with required environment variables (optional for basic testing).

#### 5. Cross-Platform Sync Fails

**Error**: `Farmovation API test: FAILED`

**Solutions**:

1. **Check Docker containers**:

   ```bash
   docker-compose ps
   docker-compose logs aabpashi-app
   ```

2. **Verify environment variables**:

   ```bash
   docker-compose exec aabpashi-app env | grep FARMOVATION
   ```

3. **Check API keys**:

   ```bash
   docker-compose exec aabpashi-app node scripts/generate-api-key.js list
   ```

4. **Test network connectivity**:
   ```bash
   curl -X GET https://api.farmovation.tech/health
   ```

### Debugging Failed Tests

1. **Check the detailed log files** in `test-results/` directory
2. **Verify server is running** and accessible
3. **Check environment variables** if tests are failing
4. **Review API responses** in the log files for specific error messages
5. **Check Docker container logs** for sync-related issues

## Manual Testing

### API Key Management

```bash
# Create admin API key
node scripts/generate-api-key.js create "Admin Key" "admin"

# List all API keys
node scripts/generate-api-key.js list

# Delete an API key
node scripts/generate-api-key.js delete <key-id>
```

### Testing API Endpoints

```bash
# Test API key authentication
curl -X POST http://localhost:3000/api/getfield \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId": "test123"}'

# Test sync endpoint
curl -X POST http://localhost:3000/api/sync/create-user \
  -H "X-API-Key: YOUR_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "phone": "+923001234567"}'
```

### Testing Cross-Platform Sync

```bash
# Test field mapping
node scripts/manage-field-mappers.js test farmovation

# Test platform connection
node scripts/manage-sync-platforms.js test

# Test complete sync flow
npx ts-node scripts/test-user-sync.js
```

## Continuous Integration

### GitHub Actions (Recommended)

Add this to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
      redis:
        image: redis:latest
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Setup environment
        run: cp env.example .env

      - name: Start server
        run: npm run dev &

      - name: Wait for server
        run: sleep 10

      - name: Run basic tests
        run: ./scripts/test-all.sh

      - name: Run cross-platform sync tests
        run: npx ts-node scripts/test-user-sync.js
        env:
          FARMOVATION_API_URL: ${{ secrets.FARMOVATION_API_URL }}
          FARMOVATION_API_KEY: ${{ secrets.FARMOVATION_API_KEY }}
```

### Pre-commit Hooks

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
./scripts/test-all.sh
npx ts-node scripts/test-user-sync.js
```

## Best Practices

### Before Running Tests

1. **Start the development server**: `npm run dev` or `npm run docker:dev`
2. **Check environment variables**: Ensure required APIs are configured
3. **Clear test data**: Remove any previous test artifacts
4. **Check dependencies**: Ensure all packages are installed
5. **Verify Docker containers**: Ensure all services are running

### After Running Tests

1. **Review results**: Check the summary report
2. **Investigate failures**: Look at detailed logs for specific issues
3. **Clean up**: Remove test artifacts and temporary files
4. **Document issues**: Note any recurring problems

### Regular Testing

- **Before commits**: Run `npm run test-all` and `npx ts-node scripts/test-user-sync.js`
- **Before deployments**: Run full test suite including cross-platform sync
- **After configuration changes**: Test affected components
- **Weekly**: Run comprehensive tests to catch regressions

## Test Data Management

### Temporary Files

Tests create temporary files that are automatically cleaned up:

- `.env.test`: Temporary API keys for testing
- `cookies.txt`: Session cookies for authentication tests
- `test-results/`: Test output and logs
- `field_mapping_test_*.json`: Field mapping test results

### Database Impact

Tests are designed to be non-destructive:

- API key tests use temporary keys
- Authentication tests don't create permanent users
- Sync tests use test data that can be safely deleted
- Cross-platform sync tests create test users that can be cleaned up

### Cleanup Procedures

```bash
# Clean up test data
docker-compose exec aabpashi-app node scripts/cleanup-test-data.js

# Remove test results
rm -rf test-results/*

# Reset API keys (if needed)
rm -f data/api-keys/api-keys.json
```

## Support

If you encounter issues with the testing suite:

1. **Check the troubleshooting section** above
2. **Review the detailed logs** in `test-results/`
3. **Verify your environment** matches the prerequisites
4. **Check Docker container status** for sync-related issues
5. **Create an issue** with the test output and error details

For questions about specific test behavior, refer to the individual test script files in the `scripts/` directory.

### Getting Help

- **Cross-Platform Sync Issues**: Check Docker logs and environment variables
- **API Key Problems**: Verify key creation and permissions
- **Authentication Failures**: Check server status and OTP configuration
- **Field Mapping Errors**: Review sync platform configuration
