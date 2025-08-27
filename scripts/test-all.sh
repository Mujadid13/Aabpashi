#!/bin/bash

# Master test script for AaabPashi Web
# This script runs all individual test suites and provides a comprehensive report

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_RESULTS_DIR="$PROJECT_ROOT/test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

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

log_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Initialize test results directory
init_test_results() {
    mkdir -p "$TEST_RESULTS_DIR"
    echo "Test Results - $(date)" > "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    echo "========================================" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    echo "" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
}

# Run a test script and capture results
run_test() {
    local test_name="$1"
    local test_script="$2"
    local test_file="$TEST_RESULTS_DIR/${test_name}_$TIMESTAMP.log"
    
    log_header "Running $test_name..."
    echo "Running $test_name..." >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ -f "$test_script" ]; then
        if bash "$test_script" > "$test_file" 2>&1; then
            log_info "$test_name: PASSED"
            echo "  Status: PASSED" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            log_error "$test_name: FAILED"
            echo "  Status: FAILED" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
            echo "  Log: $test_file" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    else
        log_warn "$test_name: SKIPPED (script not found)"
        echo "  Status: SKIPPED (script not found)" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
        SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
    fi
    
    echo "" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
}

# Check prerequisites
check_prerequisites() {
    log_header "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check if curl is installed
    if ! command -v curl &> /dev/null; then
        log_error "curl is not installed"
        exit 1
    fi
    
    # Check if development server is running
    if ! curl -s "http://localhost:9301" > /dev/null; then
        log_warn "Development server is not running at http://localhost:9301"
        log_warn "Please start the server with: npm run dev"
        log_warn "Some tests may fail without the server running"
    fi
    
    log_info "Prerequisites check completed"
}

# Run API key system tests
test_api_keys() {
    run_test "API Key System" "$SCRIPT_DIR/test-api-keys.sh"
}

# Run authentication flow tests
test_auth_flow() {
    run_test "Authentication Flow" "$SCRIPT_DIR/test-auth-flow.sh"
}

# Run basic API endpoint tests
test_basic_endpoints() {
    log_header "Testing basic API endpoints..."
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Test health check or basic endpoint
    if curl -s "http://localhost:9301" > /dev/null; then
        log_info "Basic endpoint test: PASSED"
        echo "Basic endpoint test: PASSED" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "Basic endpoint test: FAILED"
        echo "Basic endpoint test: FAILED" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    echo "" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
}

# Run environment variable tests
test_environment() {
    log_header "Testing environment variables..."
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check if .env file exists
    if [ -f "$PROJECT_ROOT/.env" ]; then
        log_info "Environment file exists: PASSED"
        echo "Environment file exists: PASSED" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_warn "Environment file missing: SKIPPED"
        echo "Environment file missing: SKIPPED" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
        SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
    fi
    
    echo "" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
}

# Generate test summary
generate_summary() {
    log_header "Generating test summary..."
    
    echo "Test Summary" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    echo "============" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    echo "Total Tests: $TOTAL_TESTS" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    echo "Passed: $PASSED_TESTS" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    echo "Failed: $FAILED_TESTS" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    echo "Skipped: $SKIPPED_TESTS" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    echo "" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    
    # Calculate success rate
    if [ $TOTAL_TESTS -gt 0 ]; then
        SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
        echo "Success Rate: ${SUCCESS_RATE}%" >> "$TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
        
        if [ $SUCCESS_RATE -ge 80 ]; then
            log_info "Overall test result: GOOD (${SUCCESS_RATE}% success rate)"
        elif [ $SUCCESS_RATE -ge 60 ]; then
            log_warn "Overall test result: FAIR (${SUCCESS_RATE}% success rate)"
        else
            log_error "Overall test result: POOR (${SUCCESS_RATE}% success rate)"
        fi
    fi
    
    echo "Detailed test results saved to: $TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up test artifacts..."
    
    # Remove temporary files
    rm -f .env.test
    rm -f cookies.txt
    
    # Keep only the latest 5 test reports
    cd "$TEST_RESULTS_DIR"
    ls -t test_report_*.txt | tail -n +6 | xargs -r rm
}

# Main execution
main() {
    log_header "Starting comprehensive test suite for AaabPashi Web..."
    
    # Initialize
    init_test_results
    check_prerequisites
    
    # Run tests
    test_environment
    test_basic_endpoints
    test_api_keys
    test_auth_flow
    
    # Generate summary
    generate_summary
    
    log_header "Test suite completed!"
    log_info "Results saved to: $TEST_RESULTS_DIR/test_report_$TIMESTAMP.txt"
    
    # Exit with appropriate code
    if [ $FAILED_TESTS -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 