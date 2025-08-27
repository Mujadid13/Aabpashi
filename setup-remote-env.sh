#!/bin/bash

# Setup Remote Environment Script for AabPashi
# This script sets up the .env file and deploys the system on the remote host

echo "🚀 Setting up AabPashi remote environment..."

# Navigate to the project directory
cd /root/AaabPashi-web

# Create .env file with specified port allocations
cat > .env << 'EOF'
# AabPashi Environment Configuration
# Remote deployment configuration

# ===================================================================
# Container Configuration
# ===================================================================

# Container Names
MONGO_CONTAINER_NAME=aabpashi-mongodb
REDIS_CONTAINER_NAME=aabpashi-redis
APP_CONTAINER_NAME=aabpashi-app
MONGO_EXPRESS_CONTAINER_NAME=aabpashi-mongo-express
REDIS_COMMANDER_CONTAINER_NAME=aabpashi-redis-commander

# Ports - Remote deployment allocation
APP_PORT=9301
MONGO_PORT=9302
REDIS_PORT=9303
MONGO_EXPRESS_PORT=9304
REDIS_COMMANDER_PORT=9305

# ===================================================================
# MongoDB Configuration
# ===================================================================

MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_strong_mongo_password_here
MONGO_DATABASE=aabpashi
MONGO_URI=mongodb://admin:your_strong_mongo_password_here@mongodb:27017/aabpashi?authSource=admin

# MongoDB Express Configuration
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASSWORD=your_mongo_express_password_here
MONGO_EXPRESS_URL=mongodb://admin:your_strong_mongo_password_here@mongodb:27017/

# ===================================================================
# Redis Configuration
# ===================================================================

# Redis Connection (choose one method)
REDIS_URL=redis://redis:6379
# OR use individual settings:
# REDIS_HOST=redis
# REDIS_PORT=6379
# REDIS_PASSWORD=
# REDIS_DB=0

REDIS_COMMANDER_HOSTS=local:redis:6379

# ===================================================================
# Application Configuration
# ===================================================================

NODE_ENV=production
SOURCE_CODE_MOUNT=.

# ===================================================================
# Resource Limits
# ===================================================================

MONGO_MEMORY_LIMIT=1G
MONGO_CPU_LIMIT=0.5
REDIS_MEMORY_LIMIT=512M
REDIS_CPU_LIMIT=0.25
APP_MEMORY_LIMIT=2G
APP_CPU_LIMIT=1.0

# ===================================================================
# API Keys (Replace with your actual keys)
# ===================================================================

VEEVO_API_KEY=your_veevo_api_key_here
GOOGLE_CLOUD_API_KEY=your_google_translate_api_key_here
JWT_SECRET=your_jwt_secret_key_here

# ===================================================================
# External API URLs
# ===================================================================

NEXT_PUBLIC_PYTHON_API_URL=https://your-python-api-domain.com
NEXT_PUBLIC_PYTHON_API_URL1=https://your-secondary-python-api-domain.com
NEXT_PUBLIC_GEE_API_URL=https://your-gee-api-domain.com

# ===================================================================
# Multi-Platform Sync Configuration
# ===================================================================

FARMOVATION_API_URL=https://user-server.sam.farmovation.tech/api/v1
FARMOVATION_API_KEY=your_farmovation_api_key_here
FARMOVATION_MARKETPLACE_API_URL=https://marketplace.farmovation.tech
FARMOVATION_MARKETPLACE_API_KEY=your_farmovation_marketplace_api_key_here

# ===================================================================
# Health Check Configuration
# ===================================================================

# Health check intervals (in seconds)
HEALTH_CHECK_INTERVAL=30
HEALTH_CHECK_TIMEOUT=10
HEALTH_CHECK_RETRIES=3

# Health check endpoints
APP_HEALTH_CHECK_URL=http://localhost:9301/api/health
EOF

echo "✅ .env file created with port allocations:"
echo "   APP_PORT=9301"
echo "   MONGO_PORT=9302"
echo "   REDIS_PORT=9303"
echo "   MONGO_EXPRESS_PORT=9304"
echo "   REDIS_COMMANDER_PORT=9305"

# Make deploy script executable
chmod +x deploy.sh
chmod +x scripts/test-all.sh

echo "🔧 Making scripts executable..."

# Deploy the system
echo "🚀 Starting deployment with deploy.sh..."
./deploy.sh

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Test the system
echo "🧪 Running system tests with test-all.sh..."
./scripts/test-all.sh

echo "✅ Remote environment setup complete!"
echo ""
echo "📋 Service URLs:"
echo "   App: http://217.154.66.145:9301"
echo "   MongoDB: mongodb://217.154.66.145:9302"
echo "   Redis: redis://217.154.66.145:9303"
echo "   Mongo Express: http://217.154.66.145:9304"
echo "   Redis Commander: http://217.154.66.145:9305" 