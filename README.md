# DevOps Project - E-Commerce Application

A full-stack e-commerce application built with React TypeScript frontend and ASP.NET Core backend, featuring Docker containerization and automated deployment.

## Project Structure

```
.
├── frontend/           # React TypeScript application
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-build.sh
│   └── .env
├── backend2/          # ASP.NET Core 7.0 Web API
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-build.sh
│   └── .env
└── run-all.sh         # Script to run both services
```

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Styled Components for styling
- Axios for HTTP requests
- Heroicons for icons
- Nginx (production)

### Backend
- ASP.NET Core 7.0 Web API
- Entity Framework Core with SQL Server
- JWT Authentication
- Swagger/OpenAPI documentation

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- DockerHub registry
- Azure SQL Database

## Getting Started

### Prerequisites

**Option 1: Docker (Recommended)**
- Docker Desktop installed and running

**Option 2: Local Development**
- Node.js 18+ and npm
- .NET 7.0 SDK
- SQL Server

### Quick Start with Docker

Run both frontend and backend with a single command:

```bash
# Start both services
./run-all.sh

# Start with fresh builds
./run-all.sh --build
cd /home/shweb/Documents/Dev/Devops_project && ./run-all.sh --build 
cd /home/shweb/Documents/Dev/Devops_project/frontend && docker compose   timeout: 5m 
      build --no-cache

# Stop all services
./run-all.sh --down

# View logs
./run-all.sh --logs

# Restart services
./run-all.sh --restart

# Show help
./run-all.sh --help
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Individual Service Management

**Frontend:**
```bash
cd frontend
docker compose up -d          # Start
docker compose down           # Stop
docker compose logs -f        # View logs
./docker-build.sh            # Build and push to DockerHub
```

**Backend:**
```bash
cd backend2
docker compose up -d          # Start
docker compose down           # Stop
docker compose logs -f        # View logs
./docker-build.sh            # Build and push to DockerHub
```

### Local Development Setup

**Frontend:**
```bash
cd frontend
npm install
npm start                    # Runs on http://localhost:3000
```

**Backend:**
```bash
cd backend2
dotnet restore
dotnet run                   # Runs on http://localhost:8080
```

## Environment Configuration

### Frontend (.env)
```env
REACT_APP_HOST_IP_ADDRESS=http://localhost:8080
```

### Backend (.env)
```env
ConnectionStrings__DefaultConnection=<your-sql-server-connection>
JWT__Issuer=http://localhost:5259
JWT__Audience=http://localhost:5259
JWT__OnlineStoreGroupe24=<your-jwt-secret>
ASPNETCORE_ENVIRONMENT=Production
```

**Note:** Create your own `.env` files based on the templates. Never commit sensitive credentials.

## Features

- User authentication and authorization with JWT
- Product catalog management
- Category and subcategory organization
- Shopping cart functionality
- Order management
- Responsive web design
- RESTful API architecture
- Docker containerization

## Docker Images

Both services are built as multi-stage Docker images for optimal size and security:

- **Frontend**: Node.js build → Nginx production server
- **Backend**: .NET SDK build → ASP.NET runtime

Images can be pushed to DockerHub using the provided `docker-build.sh` scripts in each service directory.

## Database

The application uses Azure SQL Database with Entity Framework Core. The database is automatically seeded with initial data on startup.

## API Documentation

When running the backend, visit http://localhost:8080/swagger for complete API documentation with interactive testing.

## Deployment

- **Frontend**: Multi-stage Docker build with Nginx (port 3000)
- **Backend**: Multi-stage Docker build with ASP.NET Core (port 8080)
- **Database**: Azure SQL Database
- **Registry**: DockerHub (shoaibzmian/frontend, shoaibzmian/backend2)

## Troubleshooting

**Docker not running:**
```bash
# Check Docker status
docker info

# Start Docker Desktop and try again
```

**Port conflicts:**
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :8080

# Stop conflicting services or modify ports in docker-compose.yml
```

**docker-compose command not found:**
This project uses the modern `docker compose` (plugin) instead of legacy `docker-compose`. If you have the old version, either:
- Install Docker Desktop (includes the plugin), or
- Replace `docker compose` with `docker-compose` in the scripts

**Connection issues:**
Ensure the frontend `.env` file points to `http://localhost:8080` to match the backend port.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test with Docker: `./run-all.sh --build`
4. Submit a pull request
