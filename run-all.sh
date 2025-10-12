#!/bin/bash

# Script to run both frontend and backend2 Docker containers
# This script manages both services using their respective docker-compose.yml files

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
FRONTEND_DIR="./frontend"
BACKEND_DIR="./backend2"

# Function to print colored messages
print_message() {
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}=========================================${NC}"
}

print_error() {
    echo -e "${RED}Error: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}Warning: $1${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to display usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --build       Build images before starting containers"
    echo "  --down        Stop and remove all containers"
    echo "  --logs        Show logs from all containers"
    echo "  --restart     Restart all containers"
    echo "  --help        Display this help message"
    echo ""
    echo "Without options: Start both frontend and backend2 containers"
    exit 0
}

# Function to start containers
start_containers() {
    local BUILD_FLAG=""
    if [ "$1" == "--build" ]; then
        BUILD_FLAG="--build"
        print_message "Building and starting containers..."
    else
        print_message "Starting containers..."
    fi

    # Start backend2
    echo "Starting backend2 service..."
    cd "$BACKEND_DIR"
    docker compose up -d $BUILD_FLAG
    cd - > /dev/null

    # Start frontend
    echo "Starting frontend service..."
    cd "$FRONTEND_DIR"
    docker compose up -d $BUILD_FLAG
    cd - > /dev/null

    print_message "All containers started successfully!"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend2: http://localhost:8080"
    echo ""
    echo "To view logs: $0 --logs"
    echo "To stop: $0 --down"
}

# Function to stop containers
stop_containers() {
    print_message "Stopping all containers..."

    # Stop frontend
    echo "Stopping frontend service..."
    cd "$FRONTEND_DIR"
    docker compose down
    cd - > /dev/null

    # Stop backend2
    echo "Stopping backend2 service..."
    cd "$BACKEND_DIR"
    docker compose down
    cd - > /dev/null

    print_message "All containers stopped successfully!"
}

# Function to show logs
show_logs() {
    print_message "Showing logs from all containers..."
    echo ""
    echo "Press Ctrl+C to exit logs"
    echo ""

    # Use docker compose logs in follow mode
    docker compose -f "$FRONTEND_DIR/docker-compose.yml" -f "$BACKEND_DIR/docker-compose.yml" logs -f
}

# Function to restart containers
restart_containers() {
    print_message "Restarting all containers..."

    cd "$BACKEND_DIR"
    docker compose restart
    cd - > /dev/null

    cd "$FRONTEND_DIR"
    docker compose restart
    cd - > /dev/null

    print_message "All containers restarted successfully!"
}

# Main script logic
check_docker

# Parse command line arguments
case "$1" in
    --build)
        start_containers --build
        ;;
    --down)
        stop_containers
        ;;
    --logs)
        show_logs
        ;;
    --restart)
        restart_containers
        ;;
    --help)
        usage
        ;;
    "")
        start_containers
        ;;
    *)
        print_error "Unknown option: $1"
        echo ""
        usage
        ;;
esac
