# AabPashi Web - Software Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Application Layers](#application-layers)
5. [Data Architecture](#data-architecture)
6. [Authentication & Security](#authentication--security)
7. [API Architecture](#api-architecture)
8. [Frontend Architecture](#frontend-architecture)
9. [Geospatial Architecture](#geospatial-architecture)
10. [Internationalization](#internationalization)
11. [Cross-Platform Sync](#cross-platform-sync)
12. [Deployment Architecture](#deployment-architecture)
13. [Testing Architecture](#testing-architecture)
14. [Performance & Scalability](#performance--scalability)
15. [Security Considerations](#security-considerations)
16. [Monitoring & Logging](#monitoring--logging)

---

## Project Overview

**AabPashi** is a comprehensive water resource and irrigation management platform designed for agricultural communities in Pakistan. The system provides spatial analysis, secure user authentication, multilingual interfaces, and real-time environmental insights for improved agricultural decisions.

### Core Capabilities

- **Interactive Field Mapping**: Geospatial field management with polygon drawing tools
- **Water Resource Management**: Canal monitoring, water release scheduling, and stress analysis
- **Weather Integration**: Real-time weather data and forecasting
- **Multi-Platform Sync**: Automated user synchronization across agricultural platforms
- **Multilingual Support**: English and Urdu interfaces with RTL support
- **Mobile-First Design**: Progressive Web App (PWA) with offline capabilities

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser / Mobile App (PWA)                                 │
│  ├── React Components (Next.js)                                 │
│  ├── Leaflet Maps (Geospatial)                                  │
│  ├── Internationalization (next-intl)                           │
│  └── Progressive Web App Features                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router                                             │
│  ├── API Routes (RESTful)                                       │
│  ├── Middleware (Auth, i18n)                                    │
│  ├── Server Components                                          │
│  └── Client Components                                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Service Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Core Services                                                  │
│  ├── Authentication Service (JWT + API Keys)                    │
│  ├── Geospatial Service (Leaflet + GEE)                         │
│  ├── Translation Service (Google Translate)                     │
│  ├── SMS Service (Veevo API)                                    │
│  ├── Weather Service (Open-Meteo)                               │
│  └── Sync Service (Multi-Platform)                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│  Primary Storage                                                │
│  ├── MongoDB (User Data, Fields, Geospatial)                    │
│  └── Redis (Caching, Sessions, OTP)                             │
│                                                                 │
│  External APIs                                                  │
│  ├── Google Earth Engine (Satellite Data)                       │
│  ├── Open-Meteo (Weather Data)                                  │
│  ├── Google Translate (Localization)                            │
│  ├── Veevo (SMS Delivery)                                       │
│  └── Farmovation Platforms (User Sync)                          │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
2. **Microservices Ready**: Modular design allowing future service extraction
3. **API-First**: RESTful APIs with comprehensive documentation
4. **Security by Design**: Multi-layered authentication and authorization
5. **Scalability**: Horizontal scaling capabilities with containerization
6. **Internationalization**: Built-in support for multiple languages and cultures

---

## Technology Stack

### Frontend Technologies

| Component            | Technology                 | Version | Purpose                         |
| -------------------- | -------------------------- | ------- | ------------------------------- |
| **Framework**        | Next.js                    | 14.2.23 | React framework with SSR/SSG    |
| **Language**         | TypeScript                 | 5.7.3   | Type-safe JavaScript            |
| **Styling**          | Tailwind CSS               | 3.4.1   | Utility-first CSS framework     |
| **Maps**             | Leaflet.js                 | 1.9.4   | Interactive maps and geospatial |
| **State Management** | React Hooks                | 18.2.0  | Local state and custom hooks    |
| **Animations**       | Framer Motion              | 12.4.10 | Smooth UI animations            |
| **Charts**           | Chart.js + react-chartjs-2 | 5.3.0   | Data visualization              |
| **UI Components**    | Radix UI                   | Various | Accessible component primitives |

### Backend Technologies

| Component             | Technology      | Version | Purpose              |
| --------------------- | --------------- | ------- | -------------------- |
| **Runtime**           | Node.js         | 18+     | JavaScript runtime   |
| **Database**          | MongoDB         | 7.0     | Document database    |
| **Cache**             | Redis           | 7.2     | In-memory data store |
| **Authentication**    | JWT (jose)      | 6.0.8   | Token-based auth     |
| **API Documentation** | OpenAPI/Swagger | 3.0.3   | API specification    |
| **Validation**        | Zod             | 3.22.4  | Schema validation    |

### Infrastructure & DevOps

| Component              | Technology              | Purpose                                      |
| ---------------------- | ----------------------- | -------------------------------------------- |
| **Containerization**   | Docker + Docker Compose | Application packaging and orchestration      |
| **Process Management** | Docker Compose          | Container orchestration and restart policies |
| **Reverse Proxy**      | Nginx                   | Load balancing and SSL                       |
| **Monitoring**         | Built-in logging        | Application monitoring                       |
| **Testing**            | Shell scripts + curl    | API testing automation                       |

---

## Application Layers

### 1. Presentation Layer

**Location**: `app/[locale]/`, `components/`

**Responsibilities**:

- User interface rendering
- Client-side state management
- User interaction handling
- Responsive design implementation

**Key Components**:

```typescript
// Page Structure
app/[locale]/
├── page.tsx                    // Home page
├── field-mapping/             // Main application
├── login/                     // Authentication
├── about-us/                  // Static content
└── layout.tsx                 // Root layout

// Component Architecture
components/
├── MapView.tsx               // Geospatial interface
├── Sidebar.tsx               // Navigation and controls
├── Header.tsx                // Top navigation
├── Footer.tsx                // Bottom navigation
├── auth/                     // Authentication components
├── Fields/                   // Field management
├── Popup/                    // Modal dialogs
├── sections/                 // Page sections
└── ui/                       // Reusable UI components
```

### 2. Application Layer

**Location**: `app/api/`, `hooks/`, `context/`

**Responsibilities**:

- Business logic implementation
- API route handling
- State management
- Data transformation

**Key Components**:

```typescript
// API Routes
app/api/
├── auth/                     // Authentication endpoints
├── sync/                     // Cross-platform sync
├── admin/                    // Administrative functions
├── getfield/                 // Field management
├── getGEE/                   // Geospatial data
├── getweather/               // Weather data
└── docs/                     // API documentation

// Custom Hooks
hooks/
├── useAuthForms.ts           // Authentication logic
├── useFieldMapping.ts        // Field management
├── useCanalSearch.ts         // Canal search
├── useWaterRelease.ts        // Water scheduling
└── useMAPPAGE.ts            // Map page state

// Context Providers
context/
├── AudioCueContext.tsx       // Audio feedback
└── ManualLoaderContext.tsx   // Loading states
```

### 3. Service Layer

**Location**: `lib/`

**Responsibilities**:

- External service integration
- Data processing
- Business rule enforcement
- Cross-cutting concerns

**Key Services**:

```typescript
lib/
├── api-key.ts               // API key management
├── sync-multi.ts            // Multi-platform sync
├── sync-field-mappers.ts    // Data transformation
├── db.ts                    // Database connection
├── redis.ts                 // Cache management
├── auth-utils.ts            // Authentication utilities
└── api-key-middleware.ts    // API key validation
```

---

## Data Architecture

### Database Design

#### MongoDB Collections

```typescript
// Users Collection
interface User {
  _id: ObjectId;
  name: string;
  phone: string;
  city: string;
  division: string;
  role: string;
  farmsize?: string;
  country: string;
  receiverNetwork?: string;
  createdAt: Date;
}

// Fields Collection
interface Field {
  _id: ObjectId;
  fieldName: string;
  cropTypes: string[];
  soilType: string;
  location: {
    lat: number;
    lng: number;
  };
  polygon?: GeoJSON.Polygon;
  userId: string;
  createdAt: Date;
}

// Contact Collection
interface Contact {
  _id: ObjectId;
  name: string;
  phone: string;
  email?: string;
  message: string;
  createdAt: Date;
}

// Division-specific Collections
interface Canal {
  _id: ObjectId;
  name: string;
  division: string;
  coordinates: GeoJSON.LineString;
  priority: number;
}

interface WaterSchedule {
  _id: ObjectId;
  canalId: string;
  startDate: Date;
  endDate: Date;
  season: "Kharif" | "Rabi";
  status: "active" | "inactive";
}
```

#### Redis Data Structures

```typescript
// OTP Storage
Key: `otp:${phoneNumber}`
Value: "1234"
TTL: 300 seconds (5 minutes)

// Rate Limiting
Key: `rate_limit:${phoneNumber}`
Value: "1"
TTL: 300 seconds

// Session Data
Key: `session:${userId}`
Value: JSON stringified session data
TTL: 86400 seconds (24 hours)
```

### Data Flow Patterns

#### 1. User Registration Flow

```
User Registration Sequence:
┌─────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  User   │    │ Frontend │    │   API   │    │  Redis  │    │ MongoDB │    │   SMS   │
└────┬────┘    └─────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
     │                │              │              │              │              │
     │ Submit Form    │              │              │              │              │
     │ ──────────────>│              │              │              │              │
     │                │ POST /signup │              │              │              │
     │                │ ────────────>│              │              │              │
     │                │              │ Store OTP    │              │              │
     │                │              │ ────────────>│              │              │
     │                │              │              │ Send SMS     │              │
     │                │              │              │ ────────────>│              │
     │                │              │              │              │              │
     │                │ Success      │              │              │              │
     │                │ <────────────│              │              │              │
     │ Show OTP Input │              │              │              │              │
     │ <──────────────│              │              │              │              │
     │                │              │              │              │              │
     │ Submit OTP     │              │              │              │              │
     │ ──────────────>│              │              │              │              │
     │                │ POST /verify │              │              │              │
     │                │ ────────────>│              │              │              │
     │                │              │ Verify OTP   │              │              │
     │                │              │ ────────────>│              │              │
     │                │              │              │ Create User  │              │
     │                │              │              │ ────────────>│              │
     │                │              │              │              │              │
     │                │ Auth Tokens  │              │              │              │
     │                │ <────────────│              │              │              │
     │ Redirect       │              │              │              │              │
     │ <──────────────│              │              │              │              │
```

#### 2. Geospatial Data Flow

```
Geospatial Processing Flow:
┌─────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  User   │    │ MapView  │    │   API   │    │   GEE   │    │ Database│
└────┬────┘    └─────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
     │                │              │              │              │
     │ Draw Polygon   │              │              │              │
     │ ──────────────>│              │              │              │
     │                │ POST /getGEE │              │              │
     │                │ ────────────>│              │              │
     │                │              │ Forward Data │              │
     │                │              │ ────────────>│              │
     │                │              │              │ Process      │
     │                │              │              │ ────────────>│
     │                │              │              │              │
     │                │              │ Tile URL     │              │
     │                │              │ <────────────│              │
     │                │ Visualization│              │              │
     │                │ <────────────│              │              │
     │ Display Overlay│              │              │              │
     │ <──────────────│              │              │              │
```

---

## Authentication & Security

### Dual Authentication System

#### 1. JWT-based Authentication (Primary)

**Purpose**: User session management for web interface

**Implementation**:

```typescript
// Token Generation
const authToken = await new SignJWT({ userId, phone })
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("30d")
  .sign(secretKeyUint8);

// Token Storage
cookies().set("token", authToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 20 * 365 * 24 * 60 * 60, // 20 years
});

// Middleware Validation
const { payload } = await jwtVerify(token, secretKeyUint8);
requestHeaders.set("x-user-id", payload.userId);
requestHeaders.set("x-user-phone", payload.phone);
```

#### 2. API Key Authentication (Alternative)

**Purpose**: Programmatic access and third-party integrations

**Implementation**:

```typescript
interface ApiKey {
  id: string;
  name: string;
  key: string;
  userId?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
}

// Validation Flow
const validation = await validateApiKey(req);
if (!validation.isValid) {
  return NextResponse.json({ error: validation.error }, { status: 401 });
}
```

### Security Features

#### 1. Input Validation & Sanitization

```typescript
// Phone number validation
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+92[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// GeoJSON validation
const isValidPolygon = (polygon: any): boolean => {
  return polygon?.type === "Polygon" && Array.isArray(polygon.coordinates);
};
```

#### 2. Rate Limiting

```typescript
// OTP rate limiting (5 minutes)
const existingOtp = await redis.get(`otp:${phoneNumber}`);
if (existingOtp) {
  return NextResponse.json(
    {
      success: false,
      message: "OTP already sent. Please wait before requesting again.",
    },
    { status: 429 }
  );
}
```

#### 3. CORS Protection

```typescript
// Next.js configuration
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ALLOWED_ORIGIN,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};
```

---

## API Architecture

### RESTful API Design

#### Endpoint Structure

```typescript
// Authentication Endpoints
POST / [locale] / api / auth / signup; // User registration
POST / [locale] / api / auth / login; // User login
POST / [locale] / api / auth / verifyotp - register; // OTP verification (register)
POST / [locale] / api / auth / verifyotp - login; // OTP verification (login)
POST / [locale] / api / auth / logout; // User logout

// Field Management
POST / api / savefield; // Create new field
POST / api / getfield; // Get user fields
POST / api / updatefield; // Update field polygon
POST / api / deletefield; // Delete field
POST / api / checkpolygon; // Get field polygon

// Geospatial & Water Management
POST / api / getcanals; // Get canal information
POST / api / getwrs; // Get water release schedule
POST / api / getncd; // Get nearest canal data
POST / api / getGEE; // Get Google Earth Engine data
POST / api / getweather; // Get weather forecast

// Cross-Platform Sync
POST / api / sync / create - user; // Create user in external platforms
POST / api / sync / update - user; // Update user in external platforms
POST / api / sync / delete -user; // Delete user from external platforms

// Administrative
GET / api / admin / api - keys; // List API keys
POST / api / admin / api - keys; // Create API key
DELETE / api / admin / api - keys / [id]; // Delete API key
```

#### Response Format

```typescript
// Success Response
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### API Documentation

#### OpenAPI Specification

The API is documented using OpenAPI 3.0.3 specification:

```yaml
openapi: 3.0.3
info:
  title: AaabPashi Web API
  description: Water management and agricultural monitoring platform
  version: 1.0.0
  contact:
    name: AaabPashi API Support
    email: support@aabpashi.com

servers:
  - url: https://your-domain.com
    description: Production server
  - url: http://localhost:3000
    description: Development server

components:
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: token
    apiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
```

#### Interactive Documentation

- **Swagger UI**: Available at `/api/docs`
- **OpenAPI Spec**: Available at `/api/openapi`
- **Postman Collection**: Exportable from Swagger UI

---

## Frontend Architecture

### Component Architecture

#### 1. Page Components

```typescript
// Main Application Page
app/[locale]/field-mapping/page.tsx
├── Sidebar (Navigation & Controls)
├── MAPPage (Map Interface)
│   ├── MapView (Leaflet Map)
│   ├── FieldPopup (Field Management)
│   ├── ChartsPopup (Data Visualization)
│   └── LocationErrorPopup (Error Handling)
└── Context Providers
```

#### 2. Reusable Components

```typescript
components/
├── ui/                          // Base UI components
│   ├── FeatureCard.tsx          // Feature display
│   └── AuthTabs.tsx             // Authentication tabs
├── auth/                        // Authentication components
│   ├── LoginForm.tsx            // Login form
│   ├── RegisterForm.tsx         // Registration form
│   └── AuthPopup.tsx            // Auth modal
├── Fields/                      // Field management
│   ├── FieldsForm.tsx           // Field creation form
│   └── FieldPopup.tsx           // Field management modal
└── Popup/                       // Modal dialogs
    ├── CanalSearchPopup.tsx     // Canal search
    ├── WaterReleasePopup.tsx    // Water scheduling
    └── ComplaintPopup.tsx       // Complaint submission
```

### State Management

#### 1. React Hooks Pattern

```typescript
// Custom hooks for state management
const useFieldMapping = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<any | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  return {
    selectedFeature,
    setSelectedFeature,
    selectedField,
    setSelectedField,
    position,
    setPosition,
    // ... other state
  };
};
```

#### 2. Context Providers

```typescript
// Audio feedback context
const AudioCueContext = createContext({
  audioCueEnabled: false,
  playAudioCue: () => {},
  stopAudioCue: () => {},
});

// Loading state context
const ManualLoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {},
});
```

### Responsive Design

#### 1. Mobile-First Approach

```css
/* Base mobile styles */
.map-container {
  width: 100%;
  height: 100vh;
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .map-container {
    height: calc(100vh - 60px);
  }
}

@media (min-width: 1024px) {
  .sidebar-container {
    width: 350px;
  }
}
```

#### 2. Progressive Web App

```typescript
// PWA Configuration
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

// Service Worker
// public/sw.js - Handles offline functionality
```

---

## Geospatial Architecture

### Map Integration

#### 1. Leaflet.js Implementation

```typescript
// MapView Component
const MapView: React.FC<MapViewProps> = ({
  position,
  selectedField,
  polygonCoordinates,
  // ... other props
}) => {
  return (
    <MapContainer center={position || [30.3753, 69.3451]} zoom={6}>
      <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />

      {/* User Location */}
      {position && (
        <Marker position={position}>
          <Popup>📍 You are here</Popup>
        </Marker>
      )}

      {/* Field Polygons */}
      {selectedField?.polygon && <GeoJSON data={selectedField.polygon} />}

      {/* Drawing Tools */}
      {drawPolygonMode && (
        <FeatureGroup>
          <EditControl onCreated={handleDrawCreate} draw={{ polygon: true }} />
        </FeatureGroup>
      )}
    </MapContainer>
  );
};
```

#### 2. Coordinate System Handling

```typescript
// Coordinate transformation
import proj4 from "proj4";

// Transform from UTM to WGS84
const transformedCoordinates = coordinates.map(([x, y]) =>
  proj4("EPSG:32643", "EPSG:4326", [x, y])
);
```

### External Geospatial Services

#### 1. Google Earth Engine Integration

```typescript
// GEE API Proxy
export async function POST(req: NextRequest) {
  const { polygon } = await req.json();

  const response = await fetch(GEEApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ polygon }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

#### 2. Weather Data Integration

```typescript
// Weather API integration
const weatherData = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation`
);
```

---

## Internationalization

### Multi-Language Support

#### 1. Locale Configuration

```typescript
// i18n/routing.ts
export const routing = defineRouting({
  locales: ["en", "ur"],
  defaultLocale: "ur",
});

// i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

#### 2. Translation Structure

```json
// messages/en.json
{
  "map": {
    "loadingFeatureData": "⏳ Loading Feature Data...",
    "youAreHere": "You are here 📍",
    "recenter": "🔄 Recenter Location"
  },
  "sidebar": {
    "findLocation": "Find My Location",
    "addFarm": "Add Farm Location",
    "waterStress": "Water Stress"
  }
}

// messages/ur.json
{
  "map": {
    "loadingFeatureData": "⏳ فیچر ڈیٹا لوڈ ہو رہا ہے...",
    "youAreHere": "آپ یہاں ہیں 📍",
    "recenter": "🔄 لوکیشن دوبارہ سیٹ کریں"
  }
}
```

#### 3. RTL Support

```typescript
// RTL detection and styling
const locale = useLocale();
const isRTL = locale === "ur";

return (
  <div
    className={`container ${isRTL ? "rtl" : "ltr"}`}
    dir={isRTL ? "rtl" : "ltr"}
  >
    {/* Content */}
  </div>
);
```

### Translation Services

#### 1. Google Translate Integration

```typescript
// Canal name translation
const translateCanal = async (text: string, target: string) => {
  const response = await fetch("/api/translatecanal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target }),
  });

  return response.json();
};
```

---

## Cross-Platform Sync

### Multi-Platform Architecture

#### 1. Sync Configuration

```json
// config/sync-platforms.json
{
  "platforms": [
    {
      "name": "farmovation",
      "displayName": "Farmovation User Server",
      "enabled": true,
      "baseUrlEnvVar": "FARMOVATION_API_URL",
      "apiKeyEnvVar": "FARMOVATION_API_KEY",
      "defaultBaseUrl": "https://api.farmovation.tech",
      "endpoints": {
        "create": "/api/v1/sync/create-user",
        "update": "/api/v1/sync/update-user",
        "delete": "/api/v1/sync/delete-user"
      },
      "fieldMapper": "farmovation",
      "retryPolicy": {
        "maxAttempts": 3,
        "backoffMultiplier": 2,
        "initialDelayMs": 1000
      }
    }
  ]
}
```

#### 2. Field Mapping System

```typescript
// lib/sync-field-mappers.ts
class SyncFieldMapper {
  adaptUserData(platform: string, userData: UserData, source: string) {
    switch (platform) {
      case "farmovation":
        return {
          userData: {
            email: `${userData.phone.replace("+92", "")}@aabpashi.com`,
            mobile: userData.phone.replace("+92", ""),
            first_name: userData.name.split(" ")[0],
            last_name: userData.name.split(" ").slice(1).join(" "),
          },
          originalId: `aabpashi-${userData.phone.replace("+92", "")}`,
          operation: "create",
          timestamp: new Date().toISOString(),
        };
      default:
        return userData;
    }
  }
}
```

#### 3. Sync Service Implementation

```typescript
// lib/sync-multi.ts
class MultiPlatformSync {
  async syncUserCreate(userData: UserData): Promise<SyncResult[]> {
    const enabledPlatforms = this.getEnabledPlatforms();
    const results: SyncResult[] = [];

    for (const platform of enabledPlatforms) {
      try {
        const result = await this.makeSyncRequest(platform, "create", userData);
        results.push(result);
      } catch (error) {
        results.push({
          platform: platform.name,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }
}
```

### Error Handling & Retry Logic

```typescript
// Exponential backoff retry
private async retryRequest(
  platform: SyncPlatform,
  endpoint: 'create' | 'update' | 'delete',
  userData: UserData,
  attempt: number = 1
): Promise<SyncResult> {
  const result = await this.makeSyncRequest(platform, endpoint, userData);

  if (result.success || attempt >= platform.retryPolicy.maxAttempts) {
    return result;
  }

  const delay = platform.retryPolicy.initialDelayMs *
                Math.pow(platform.retryPolicy.backoffMultiplier, attempt - 1);

  await new Promise(resolve => setTimeout(resolve, delay));
  return this.retryRequest(platform, endpoint, userData, attempt + 1);
}
```

---

## Deployment Architecture

### Containerization Strategy

#### 1. Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### 2. Docker Compose Services

```yaml
# docker-compose.yml
services:
  aabpashi-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGO_URI=mongodb://mongodb:27017/WaterVation
      - REDIS_URL=redis://redis:6379
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

### Environment Management

#### 1. Environment Variables

```bash
# Core Configuration
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

# Database
MONGO_URI=mongodb://localhost:27017/WaterVation
REDIS_URL=redis://localhost:6379

# External APIs
VEEVO_API_KEY=your_veevo_api_key
GOOGLE_CLOUD_API_KEY=your_google_translate_api_key
NEXT_PUBLIC_GEE_API_URL=your_google_earth_engine_api_url

# Cross-Platform Sync
FARMOVATION_API_URL=https://api.farmovation.tech
FARMOVATION_API_KEY=your_farmovation_api_key
```

#### 2. Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

## Testing Architecture

### Testing Strategy

#### 1. Test Categories

```bash
# API Testing
scripts/test-api-keys.sh      # API key system tests
scripts/test-auth-flow.sh     # Authentication flow tests
scripts/test-user-sync.js     # Cross-platform sync tests

# Integration Testing
scripts/test-field-mapping.js # Field mapping validation
scripts/manage-sync-platforms.js # Platform management tests

# End-to-End Testing
scripts/test-all.sh           # Complete test suite
```

#### 2. Test Structure

```typescript
// Example test structure
describe("API Key System", () => {
  test("should create admin API key", async () => {
    const response = await fetch("/api/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Admin Key",
        permissions: ["admin"],
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

#### 3. Test Automation

```bash
#!/bin/bash
# scripts/test-all.sh

# Run complete test suite
echo "🧪 Running AabPashi Test Suite..."

# Test API key system
./scripts/test-api-keys.sh

# Test authentication flow
./scripts/test-auth-flow.sh

# Test cross-platform sync
npx ts-node scripts/test-user-sync.js

# Generate test report
echo "📊 Test Results Summary"
echo "======================"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"
echo "Success Rate: $SUCCESS_RATE%"
```

---

## Performance & Scalability

### Performance Optimization

#### 1. Caching Strategy

```typescript
// Redis caching implementation
export const safeRedisGet = async (key: string): Promise<string | null> => {
  try {
    if (await isRedisAvailable()) {
      return await redis.get(key);
    }
    return null;
  } catch (error) {
    console.warn(`Failed to get Redis key ${key}:`, error);
    return null;
  }
};

// Cache usage patterns
const cachedData = await safeRedisGet(`weather:${lat}:${lng}`);
if (cachedData) {
  return JSON.parse(cachedData);
}
```

#### 2. Database Optimization

```typescript
// MongoDB indexing
db.users.createIndex({ phone: 1 }, { unique: true });
db.fields.createIndex({ userId: 1 });
db.fields.createIndex({ location: "2dsphere" });

// Connection pooling
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
});
```

#### 3. Image and Asset Optimization

```typescript
// Next.js image optimization
<Image
  src="https://res.cloudinary.com/dypa9dqnd/image/upload/f_auto,q_auto/v1746126580/logo-icon_tfghku.png"
  alt="Logo"
  width={80}
  height={80}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Scalability Considerations

#### 1. Horizontal Scaling

```yaml
# Docker Swarm or Kubernetes configuration
services:
  aabpashi-app:
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: "0.5"
      update_config:
        parallelism: 1
        delay: 10s
```

#### 2. Load Balancing

```nginx
# Nginx configuration for load balancing
upstream aabpashi_backend {
    server aabpashi-app-1:3000;
    server aabpashi-app-2:3000;
    server aabpashi-app-3:3000;
}

server {
    listen 80;
    server_name aabpashi.com;

    location / {
        proxy_pass http://aabpashi_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Security Considerations

### Security Layers

#### 1. Application Security

```typescript
// Input sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

// SQL injection prevention (MongoDB)
const user = await collection.findOne({
  phone: phoneNumber, // MongoDB automatically escapes
});

// XSS prevention
const safeHtml = DOMPurify.sanitize(userInput);
```

#### 2. Network Security

```typescript
// HTTPS enforcement
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
};
```

#### 3. Data Protection

```typescript
// Sensitive data encryption
import crypto from "crypto";

const encryptSensitiveData = (data: string): string => {
  const cipher = crypto.createCipher("aes-256-cbc", process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// API key security
const generateApiKey = (): string => {
  return `aabpashi_${crypto.randomBytes(32).toString("hex")}`;
};
```

---

## Monitoring & Logging

### Logging Strategy

#### 1. Application Logging

```typescript
// Structured logging
const logger = {
  info: (message: string, meta?: any) => {
    console.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      })
    );
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(
      JSON.stringify({
        level: "error",
        timestamp: new Date().toISOString(),
        message,
        error: error?.message,
        stack: error?.stack,
        ...meta,
      })
    );
  },
};
```

#### 2. Performance Monitoring

```typescript
// API response time monitoring
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // API logic here
    const result = await processRequest(req);

    // Log performance metrics
    logger.info("API request completed", {
      endpoint: req.url,
      method: req.method,
      responseTime: Date.now() - startTime,
      status: 200,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("API request failed", error, {
      endpoint: req.url,
      method: req.method,
      responseTime: Date.now() - startTime,
    });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

#### 3. Health Monitoring

```typescript
// Health check endpoint
export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      externalApis: await checkExternalApisHealth(),
    },
  };

  const isHealthy = Object.values(health.services).every(
    (service) => service.status === "healthy"
  );

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
  });
}
```

### Error Tracking

#### 1. Error Boundaries

```typescript
// React error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error("React error boundary caught error", error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

#### 2. API Error Handling

```typescript
// Centralized error handling
const handleApiError = (error: any, context: string) => {
  logger.error(`API error in ${context}`, error, {
    context,
    timestamp: new Date().toISOString(),
    userAgent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for") || req.ip,
  });

  return NextResponse.json(
    {
      success: false,
      message: "An error occurred while processing your request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    },
    { status: 500 }
  );
};
```

---

## Conclusion

The AabPashi Web platform demonstrates a modern, scalable architecture that effectively addresses the complex requirements of agricultural water management. The system's modular design, comprehensive security measures, and robust testing framework provide a solid foundation for continued development and expansion.

### Key Architectural Strengths

1. **Modular Design**: Clear separation of concerns enables easy maintenance and feature addition
2. **Security-First**: Multi-layered authentication and comprehensive input validation
3. **Scalable Infrastructure**: Containerized deployment with horizontal scaling capabilities
4. **Comprehensive Testing**: Automated test suites covering all critical functionality
5. **Internationalization**: Built-in support for multiple languages and cultures
6. **Cross-Platform Integration**: Seamless synchronization with external agricultural platforms

### Future Considerations

1. **Microservices Migration**: Consider extracting services as the platform grows
2. **Real-time Features**: Implement WebSocket connections for live updates
3. **Advanced Analytics**: Add machine learning capabilities for predictive insights
4. **Mobile App**: Develop native mobile applications for enhanced user experience
5. **API Versioning**: Implement proper API versioning for backward compatibility

This architecture provides a robust foundation for the AabPashi platform's continued growth and evolution in the agricultural technology space.
