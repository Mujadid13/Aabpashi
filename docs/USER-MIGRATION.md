# AabPashi User Migration Guide

This document describes the one-time migration process for transferring all existing users from the AabPashi MongoDB database to the Farmovation User Server using the REST API routes.

## ⚠️ Important Notice

**This is a ONE-TIME operation.** Once completed, this migration should not be run again to avoid duplicate users or data conflicts.

## 📋 Prerequisites

Before running the migration, ensure you have:

1. **Database Backup**: Complete backup of your AabPashi MongoDB database
2. **Farmovation API Access**: Valid API credentials for Farmovation User Server
3. **Environment Configuration**: Proper `.env` file with all required variables
4. **Network Connectivity**: Stable connection to both MongoDB and Farmovation API
5. **Sufficient Time**: Migration may take several hours depending on user count

## 🔧 Setup

### 1. Environment Configuration

Ensure your `.env` file contains the required variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://admin:password@localhost:27017/WaterVation?authSource=admin

# Farmovation API Configuration
FARMOVATION_API_URL=https://user-server.sam.farmovation.tech/api/v1
FARMOVATION_API_KEY=your-farmovation-api-key-here
```

### 2. Install Dependencies

The migration script requires additional dependencies:

```bash
npm install axios ts-node
```

### 3. Verify API Access

Test your Farmovation API connection:

```bash
curl -X GET "${FARMOVATION_API_URL}/api/health" \
  -H "X-API-Key: ${FARMOVATION_API_KEY}"
```

## 🚀 Migration Process

### Step 1: Dry Run (Recommended)

Always perform a dry run first to validate the migration process:

```bash
# Run dry run
npm run migrate:users:dry-run

# Or with custom batch size
./scripts/migrate-users.sh --dry-run --batch-size=25
```

The dry run will:

- Connect to your MongoDB database
- Fetch all users
- Validate user data
- Simulate API calls (without actually creating users)
- Generate a detailed report

### Step 2: Review Dry Run Results

Check the generated files:

- `migration-YYYY-MM-DD-XXXXXXXX.log` - Detailed execution log
- `migration-results-YYYY-MM-DD-XXXXXXXX.json` - Complete results with statistics

Review for:

- Number of users found
- Validation errors
- Expected API responses
- Performance metrics

### Step 3: Perform Actual Migration

Once satisfied with the dry run results:

```bash
# Run migration with confirmation prompt
npm run migrate:users

# Or run without confirmation (for automated scripts)
npm run migrate:users:confirm

# With custom batch size
./scripts/migrate-users.sh --batch-size=25 --confirm
```

## 📊 Migration Statistics

The migration script provides detailed statistics:

| Metric          | Description                                       |
| --------------- | ------------------------------------------------- |
| **Total Users** | Total number of users found in database           |
| **Successful**  | Users successfully migrated to Farmovation        |
| **Failed**      | Users that failed to migrate (with error details) |
| **Skipped**     | Users skipped due to validation errors            |
| **Duration**    | Total time taken for migration                    |

## 🔍 User Data Mapping

The migration script maps AabPashi user fields to Farmovation User Server format using the field mappers defined in `lib/sync-field-mappers.ts`.

### Field Mapping Table

| AabPashi Field | Farmovation Field     | Mapping Logic                                   | Example                                                     |
| -------------- | --------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| `_id`          | `originalId`          | Direct mapping, fallback to `aabpashi-<phone>`  | `"507f1f77bcf86cd799439011"` → `"507f1f77bcf86cd799439011"` |
| `name`         | `userData.first_name` | First word of name                              | `"John Doe"` → `"John"`                                     |
| `name`         | `userData.last_name`  | Remaining words after first space               | `"John Doe"` → `"Doe"`                                      |
| `phone`        | `userData.mobile`     | Digits only (remove +, spaces, etc.)            | `"+923001234567"` → `"3001234567"`                          |
| `phone`        | `userData.email`      | Generated as `<digits>@aabpashi.com`            | `"+923001234567"` → `"3001234567@aabpashi.com"`             |
| -              | `operation`           | `"create"` for creation, `"update"` for updates | `"create"` / `"update"`                                     |
| -              | `timestamp`           | Current ISO string                              | `"2025-07-10T14:06:50.000Z"`                                |

### Supported Operations

The Farmovation User Server supports three sync operations:

#### 1. Create User (`POST /api/v1/sync/create-user`)

- **Operation**: `"create"`
- **Required fields**: `userData`, `originalId`, `operation`, `timestamp`

#### 2. Update User (`PUT /api/v1/sync/update-user`)

- **Operation**: `"update"`
- **Required fields**: `userData`, `originalId`, `operation`, `timestamp`

#### 3. Delete User (`DELETE /api/v1/sync/delete-user`)

- **Operation**: No operation field required
- **Required fields**: `originalId`, `verificationData`

### AabPashi User Structure

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "phone": "+923001234567",
  "city": "Lahore",
  "division": "Kasur",
  "role": "Farmer",
  "farmsize": "5-10 acres",
  "country": "Pakistan",
  "receiverNetwork": "Jazz",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Farmovation User Structure (via API)

```json
{
  "userData": {
    "email": "3001234567@aabpashi.com",
    "mobile": "3001234567",
    "first_name": "John",
    "last_name": "Doe"
  },
  "originalId": "507f1f77bcf86cd799439011",
  "operation": "create",
  "timestamp": "2025-07-10T14:06:50.000Z"
}
```

### Additional Platform Mappings

The system also supports mapping to other platforms:

#### Farmovation Marketplace Platform

- Maps users as sellers with business profiles
- Includes location, business details, and marketplace status
- See `farmovationMarketplaceMapper` in `lib/sync-field-mappers.ts`

#### Generic Platform

- Standardized mapping for unknown platforms
- Preserves all original fields with minimal transformation
- See `genericMapper` in `lib/sync-field-mappers.ts`

## ⚙️ Configuration Options

### Batch Processing

Control the migration speed and API load:

```bash
# Default batch size (50 users)
npm run migrate:users

# Smaller batches for slower systems
./scripts/migrate-users.sh --batch-size=25

# Larger batches for faster systems
./scripts/migrate-users.sh --batch-size=100
```

### Timing Controls

The script includes built-in delays to prevent API overload:

- **Between Users**: 100ms delay
- **Between Batches**: 1 second delay
- **Retry Delay**: 2 seconds between retries
- **Max Retries**: 3 attempts per user

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error**: `Failed to connect to MongoDB`

**Solution**:

- Verify `MONGO_URI` in `.env` file
- Check MongoDB service is running
- Ensure network connectivity
- Verify authentication credentials

#### 2. API Authentication Errors

**Error**: `401 Unauthorized` or `403 Forbidden`

**Solution**:

- Verify `FARMOVATION_API_KEY` is correct
- Check API key permissions
- Ensure API key is active and not expired
- Test API access manually

#### 3. Validation Errors

**Error**: `Validation failed: Missing or empty name`

**Solution**:

- Review user data quality in database
- Clean up invalid user records
- Update migration script validation rules if needed

#### 4. Network Timeouts

**Error**: `Request timeout` or `Connection timeout`

**Solution**:

- Increase timeout values in script
- Check network stability
- Reduce batch size
- Add retry logic

### Debug Mode

Enable detailed logging:

```bash
# Set debug environment variable
export DEBUG=true

# Run migration with debug output
npm run migrate:users
```

## 📁 Output Files

### Log Files

- **Location**: Project root directory
- **Format**: `migration-YYYY-MM-DD-XXXXXXXX.log`
- **Content**: Detailed execution log with timestamps

### Results Files

- **Location**: Project root directory
- **Format**: `migration-results-YYYY-MM-DD-XXXXXXXX.json`
- **Content**: Complete migration results and statistics

### Sample Results Structure

```json
{
  "stats": {
    "total": 1250,
    "successful": 1245,
    "failed": 3,
    "skipped": 2,
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T11:30:00.000Z",
    "duration": 5400000
  },
  "results": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "phone": "+923001234567",
      "name": "John Doe",
      "success": true,
      "responseTime": 245,
      "timestamp": "2024-01-15T10:00:15.000Z"
    }
  ],
  "config": {
    "batchSize": 50,
    "dryRun": false,
    "maxRetries": 3
  },
  "timestamp": "2024-01-15T11:30:00.000Z"
}
```

## 🔒 Security Considerations

### Data Protection

- **API Keys**: Store securely in `.env` file (never commit to version control)
- **Database Access**: Use read-only database user if possible
- **Network Security**: Use HTTPS for all API communications
- **Log Files**: Review and secure log files containing sensitive data

### Access Control

- **API Permissions**: Ensure API key has appropriate permissions
- **Database Permissions**: Limit database access to necessary collections
- **Audit Trail**: Keep migration logs for audit purposes

## 📞 Support

If you encounter issues during migration:

1. **Check Logs**: Review detailed log files for error messages
2. **Validate Data**: Ensure user data meets validation requirements
3. **Test API**: Verify Farmovation API access independently
4. **Contact Support**: Reach out to Farmovation team for API issues

## ✅ Post-Migration Verification

After successful migration:

1. **Verify User Count**: Compare user counts between systems
2. **Sample Validation**: Check a few migrated users in Farmovation
3. **Data Integrity**: Verify critical fields are correctly mapped
4. **API Testing**: Test user operations in Farmovation system
5. **Backup Results**: Archive migration logs and results

## 🔄 Rollback Plan

In case of issues requiring rollback:

1. **Stop Migration**: Immediately stop the migration script
2. **Assess Impact**: Review failed migrations and partial successes
3. **Contact Farmovation**: Coordinate with Farmovation team for cleanup
4. **Data Recovery**: Use database backup if necessary
5. **Re-run Migration**: After fixing issues, re-run with corrected configuration

---

**Remember**: This is a one-time operation. Take your time to prepare and test thoroughly before running the actual migration.
