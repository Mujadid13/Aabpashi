# 📘 AabPashi - Full Developer Documentation

AabPashi is a modern water resource and irrigation management platform built using Next.js and TypeScript. It provides spatial analysis, secure user authentication, multilingual interfaces, and real-time environmental insights for improved agricultural decisions.

---

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Installation & Setup](#installation--setup)
6. [Docker Setup](#docker-setup)
7. [Environment Variables](#environment-variables)
8. [Authentication & Security](#authentication--security)
9. [API Key System](#api-key-system)
10. [Cross-Platform Sync](#cross-platform-sync)
11. [Testing](#testing)
12. [Scripts](#scripts)
13. [Docker Commands](#docker-commands)
14. [Folder Structure](#folder-structure)
15. [Linting & Formatting](#linting--formatting)
16. [Documentation](#documentation)
17. [Changelog](#changelog)

---

## 🧾 Project Overview

**AabPashi** helps users manage farms, monitor water stress, draw custom irrigation areas on the map, and automate irrigation suggestions using geospatial intelligence and real-time weather data.

---

## 🌟 Features

- Interactive field mapping with Leaflet
- Polygon drawing tools for irrigation zones
- **Dual Authentication System**: JWT-based + API key authentication
- **Cross-Platform User Sync**: Automated user database synchronization with Farmovation User Server
- **Granular API Permissions**: Role-based access control for API keys
- Urdu + English multilingual UI support
- Environment-aware secure middleware (`middleware.ts`)
- Modular component design
- Weather and water stress visual overlays
- **Comprehensive Testing Suite**: Automated test scripts for all features
- **Hot Reload Development**: Docker-based development with live code updates

---

## 🏗 Architecture

```text
Next.js (App Router)
├── Pages & Routes
├── Components
├── Middleware (Auth Guards)
├── API Layer (External APIs + Custom Logic)
├── API Key Management System
├── Cross-Platform Sync System
└── Static Map & GeoTools Integration
```

- **Frontend**: Next.js using file-based routing and React components
- **Maps**: Leaflet + Draw plugin for geospatial drawing
- **Auth**: Middleware-secured routes using tokens and cookies
- **API Keys**: File-based storage with permission system
- **Sync**: Non-blocking cross-platform user synchronization
- **Styling**: Tailwind CSS (with PostCSS config)

---

## 🛠 Technology Stack

| Layer      | Tool / Library          |
| ---------- | ----------------------- |
| Framework  | Next.js (React + SSR)   |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| Animations | GSAP, Framer Motion     |
| Maps       | Leaflet.js              |
| Auth       | JWT, Cookie Storage     |
| API Keys   | File-based storage      |
| i18n       | Custom hook-based i18n  |
| Testing    | Shell scripts + curl    |
| Linting    | ESLint                  |
| Formatting | Prettier                |
| Container  | Docker + Docker Compose |

---

## ⚙️ Getting Started

### Option 1: Docker Setup (Recommended)

#### 1. Clone the repo

```bash
git clone https://github.com/your-org/AaabPashi-web.git
cd AaabPashi-web
```

#### 2. Set up environment

Copy the environment file and configure it:

```bash
# Copy environment template
cp env.example .env

# Edit with your actual values
nano .env
```

#### 3. Deploy the application

```bash
# Full deployment with health checks
npm run deploy

# Quick deployment (skip health checks)
npm run deploy:quick

# Deploy and show logs
npm run deploy:logs
```

#### 4. Access the application

- **App**: http://localhost:3000
- **MongoDB Express**: http://localhost:8081
- **Redis Commander**: http://localhost:8082

#### 5. Initialize API Key System

```bash
# Create initial admin API key
docker-compose exec aabpashi-app node scripts/generate-api-key.js create "Admin Key" "admin"

# Create API key for cross-platform sync
docker-compose exec aabpashi-app node scripts/generate-api-key.js create "Sync Key" "admin"
```

#### 6. Configure Multi-Platform Sync

```bash
# List current sync platforms
docker-compose exec aabpashi-app node scripts/manage-sync-platforms.js list

# Enable/disable platforms
docker-compose exec aabpashi-app node scripts/manage-sync-platforms.js enable farmovation
```

#### 7. Test Cross-Platform Sync

```bash
# Test the complete sync system
docker-compose exec aabpashi-app npx ts-node scripts/test-user-sync.js
```

### Option 2: Local Development

#### 1. Clone the repo

```bash
git clone https://github.com/your-org/AaabPashi-web.git
cd AaabPashi-web
```

#### 2. Install dependencies

```bash
npm install
# or
yarn
```

#### 3. Set up environment

Create a `.env.local` file based on the sample:

```env
# Core API Keys
VEEVO_API_KEY=your_veevo_api_key
GOOGLE_CLOUD_API_KEY=your_google_translate_api_key
JWT_SECRET=your_jwt_secret_key

# External API URLs
NEXT_PUBLIC_PYTHON_API_URL=your_python_api_url
NEXT_PUBLIC_PYTHON_API_URL1=your_secondary_python_api_url
NEXT_PUBLIC_GEE_API_URL=your_google_earth_engine_api_url

# Multi-Platform Sync Configuration
# ===================================================================

# Farmovation Platform
FARMOVATION_API_URL=https://api.farmovation.tech
FARMOVATION_API_KEY=your-farmovation-api-key-here

# Water Management Platform
WATER_MANAGEMENT_API_URL=https://api.water-management.com
WATER_MANAGEMENT_API_KEY=your-water-management-api-key-here

# Irrigation Analytics Platform (optional)
IRRIGATION_ANALYTICS_API_URL=https://api.irrigation-analytics.com
IRRIGATION_ANALYTICS_API_KEY=your-irrigation-analytics-api-key-here
```

#### 4. Initialize API Key System

```bash
# Create initial admin API key
node scripts/generate-api-key.js create "Admin Key" "admin"

# Create API key for cross-platform sync
node scripts/generate-api-key.js create "Sync Key" "admin"
```

#### 5. Configure Multi-Platform Sync

```bash
# List current sync platforms
node scripts/manage-sync-platforms.js list

# Enable/disable platforms
node scripts/manage-sync-platforms.js enable farmovation
node scripts/manage-sync-platforms.js disable water_management

# Add a new platform
node scripts/manage-sync-platforms.js add new_platform "New Platform Name"

# Update global settings
node scripts/manage-sync-platforms.js global defaultTimeout 45000
```

#### 6. Test Cross-Platform Sync

```bash
# Test the complete sync system
npx ts-node scripts/test-user-sync.js
```

#### 7. Run the app

```bash
npm run dev
# or
yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Setup

### Overview

The project includes a comprehensive Docker setup with hot reload development capabilities. The system supports both production deployment and development with live code updates.

### Key Features

- **Hot Reload Development**: Live code updates during development
- **Single Configuration**: One docker-compose file for all deployments
- **Environment-Driven**: All settings configured via environment variables
- **No Hardcoded Secrets**: All sensitive data comes from environment variables
- **Easy Deployment**: Simple deploy script for system updates
- **Health Checks**: Built-in health monitoring for all services
- **Persistent Data**: Volumes for database and application data
- **Management Tools**: MongoDB Express and Redis Commander included

### Services

| Service           | Description           | Ports |
| ----------------- | --------------------- | ----- |
| `aabpashi-app`    | Next.js application   | 3000  |
| `mongodb`         | MongoDB database      | 27017 |
| `redis`           | Redis cache           | 6379  |
| `mongo-express`   | MongoDB management UI | 8081  |
| `redis-commander` | Redis management UI   | 8082  |

### Development vs Production

#### Development Mode (Hot Reload)

```bash
# Start in development mode with hot reload
npm run docker:dev

# Or manually
docker-compose -f docker-compose.yml up -d
```

**Features**:

- Live code updates
- Source code mounted as volume
- Development server with hot reload
- Debug-friendly configuration

#### Production Mode

```bash
# Start in production mode
npm run deploy

# Or manually
docker-compose -f docker-compose.yml up -d
```

**Features**:

- Optimized builds
- No source code mounting
- Production server
- Health checks enabled

### Environment Configuration

The system uses a single `.env` file for all configuration:

```bash
# Copy environment template
cp env.example .env

# Edit with your actual values
nano .env
```

### Environment Variables

All configuration is handled through environment variables:

| Category            | Variables                                                                   |
| ------------------- | --------------------------------------------------------------------------- |
| **Container Names** | `MONGO_CONTAINER_NAME`, `REDIS_CONTAINER_NAME`, `APP_CONTAINER_NAME`        |
| **Ports**           | `APP_PORT`, `MONGO_PORT`, `REDIS_PORT`, `MONGO_EXPRESS_PORT`                |
| **MongoDB**         | `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `MONGO_DATABASE`, `MONGO_URI` |
| **Redis**           | `REDIS_URL`, `REDIS_COMMANDER_HOSTS`                                        |
| **Application**     | `NODE_ENV`, `SOURCE_CODE_MOUNT`                                             |
| **Resources**       | `MONGO_MEMORY_LIMIT`, `APP_MEMORY_LIMIT`, `REDIS_MEMORY_LIMIT`              |
| **API Keys**        | `VEEVO_API_KEY`, `GOOGLE_CLOUD_API_KEY`, `JWT_SECRET`                       |
| **External APIs**   | `NEXT_PUBLIC_PYTHON_API_URL`, `NEXT_PUBLIC_GEE_API_URL`                     |
| **Sync Platforms**  | `FARMOVATION_API_URL`, `FARMOVATION_API_KEY`                                |

### Data Persistence

The following data is persisted across container restarts:

- **MongoDB Data**: `mongodb_data` volume
- **Redis Data**: `redis_data` volume
- **Application Data**: `aabpashi_data` volume
- **Logs**: `aabpashi_logs` volume

### Deployment

#### Quick Start

```bash
# Deploy with full health checks
npm run deploy

# Quick deploy (skip health checks)
npm run deploy:quick

# Deploy and show logs
npm run deploy:logs

# Development mode with hot reload
npm run docker:dev
```

#### Manual Deployment

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f aabpashi-app

# Run commands in container
docker-compose exec aabpashi-app npm run test-all

# Test cross-platform sync
docker-compose exec aabpashi-app npx ts-node scripts/test-user-sync.js

# Restart app after code changes
docker-compose restart aabpashi-app

# Stop all services
docker-compose down
```

### System Updates

When you need to update the system (code changes, new features, etc.):

```bash
# Full rebuild and restart
npm run deploy

# Or manually
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Troubleshooting

#### Common Issues

1. **Missing .env file**: Copy `env.example` to `.env` and configure
2. **Port Conflicts**: Change ports in `.env` file
3. **Memory Issues**: Adjust memory limits in `.env` file
4. **Permission Issues**: Ensure Docker has proper permissions
5. **Build Failures**: Check Dockerfile and build context
6. **Hot Reload Not Working**: Ensure `SOURCE_CODE_MOUNT=true` in `.env`

#### Useful Commands

```bash
# Check container status
docker-compose ps

# View resource usage
docker stats

# Access container shell
docker-compose exec aabpashi-app bash

# Rebuild containers
docker-compose build --no-cache

# Clean up volumes
docker-compose down -v

# Test cross-platform sync
docker-compose exec aabpashi-app npx ts-node scripts/test-user-sync.js
```

---

## 🔐 Authentication & Security

### Dual Authentication System

The platform supports two authentication methods:

#### 1. JWT-based Authentication (Primary)

- Phone number + OTP verification
- HTTP-only cookies for security
- 30-day token expiration
- Automatic token refresh

#### 2. API Key Authentication (Alternative)

- Programmatic access for integrations
- Granular permission system
- User association capabilities
- Optional expiration dates

### Security Features

- **Input Sanitization**: All inputs are sanitized to prevent injection attacks
- **HTTP-Only Cookies**: Authentication tokens stored securely
- **CORS Protection**: Configured for production environment
- **Rate Limiting**: OTP endpoints have rate limiting (5 minutes)
- **Environment Variables**: Sensitive data stored in environment variables
- **API Key Security**: Cryptographically secure keys with prefixes
- **Permission-based Access**: Granular permissions for API key users
- **User Association**: API keys can be restricted to specific users
- **Key Expiration**: Optional expiration dates for temporary access
- **Key Regeneration**: Ability to rotate keys without changing metadata

---

## 🔑 API Key System

### Overview

The API key system provides secure programmatic access to the platform's APIs with granular permissions and user association capabilities.

### Key Features

- **File-based Storage**: API keys stored in `data/api-keys/api-keys.json`
- **Permission System**: Granular permissions (read, write, admin, delete)
- **User Association**: API keys can be associated with specific users
- **Expiration Support**: Optional expiration dates for temporary access
- **Key Regeneration**: Ability to regenerate keys without changing metadata

### CLI Management Tool

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

### API Key Endpoints

| Endpoint                              | Method | Description                     |
| ------------------------------------- | ------ | ------------------------------- |
| `/api/admin/api-keys`                 | GET    | List all API keys (admin only)  |
| `/api/admin/api-keys`                 | POST   | Create new API key (admin only) |
| `/api/admin/api-keys/[id]`            | GET    | Get specific API key details    |
| `/api/admin/api-keys/[id]`            | PUT    | Update API key properties       |
| `/api/admin/api-keys/[id]`            | DELETE | Delete an API key               |
| `/api/admin/api-keys/[id]/revoke`     | POST   | Revoke (deactivate) an API key  |
| `/api/admin/api-keys/[id]/regenerate` | POST   | Regenerate an API key           |

### Authentication Headers

API keys can be provided in two ways:

```bash
# Method 1: Authorization header
Authorization: Bearer aabpashi_1234567890abcdef...

# Method 2: X-API-Key header
X-API-Key: aabpashi_1234567890abcdef...
```

### Permissions

- **read**: Read access to API endpoints
- **write**: Write access to API endpoints
- **admin**: Full administrative access (includes all other permissions)
- **delete**: Delete access to resources

---

## 🔄 Cross-Platform Sync

### Overview

The cross-platform sync system enables automatic user database synchronization between AabPashi and multiple external platforms and services. **Currently tested and working with Farmovation User Server**.

### ✅ Verified Integration

**Farmovation User Server**: Successfully tested and validated

- **Endpoint**: `https://api.farmovation.tech/api/v1/sync/create-user`
- **Status**: ✅ Fully operational
- **Test Results**: End-to-end sync validation completed
- **User Creation**: Verified in Farmovation system

### Features

- **Multi-Platform Support**: Sync to multiple platforms simultaneously
- **Field Mapping System**: Automatic data format adaptation for each platform
- **Uniform Endpoint Structure**: Consistent API endpoints across all platforms
- **Non-blocking Operations**: Sync operations don't delay main app responses
- **API Key Protected**: All sync endpoints require API key authentication
- **Automatic Triggers**: User creation automatically triggers sync to all enabled platforms
- **Error Handling**: Failed sync operations are logged but don't affect main operations
- **Retry Logic**: Exponential backoff retry with configurable policies
- **Concurrent Sync**: Multiple platforms synced in parallel
- **Flexible Configuration**: Platform-specific URLs, API keys, and settings
- **Health Monitoring**: Connection testing and platform status monitoring

### Sync Endpoints

| Endpoint                | Method | Description                          |
| ----------------------- | ------ | ------------------------------------ |
| `/api/sync/create-user` | POST   | Create/upsert user in local database |
| `/api/sync/update-user` | POST   | Update user in local database        |
| `/api/sync/delete-user` | POST   | Delete user from local database      |

### Documentation Endpoints

| Endpoint       | Method | Description                          |
| -------------- | ------ | ------------------------------------ |
| `/api/docs`    | GET    | Interactive Swagger UI documentation |
| `/api/openapi` | GET    | OpenAPI 3.0 specification (JSON)     |

### Configuration

#### Environment Variables

Add platform-specific environment variables to your `.env.local`:

```env
# Multi-Platform Sync Configuration
# ===================================================================

# Farmovation Platform (Tested & Working)
FARMOVATION_API_URL=https://api.farmovation.tech
FARMOVATION_API_KEY=your-farmovation-api-key-here

# Water Management Platform
WATER_MANAGEMENT_API_URL=https://api.water-management.com
WATER_MANAGEMENT_API_KEY=your-water-management-api-key-here

# Add more platforms as needed...
```

#### Platform Configuration

The sync platforms are configured in `config/sync-platforms.json`:

```json
{
  "platforms": [
    {
      "name": "farmovation",
      "displayName": "Farmovation User Server",
      "enabled": true,
      "baseUrlEnvVar": "FARMOVATION_API_URL",
      "apiKeyEnvVar": "FARMOVATION_API_KEY",
      "timeout": 30000,
      "retryPolicy": {
        "maxAttempts": 3,
        "backoffMultiplier": 2,
        "initialDelayMs": 1000
      }
    }
  ]
}
```

### Management Commands

```bash
# List all platforms and their status
node scripts/manage-sync-platforms.js list

# Enable/disable platforms
node scripts/manage-sync-platforms.js enable farmovation
node scripts/manage-sync-platforms.js disable water_management

# Add a new platform
node scripts/manage-sync-platforms.js add new_platform "New Platform Name"

# Remove a platform
node scripts/manage-sync-platforms.js remove irrigation_analytics

# Update global settings
node scripts/manage-sync-platforms.js global defaultTimeout 45000
```

### Field Mapping Management

```bash
# List all available field mappers
npm run mappers:list

# Get detailed info about a specific mapper
npm run mappers:info farmovation

# Test field mapping with sample data
npm run mappers:test water_management

# Create a new custom field mapper
npm run mappers:create custom_platform "Custom Platform"
```

### Usage Example

```javascript
// User creation automatically triggers sync to all enabled platforms
import { syncUserCreate } from "@/lib/sync-multi";

// After successful user registration
await syncUserCreate({
  name: "John Doe",
  phone: "+923001234567",
  city: "Lahore",
  division: "Kasur",
  role: "Farmer",
  // ... other user data
});

// Test platform connections
import { testPlatformConnections } from "@/lib/sync-multi";
const results = await testPlatformConnections();
console.log(
  `Connected to ${results.filter((r) => r.success).length} platforms`
);
```

### Testing Cross-Platform Sync

```bash
# Test the complete sync system
npx ts-node scripts/test-user-sync.js

# Expected output:
# ✅ AabPashi sync API test: PASSED
# ✅ Farmovation API test: PASSED
# ✅ User verified in Farmovation system
```

---

## 🧪 Testing

### Test Scripts

The project includes comprehensive test scripts for all major features:

#### 1. Master Test Suite

```bash
# Run all tests
./scripts/test-all.sh
```

#### 2. Individual Test Scripts

```bash
# Test API key system
./scripts/test-api-keys.sh

# Test authentication flow
./scripts/test-auth-flow.sh

# Test cross-platform sync
npx ts-node scripts/test-user-sync.js
```

### Test Coverage

- **API Key System**: Creation, authentication, management, permissions
- **Authentication Flow**: Signup, OTP, login, logout, rate limiting
- **Cross-Platform Sync**: End-to-end sync validation with external platforms
- **Input Validation**: Phone numbers, required fields, data formats
- **Environment Setup**: Configuration files, dependencies

### Test Results

Test results are saved to `test-results/` directory with timestamps:

- `test_report_YYYYMMDD_HHMMSS.txt`: Summary report
- `API_Key_System_YYYYMMDD_HHMMSS.log`: Detailed API key test logs
- `Authentication_Flow_YYYYMMDD_HHMMSS.log`: Detailed auth test logs
- `field_mapping_test_YYYY-MM-DDTHH-MM-SS-sssZ.json`: Field mapping test results

### Running Tests

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Run complete test suite
./scripts/test-all.sh

# Run specific test
./scripts/test-api-keys.sh

# Test cross-platform sync
npx ts-node scripts/test-user-sync.js
```

---

## 📜 Scripts

| Script                  | Description                  |
| ----------------------- | ---------------------------- |
| `dev`                   | Run dev server (localhost)   |
| `build`                 | Compile for production       |
| `start`                 | Start production server      |
| `lint`                  | Run ESLint on the code       |
| `format`                | Format code using Prettier   |
| `test-all`              | Run complete test suite      |
| `test-api-keys`         | Test API key system          |
| `test-auth`             | Test authentication flow     |
| `migrate:users`         | Migrate users to Farmovation |
| `migrate:users:dry-run` | Test migration (dry run)     |
| `docker:dev`            | Start Docker in dev mode     |
| `deploy`                | Deploy with health checks    |
| `deploy:quick`          | Quick deployment             |

## 🐳 Docker Commands

### NPM Scripts (Recommended)

| Script                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| `npm run deploy`         | Full deployment with health checks          |
| `npm run deploy:quick`   | Quick deployment (skip health checks)       |
| `npm run deploy:logs`    | Deploy and show logs                        |
| `npm run docker:dev`     | Start in development mode (hot reload)      |
| `npm run docker:up`      | Start all containers                        |
| `npm run docker:down`    | Stop all containers                         |
| `npm run docker:logs`    | View app logs                               |
| `npm run docker:restart` | Restart app container                       |
| `npm run docker:build`   | Rebuild containers (no cache)               |
| `npm run docker:clean`   | Stop containers and clean up volumes/images |

### Direct Docker Commands

| Command                                 | Description                |
| --------------------------------------- | -------------------------- |
| `docker-compose up -d`                  | Start all containers       |
| `docker-compose down`                   | Stop all containers        |
| `docker-compose logs -f aabpashi-app`   | View app logs              |
| `docker-compose exec aabpashi-app bash` | Access app container shell |
| `docker-compose restart aabpashi-app`   | Restart app container      |
| `docker-compose ps`                     | List running containers    |
| `docker-compose build --no-cache`       | Rebuild all images         |

---

## 🗂 Folder Structure

```text
AabPashi/
├── app/                    # Entry pages and layout
│   ├── api/               # API routes
│   │   ├── admin/         # API key management
│   │   └── sync/          # Cross-platform sync
│   └── [locale]/          # Localized pages
├── components/            # Shared React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (API, helpers)
│   ├── api-key.ts         # API key management
│   ├── sync-multi.ts      # Cross-platform sync
│   ├── sync-field-mappers.ts # Field mapping
│   └── auth-utils.ts      # Authentication utilities
├── scripts/               # Test and utility scripts
│   ├── test-user-sync.js  # Cross-platform sync testing
│   └── test-all.sh        # Master test suite
├── data/                  # Data files
│   └── api-keys/          # API key storage
├── config/                # Configuration files
│   └── sync-platforms.json # Platform sync config
├── public/                # Static files (images, icons)
├── middleware.ts          # Auth protection logic
├── next.config.js         # Config for Next.js
└── .env.local             # Local environment vars
```

---

## 🔐 Authentication Flow

1. **User Registration**: Submit phone number and user details to get OTP
2. **OTP Verification**: Verify OTP to complete registration and get auth tokens
3. **User Login**: Submit phone number to get OTP for existing users
4. **OTP Verification**: Verify OTP to complete login and get auth tokens
5. **Logout**: Clear authentication tokens
6. **Cross-Platform Sync**: User creation automatically triggers sync to remote apps

### Authentication Priority

1. API key authentication is checked first
2. If API key fails, JWT authentication is attempted
3. If both fail, request is rejected with 401 Unauthorized

---

## 🧪 Linting & Formatting

```bash
npm run lint       # uses .eslintrc.json
npm run format     # uses Prettier rules
```

Ensure consistency before pushing to Git.

---

## 📚 Documentation

### Core Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [OpenAPI Specification](./docs/openapi.yaml) - Swagger documentation
- [API Key System Guide](./docs/API-KEY-SYSTEM.md) - Detailed API key management
- [Testing Guide](./docs/TESTING.md) - Testing procedures and best practices
- [User Migration Guide](./docs/USER-MIGRATION.md) - One-time user migration to Farmovation

### Interactive Documentation

- **Swagger UI**: Visit `/docs` for interactive API documentation
- **OpenAPI Spec**: Access `/api/openapi` for machine-readable API schema

### Documentation Overview

See [docs/README.md](./docs/README.md) for a complete overview of all documentation files and how to use them.

## 📋 Changelog

### Recent Changes

For detailed information about changes in the current branch compared to main, see:

- **[Changelog: User Database Sync Branch](./docs/CHANGELOG-user-db-sync.md)** - Comprehensive overview of all changes in the `user-db-sync` branch

### Key Features Added

- **API Key Authentication System**: Enterprise-grade API key management with permissions
- **Cross-Platform User Sync**: Automated user synchronization with Farmovation User Server (✅ Tested & Working)
- **Enhanced Documentation**: Interactive Swagger UI and comprehensive API docs
- **Comprehensive Testing**: Automated test suite for all features including cross-platform sync
- **Security Enhancements**: Dual authentication and permission controls
- **Hot Reload Development**: Docker-based development with live code updates

### Latest Updates

- **Cross-Platform Sync Testing**: End-to-end validation with Farmovation User Server completed
- **Docker Development Mode**: Hot reload development environment implemented
- **Field Mapping Validation**: Verified data transformation between platforms
- **User Creation Verification**: Confirmed successful user creation in external systems

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `./scripts/test-all.sh`
4. Test cross-platform sync: `npx ts-node scripts/test-user-sync.js`
5. Ensure all tests pass
6. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
