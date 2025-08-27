#!/bin/bash

# AabPashi User Migration Script Wrapper
# This script runs the TypeScript migration script with proper environment setup

set -e  # Exit on any error

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_error ".env file not found!"
        print_status "Please copy env.example to .env and configure your environment variables:"
        echo "  cp env.example .env"
        echo "  # Edit .env with your actual values"
        exit 1
    fi
    print_success ".env file found"
}

# Function to check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed or not in PATH"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed or not in PATH"
        exit 1
    fi
    
    # Check if ts-node is installed
    if ! npm list ts-node &> /dev/null; then
        print_warning "ts-node not found, installing..."
        npm install --save-dev ts-node
    fi
    
    # Check if axios is installed
    if ! npm list axios &> /dev/null; then
        print_warning "axios not found, installing..."
        npm install axios
    fi
    
    print_success "Dependencies check passed"
}

# Function to load environment variables
load_environment() {
    print_status "Loading environment variables..."
    
    if [ -f .env ]; then
        export $(grep -v '^#' .env | xargs)
        print_success "Environment variables loaded"
    else
        print_error ".env file not found"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "AabPashi User Migration Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h        Show this help message"
    echo "  --dry-run         Perform a dry run (no actual migration)"
    echo "  --batch-size=N    Set batch size for processing (default: 50)"
    echo "  --confirm         Skip confirmation prompt"
    echo ""
    echo "Examples:"
    echo "  $0                # Run migration with confirmation"
    echo "  $0 --dry-run      # Perform dry run"
    echo "  $0 --batch-size=25 # Run with smaller batch size"
    echo "  $0 --confirm      # Run without confirmation"
    echo ""
    echo "Environment Variables Required:"
    echo "  MONGO_URI              MongoDB connection string"
    echo "  FARMOVATION_API_URL    Farmovation API base URL"
    echo "  FARMOVATION_API_KEY    Farmovation API key"
}

# Function to confirm migration
confirm_migration() {
    if [ "$1" != "--confirm" ]; then
        echo ""
        print_warning "This will migrate ALL users from AabPashi to Farmovation User Server"
        print_warning "This is a ONE-TIME operation. Make sure you have:"
        echo "  1. Backed up your database"
        echo "  2. Verified Farmovation API credentials"
        echo "  3. Tested with --dry-run first"
        echo ""
        read -p "Are you sure you want to continue? (yes/no): " -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            print_status "Migration cancelled"
            exit 0
        fi
    fi
}

# Function to run migration
run_migration() {
    print_status "Starting user migration..."
    
    # Build the command
    local cmd="npx ts-node scripts/migrate-users.ts"
    
    # Add arguments
    for arg in "$@"; do
        if [[ $arg == --dry-run ]] || [[ $arg == --batch-size=* ]]; then
            cmd="$cmd $arg"
        fi
    done
    
    print_status "Running: $cmd"
    echo ""
    
    # Execute the migration
    eval $cmd
}

# Main execution
main() {
    print_status "AabPashi User Migration Script"
    print_status "=============================="
    
    # Parse command line arguments
    local dry_run=false
    local batch_size=""
    local confirm=false
    
    for arg in "$@"; do
        case $arg in
            --help|-h)
                show_help
                exit 0
                ;;
            --dry-run)
                dry_run=true
                ;;
            --batch-size=*)
                batch_size="${arg#*=}"
                ;;
            --confirm)
                confirm=true
                ;;
            *)
                print_error "Unknown option: $arg"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Check environment and dependencies
    check_env_file
    check_dependencies
    load_environment
    
    # Show migration info
    print_status "Migration Configuration:"
    echo "  Dry run: $dry_run"
    if [ -n "$batch_size" ]; then
        echo "  Batch size: $batch_size"
    else
        echo "  Batch size: 50 (default)"
    fi
    echo "  Farmovation API: $FARMOVATION_API_URL"
    echo ""
    
    # Confirm migration (unless --confirm is used)
    if [ "$confirm" = false ]; then
        confirm_migration
    fi
    
    # Build arguments for TypeScript script
    local ts_args=""
    if [ "$dry_run" = true ]; then
        ts_args="--dry-run"
    fi
    if [ -n "$batch_size" ]; then
        ts_args="$ts_args --batch-size=$batch_size"
    fi
    
    # Run migration
    run_migration $ts_args
    
    print_success "Migration script completed"
}

# Run main function with all arguments
main "$@" 