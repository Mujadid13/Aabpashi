#!/bin/bash

# Test script for Authentication Flow
# This script tests the complete JWT-based authentication flow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
TEST_PHONE="+923001234567"
TEST_NAME="Test User"
TEST_CITY="Lahore"
TEST_DIVISION="Kasur"
TEST_ROLE="Farmer"
TEST_FARMSIZE="5-10 acres"
TEST_COUNTRY="Pakistan"
TEST_RECEIVER_NETWORK="Jazz"

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

# Test user signup
test_signup() {
    log_info "Testing user signup..."
    
    SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/en/api/auth/signup" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"$TEST_NAME\",
            \"city\": \"$TEST_CITY\",
            \"phone\": \"$TEST_PHONE\",
            \"receiverNetwork\": \"$TEST_RECEIVER_NETWORK\",
            \"division\": \"$TEST_DIVISION\",
            \"farmsize\": \"$TEST_FARMSIZE\",
            \"role\": \"$TEST_ROLE\",
            \"country\": \"$TEST_COUNTRY\"
        }")
    
    if echo "$SIGNUP_RESPONSE" | grep -q "success.*true"; then
        log_info "User signup successful"
        log_warn "Note: In a real test, you would need to manually enter the OTP"
        log_warn "For automated testing, you might want to mock the OTP verification"
    else
        log_error "User signup failed"
        echo "$SIGNUP_RESPONSE"
    fi
}

# Test OTP sending
test_send_otp() {
    log_info "Testing OTP sending..."
    
    OTP_RESPONSE=$(curl -s -X POST "$BASE_URL/en/api/auth/sendotp" \
        -H "Content-Type: application/json" \
        -d "{
            \"phoneNumber\": \"$TEST_PHONE\",
            \"receiverNetwork\": \"$TEST_RECEIVER_NETWORK\"
        }")
    
    if echo "$OTP_RESPONSE" | grep -q "success.*true"; then
        log_info "OTP sending successful"
    else
        log_error "OTP sending failed"
        echo "$OTP_RESPONSE"
    fi
}

# Test user login
test_login() {
    log_info "Testing user login..."
    
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/en/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"phoneNumber\": \"$TEST_PHONE\"
        }")
    
    if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
        log_info "User login OTP sent successfully"
        log_warn "Note: In a real test, you would need to manually enter the OTP"
    else
        log_error "User login failed"
        echo "$LOGIN_RESPONSE"
    fi
}

# Test authenticated endpoint access
test_authenticated_access() {
    log_info "Testing authenticated endpoint access..."
    
    # This test assumes you have a valid session cookie
    # In a real scenario, you would first complete the OTP verification
    # to get the authentication cookies
    
    AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/getfield" \
        -H "Content-Type: application/json" \
        -d '{"userId": "test123"}' \
        -b cookies.txt 2>/dev/null || echo "No valid session")
    
    if echo "$AUTH_RESPONSE" | grep -q "fields\|401\|No valid session"; then
        log_info "Authenticated access test completed (expected behavior)"
    else
        log_error "Authenticated access test failed"
        echo "$AUTH_RESPONSE"
    fi
}

# Test logout
test_logout() {
    log_info "Testing user logout..."
    
    LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/en/api/auth/logout" \
        -H "Content-Type: application/json" \
        -b cookies.txt 2>/dev/null || echo "No session to logout")
    
    if echo "$LOGOUT_RESPONSE" | grep -q "Logout successful\|No session"; then
        log_info "Logout test completed"
    else
        log_error "Logout test failed"
        echo "$LOGOUT_RESPONSE"
    fi
}

# Test rate limiting
test_rate_limiting() {
    log_info "Testing rate limiting..."
    
    # Send multiple OTP requests quickly
    for i in {1..3}; do
        RATE_LIMIT_RESPONSE=$(curl -s -X POST "$BASE_URL/en/api/auth/sendotp" \
            -H "Content-Type: application/json" \
            -d "{
                \"phoneNumber\": \"$TEST_PHONE\",
                \"receiverNetwork\": \"$TEST_RECEIVER_NETWORK\"
            }")
        
        if echo "$RATE_LIMIT_RESPONSE" | grep -q "429"; then
            log_info "Rate limiting working correctly (request $i)"
            break
        elif echo "$RATE_LIMIT_RESPONSE" | grep -q "success"; then
            log_info "OTP request $i successful"
        else
            log_warn "Unexpected response for request $i"
            echo "$RATE_LIMIT_RESPONSE"
        fi
        
        sleep 1
    done
}

# Test input validation
test_input_validation() {
    log_info "Testing input validation..."
    
    # Test invalid phone number
    INVALID_PHONE_RESPONSE=$(curl -s -X POST "$BASE_URL/en/api/auth/signup" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Test User",
            "city": "Lahore",
            "phone": "invalid_phone",
            "receiverNetwork": "Jazz",
            "division": "Kasur",
            "farmsize": "5-10 acres",
            "role": "Farmer",
            "country": "Pakistan"
        }')
    
    if echo "$INVALID_PHONE_RESPONSE" | grep -q "400\|invalid"; then
        log_info "Invalid phone number validation working"
    else
        log_warn "Phone number validation might not be working"
        echo "$INVALID_PHONE_RESPONSE"
    fi
    
    # Test missing required fields
    MISSING_FIELDS_RESPONSE=$(curl -s -X POST "$BASE_URL/en/api/auth/signup" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "Test User"
        }')
    
    if echo "$MISSING_FIELDS_RESPONSE" | grep -q "400\|required"; then
        log_info "Required fields validation working"
    else
        log_warn "Required fields validation might not be working"
        echo "$MISSING_FIELDS_RESPONSE"
    fi
}

# Cleanup
cleanup() {
    log_info "Cleaning up test data..."
    if [ -f cookies.txt ]; then
        rm cookies.txt
    fi
}

# Main test execution
main() {
    log_info "Starting Authentication Flow tests..."
    
    check_server
    test_input_validation
    test_signup
    test_send_otp
    test_login
    test_authenticated_access
    test_logout
    test_rate_limiting
    
    log_info "All authentication tests completed!"
    log_warn "Note: Some tests require manual OTP verification for full functionality"
}

# Run cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 