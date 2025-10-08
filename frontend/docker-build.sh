#!/bin/bash

# Docker Build and Push Script for frontend
# This script builds the Docker image and pushes it to DockerHub

set -e  # Exit on error

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-shoaibzmian}"
IMAGE_NAME="frontend"
IMAGE_TAG="${IMAGE_TAG:-latest}"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "========================================="
echo "Docker Build and Push Script"
echo "========================================="
echo "Image: ${FULL_IMAGE_NAME}"
echo "========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t ${FULL_IMAGE_NAME} -f Dockerfile .

# Tag with additional tags if needed
if [ ! -z "${ADDITIONAL_TAG}" ]; then
    echo "Tagging image with additional tag: ${ADDITIONAL_TAG}"
    docker tag ${FULL_IMAGE_NAME} ${DOCKER_USERNAME}/${IMAGE_NAME}:${ADDITIONAL_TAG}
fi

# Login to DockerHub (if not already logged in)
echo "Logging in to DockerHub..."
echo "Please enter your DockerHub credentials if prompted:"
docker login

# Push the image to DockerHub
echo "Pushing image to DockerHub..."
docker push ${FULL_IMAGE_NAME}

if [ ! -z "${ADDITIONAL_TAG}" ]; then
    echo "Pushing additional tag..."
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${ADDITIONAL_TAG}
fi

echo "========================================="
echo "Build and Push Complete!"
echo "Image: ${FULL_IMAGE_NAME}"
echo "========================================="
echo ""
echo "To run the image locally:"
echo "docker run -p 3000:80 --env-file .env ${FULL_IMAGE_NAME}"
echo ""
echo "To pull the image on another machine:"
echo "docker pull ${FULL_IMAGE_NAME}"
