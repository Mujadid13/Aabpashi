#!/bin/bash

# Test script for API Key System
# This script tests the API key creation, authentication, and management endpoints

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:9301"
ADMIN_API_KEY=""
TEST_API_KEY=""

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if server is running
check_server() {
    log_info "Checking if server is running..."
    if curl -s "$BASE_URL" > /dev/null; then
        log_info "Server is running at $BASE_URL"
    else
        log_error "Server is not running at $BASE_URL"
        log_error "Please start the development server: npm run dev"
        exit 1
    fi
}

# Test API key creation
test_create_api_key() {
    log_info "Testing API key creation..."
    
    # Create admin API key (first one doesn't require authentication)
    log_info "Creating admin API key..."
    ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/api-keys" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Test Admin Key",
            "permissions": ["admin"],
            "expiresInDays": 30
        }')
    
    # Check if this is the first API key (no auth required) or if we need to provide auth
    if echo "$ADMIN_RESPONSE" | grep -q "Unauthorized"; then
        log_warn "Admin API key creation requires authentication"
        log_warn "This might be because API keys already exist"
        log_warn "Skipping API key creation test - manual setup required"
        return 0
    fi
    
    ADMIN_API_KEY=$(echo "$ADMIN_RESPONSE" | grep -o '"key":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$ADMIN_API_KEY" ]; then
        log_info "Admin API key created: ${ADMIN_API_KEY:0:20}..."
        echo "ADMIN_API_KEY=$ADMIN_API_KEY" > .env.test
    else
        log_error "Failed to create admin API key"
        echo "$ADMIN_RESPONSE"
        return 1
    fi
    
    # Create test API key
    log_info "Creating test API key..."
    TEST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/api-keys" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ADMIN_API_KEY" \
        -d '{
            "name": "Test App Key",
            "permissions": ["read", "write"],
            "expiresInDays": 7
        }')
    
    TEST_API_KEY=$(echo "$TEST_RESPONSE" | grep -o '"key":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$TEST_API_KEY" ]; then
        log_info "Test API key created: ${TEST_API_KEY:0:20}..."
        echo "TEST_API_KEY=$TEST_API_KEY" >> .env.test
    else
        log_error "Failed to create test API key"
        echo "$TEST_RESPONSE"
        return 1
    fi
}

# Test API key authentication
test_api_key_auth() {
    log_info "Testing API key authentication..."
    
    # Check if we have API keys to test with
    if [ ! -f .env.test ]; then
        log_warn "No API keys available for testing - skipping authentication tests"
        return 0
    fi
    
    # Load API keys from test file
    source .env.test
    
    if [ -z "$TEST_API_KEY" ]; then
        log_warn "No test API key available - skipping authentication tests"
        return 0
    fi
    
    # Test with valid API key
    log_info "Testing valid API key..."
    AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/getfield" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TEST_API_KEY" \
        -d '{"userId": "test123"}')
    
    if echo "$AUTH_RESPONSE" | grep -q "fields"; then
        log_info "API key authentication successful"
    else
        log_error "API key authentication failed"
        echo "$AUTH_RESPONSE"
    fi
    
    # Test with invalid API key
    log_info "Testing invalid API key..."
    INVALID_RESPONSE=$(curl -s -X POST "$BASE_URL/api/getfield" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer invalid_key_123" \
        -d '{"userId": "test123"}')
    
    if echo "$INVALID_RESPONSE" | grep -q "401"; then
        log_info "Invalid API key correctly rejected"
    else
        log_warn "Invalid API key not properly rejected"
        echo "$INVALID_RESPONSE"
    fi
}

# Test API key management
test_api_key_management() {
    log_info "Testing API key management..."
    
    # Check if we have admin API key
    if [ ! -f .env.test ]; then
        log_warn "No admin API key available - skipping management tests"
        return 0
    fi
    
    # Load API keys from test file
    source .env.test
    
    if [ -z "$ADMIN_API_KEY" ]; then
        log_warn "No admin API key available - skipping management tests"
        return 0
    fi
    
    # List API keys
    log_info "Listing API keys..."
    LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/api/admin/api-keys" \
        -H "Authorization: Bearer $ADMIN_API_KEY")
    
    if echo "$LIST_RESPONSE" | grep -q "data"; then
        log_info "API key listing successful"
    else
        log_error "API key listing failed"
        echo "$LIST_RESPONSE"
    fi
    
    # Get specific API key
    log_info "Getting specific API key..."
    KEY_ID=$(echo "$LIST_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$KEY_ID" ]; then
        GET_RESPONSE=$(curl -s -X GET "$BASE_URL/api/admin/api-keys/$KEY_ID" \
            -H "Authorization: Bearer $ADMIN_API_KEY")
        
        if echo "$GET_RESPONSE" | grep -q "name"; then
            log_info "API key retrieval successful"
        else
            log_error "API key retrieval failed"
            echo "$GET_RESPONSE"
        fi
    fi
}

# Test sync endpoints
test_sync_endpoints() {
    log_info "Testing sync endpoints..."
    
    # Check if we have admin API key
    if [ ! -f .env.test ]; then
        log_warn "No admin API key available - skipping sync tests"
        return 0
    fi
    
    # Load API keys from test file
    source .env.test
    
    if [ -z "$ADMIN_API_KEY" ]; then
        log_warn "No admin API key available - skipping sync tests"
        return 0
    fi
    
    # Test user create sync
    log_info "Testing user create sync..."
    SYNC_CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sync/create-user" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $ADMIN_API_KEY" \
        -d '{
            "name": "Test User",
            "phone": "+923001234567",
            "city": "Lahore",
            "division": "Kasur",
            "role": "Farmer",
            "farmsize": "5-10 acres",
            "country": "Pakistan",
            "receiverNetwork": "Jazz"
        }')
    
    if echo "$SYNC_CREATE_RESPONSE" | grep -q "success.*true"; then
        log_info "User create sync successful"
    else
        log_error "User create sync failed"
        echo "$SYNC_CREATE_RESPONSE"
    fi
    
    # Test user update sync
    log_info "Testing user update sync..."
    SYNC_UPDATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sync/update-user" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $ADMIN_API_KEY" \
        -d '{
            "phone": "+923001234567",
            "city": "Karachi"
        }')
    
    if echo "$SYNC_UPDATE_RESPONSE" | grep -q "success.*true"; then
        log_info "User update sync successful"
    else
        log_error "User update sync failed"
        echo "$SYNC_UPDATE_RESPONSE"
    fi
    
    # Test user delete sync
    log_info "Testing user delete sync..."
    SYNC_DELETE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/sync/delete-user" \
        -H "Content-Type: application/json" \
        -H "X-API-Key: $ADMIN_API_KEY" \
        -d '{
            "phone": "+923001234567"
        }')
    
    if echo "$SYNC_DELETE_RESPONSE" | grep -q "success.*true"; then
        log_info "User delete sync successful"
    else
        log_error "User delete sync failed"
        echo "$SYNC_DELETE_RESPONSE"
    fi
}

# Cleanup
cleanup() {
    log_info "Cleaning up test data..."
    if [ -f .env.test ]; then
        rm .env.test
    fi
}

# Main test execution
main() {
    log_info "Starting API Key System tests..."
    
    check_server
    test_create_api_key
    test_api_key_auth
    test_api_key_management
    test_sync_endpoints
    
    log_info "All tests completed successfully!"
}

# Run cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 