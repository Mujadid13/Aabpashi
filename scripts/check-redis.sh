#!/bin/bash

# Redis Health Check Script
# This script checks Redis connectivity and status

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    print_success "Environment variables loaded"
else
    print_warning ".env file not found, using defaults"
fi

# Get Redis connection details
REDIS_HOST=${REDIS_HOST:-localhost}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_PASSWORD=${REDIS_PASSWORD:-}

print_status "Checking Redis connection..."
print_status "Host: $REDIS_HOST"
print_status "Port: $REDIS_PORT"

# Check if Redis is running locally
if command -v redis-cli &> /dev/null; then
    print_status "Testing local Redis connection..."
    
    if redis-cli -h $REDIS_HOST -p $REDIS_PORT ping &> /dev/null; then
        print_success "Local Redis is running and responding"
        
        # Test basic operations
        print_status "Testing Redis operations..."
        redis-cli -h $REDIS_HOST -p $REDIS_PORT set test_key "test_value" &> /dev/null
        redis-cli -h $REDIS_HOST -p $REDIS_PORT get test_key &> /dev/null
        redis-cli -h $REDIS_HOST -p $REDIS_PORT del test_key &> /dev/null
        print_success "Redis operations working correctly"
    else
        print_error "Local Redis is not responding"
    fi
else
    print_warning "redis-cli not found locally"
fi

# Check Docker Redis if available
if command -v docker &> /dev/null; then
    print_status "Checking Docker Redis..."
    
    if docker ps | grep -q redis; then
        print_success "Redis container is running"
        
        # Test Docker Redis connection
        if docker exec $(docker ps -q --filter "name=redis") redis-cli ping &> /dev/null; then
            print_success "Docker Redis is responding"
        else
            print_error "Docker Redis is not responding"
        fi
    else
        print_warning "No Redis container found"
        
        # Check if we can start Redis with docker-compose
        if [ -f docker-compose.yml ]; then
            print_status "Attempting to start Redis with docker-compose..."
            docker-compose up redis -d
            sleep 3
            
            if docker-compose ps redis | grep -q "Up"; then
                print_success "Redis started successfully with docker-compose"
            else
                print_error "Failed to start Redis with docker-compose"
            fi
        fi
    fi
else
    print_warning "Docker not available"
fi

# Check Node.js Redis connection
print_status "Testing Node.js Redis connection..."

# Create a simple test script
cat > /tmp/test-redis.js << 'EOF'
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  lazyConnect: true,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 1,
  connectTimeout: 5000,
});

redis.on('error', (error) => {
  console.error('Redis connection failed:', error.message);
  process.exit(1);
});

redis.on('connect', () => {
  console.log('✅ Node.js Redis connection successful');
  process.exit(0);
});

// Timeout after 5 seconds
setTimeout(() => {
  console.error('❌ Redis connection timeout');
  process.exit(1);
}, 5000);
EOF

# Run the test
if node /tmp/test-redis.js; then
    print_success "Node.js Redis connection successful"
else
    print_error "Node.js Redis connection failed"
fi

# Cleanup
rm -f /tmp/test-redis.js

print_status "Redis health check completed" 