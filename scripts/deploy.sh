#!/bin/bash

# AabPashi Deployment Script
# This script rebuilds Docker images and relaunches containers for system updates

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

# Function to check Docker and Docker Compose
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    print_success "Docker and Docker Compose are available"
}

# Function to stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    docker-compose down
    print_success "Containers stopped"
}

# Function to rebuild images
rebuild_images() {
    print_status "Rebuilding Docker images..."
    docker-compose build --no-cache
    print_success "Images rebuilt successfully"
}

# Function to start containers
start_containers() {
    print_status "Starting containers..."
    docker-compose up -d
    print_success "Containers started"
}

# Function to wait for services to be healthy
wait_for_health() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            print_success "MongoDB is healthy"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_warning "MongoDB health check timeout"
    fi
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    timeout=30
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T redis redis-cli ping &> /dev/null; then
            print_success "Redis is healthy"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_warning "Redis health check timeout"
    fi
    
    # Wait for App
    print_status "Waiting for application..."
    timeout=120
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            print_success "Application is healthy"
            break
        fi
        sleep 3
        timeout=$((timeout - 3))
    done
    
    if [ $timeout -le 0 ]; then
        print_warning "Application health check timeout"
    fi
}

# Function to show deployment status
show_status() {
    print_status "Deployment completed!"
    echo ""
    echo -e "${GREEN}Services Status:${NC}"
    docker-compose ps
    echo ""
    echo -e "${GREEN}Access URLs:${NC}"
    echo "  Application: http://localhost:3000"
    echo "  MongoDB Express: http://localhost:8081"
    echo "  Redis Commander: http://localhost:8082"
    echo ""
    echo -e "${GREEN}Useful Commands:${NC}"
    echo "  View logs: docker-compose logs -f aabpashi-app"
    echo "  Restart app: docker-compose restart aabpashi-app"
    echo "  Stop all: docker-compose down"
}

# Function to show logs
show_logs() {
    if [ "$1" = "--logs" ]; then
        print_status "Showing application logs..."
        docker-compose logs -f aabpashi-app
    fi
}

# Main deployment function
deploy() {
    print_status "Starting AabPashi deployment..."
    echo ""
    
    check_env_file
    check_dependencies
    stop_containers
    rebuild_images
    start_containers
    wait_for_health
    show_status
    
    print_success "Deployment completed successfully!"
}

# Function to show help
show_help() {
    echo "AabPashi Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h     Show this help message"
    echo "  --logs         Show application logs after deployment"
    echo "  --quick        Quick deploy (skip health checks)"
    echo ""
    echo "Examples:"
    echo "  $0              # Full deployment with health checks"
    echo "  $0 --logs       # Deploy and show logs"
    echo "  $0 --quick      # Quick deployment"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --logs)
        deploy
        show_logs --logs
        ;;
    --quick)
        print_status "Quick deployment mode..."
        check_env_file
        check_dependencies
        stop_containers
        rebuild_images
        start_containers
        show_status
        print_success "Quick deployment completed!"
        ;;
    "")
        deploy
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac 