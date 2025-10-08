# Docker Deployment Guide for backend2

This guide explains how to build, run, and deploy the backend2 .NET application using Docker.

## Prerequisites

- Docker installed and running
- DockerHub account (for deployment)
- Access to Azure SQL Database (or update connection string)

## Quick Start

### 1. Setup Environment Variables

First, create a `.env` file from the template:

```bash
cp .env.template .env
```

Then edit `.env` and fill in your actual values:

```bash
# Edit with your actual credentials
nano .env
```

**Required environment variables:**
- `ConnectionStrings__DefaultConnection`: Your database connection string
- `JWT__Issuer`: JWT issuer URL
- `JWT__Audience`: JWT audience URL
- `JWT__OnlineStoreGroupe24`: JWT secret key (minimum 32 characters)

### 2. Local Testing with Docker Compose

Build and run locally:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:8080`

To run in detached mode:

```bash
docker-compose up -d
```

To stop:

```bash
docker-compose down
```

### 3. Build and Push to DockerHub

#### Option A: Using the build script (recommended)

```bash
# Optional: Set a specific tag (default is 'latest')
export IMAGE_TAG=v1.0.0

# Run the build script (uses shoaibzmian as default username)
./docker-build.sh

# Or override username if needed
DOCKER_USERNAME=other-username ./docker-build.sh
```

#### Option B: Manual build and push

```bash
# Build the image
docker build -t your-username/backend2:latest .

# Login to DockerHub
docker login

# Push to DockerHub
docker push your-username/backend2:latest
```

### 4. Deploy on Remote Server

On your deployment server:

```bash
# Pull the image
docker pull your-username/backend2:latest

# Create .env file with your environment variables
nano .env

# Run the container
docker run -d \
  --name backend2 \
  -p 80:80 \
  --env-file .env \
  --restart unless-stopped \
  your-username/backend2:latest
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `ConnectionStrings__DefaultConnection` | Database connection string | `Server=tcp:server.database.windows.net,1433;...` |
| `JWT__Issuer` | JWT token issuer | `http://localhost:5259` |
| `JWT__Audience` | JWT token audience | `http://localhost:5259` |
| `JWT__OnlineStoreGroupe24` | JWT signing key | `your-secret-key-32-chars-long` |
| `ASPNETCORE_ENVIRONMENT` | Environment mode | `Production` or `Development` |
| `ASPNETCORE_URLS` | URLs the app listens on | `http://+:80` |

## Testing the API

Once running, you can access:
- Swagger UI: `http://localhost:8080/swagger` (if in Development mode)
- Health check: `http://localhost:8080/api/health` (if implemented)

## Troubleshooting

### View container logs
```bash
docker logs backend2
```

### Check if container is running
```bash
docker ps
```

### Enter the container
```bash
docker exec -it backend2 bash
```

### Rebuild without cache
```bash
docker build --no-cache -t your-username/backend2:latest .
```

## Security Notes

- **Never commit `.env` file to git** - it contains sensitive credentials
- The `.env.template` file is safe to commit (contains only placeholders)
- `appsettings.json` now contains placeholders and is safe to commit
- Always use strong, unique JWT secret keys in production
- Use HTTPS in production environments

## Files Overview

- `Dockerfile`: Multi-stage build configuration for the .NET app
- `docker-compose.yml`: Local development/testing configuration
- `.env.template`: Template for environment variables
- `.env`: Your actual environment variables (not in git)
- `docker-build.sh`: Automated build and push script
- `.dockerignore`: Files to exclude from Docker build

## Production Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Use production database credentials
- [ ] Generate a strong JWT secret key (32+ characters)
- [ ] Configure proper CORS settings if needed
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure health checks and monitoring
- [ ] Set up automated backups for database
- [ ] Review and update `AllowedHosts` if needed
