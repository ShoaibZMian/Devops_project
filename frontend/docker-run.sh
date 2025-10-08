#!/bin/bash

# Docker Run Script for frontend
# This script runs the frontend container using docker-compose

set -e  # Exit on error

echo "========================================="
echo "Frontend Docker Run Script"
echo "========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found. Creating a default one..."
    echo "NODE_ENV=production" > .env
fi

# Stop and remove existing containers
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start the container
echo "Building and starting frontend container..."
docker-compose up --build -d

# Show container status
echo ""
echo "========================================="
echo "Frontend container is running!"
echo "========================================="
echo "Access the application at: http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose logs -f"
echo "  Stop:         docker-compose down"
echo "  Restart:      docker-compose restart"
echo "========================================="
