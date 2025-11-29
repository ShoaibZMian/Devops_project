# DevOps Project - E-Commerce Application

A full-stack e-commerce application built with React TypeScript frontend and ASP.NET Core backend, containerized with Docker and deployed to Azure Container Instances with automated CI/CD.

## Live Deployment

**Production URLs:**
- Frontend: http://frontend-devops-project.northeurope.azurecontainer.io
- Backend API: http://backend2-devops-project.northeurope.azurecontainer.io
- Swagger Docs: http://backend2-devops-project.northeurope.azurecontainer.io/swagger

## Project Structure

```
.
├── frontend/                    # React TypeScript application
│   ├── Dockerfile              # Multi-stage build with runtime config
│   ├── docker-entrypoint.sh    # Generates runtime environment config
│   ├── docker-compose.yml
│   └── src/
│       ├── contexts/
│       │   └── AuthContext.tsx # Global authentication state (React Context)
│       ├── hooks/
│       │   └── useCart.ts      # Reusable cart management hook
│       ├── httpCommon.jsx      # Axios instance with JWT interceptor
│       ├── utils/auth.ts       # JWT token utilities
│       ├── views/              # Page components
│       └── components/         # Reusable UI components
├── backend2/                   # ASP.NET Core 7.0 Web API
│   ├── Dockerfile              # Multi-stage build
│   ├── docker-compose.yml
│   └── Controllers/            # API endpoints and repositories
├── .github/workflows/          # CI/CD pipelines
│   └── azure-deploy.yml        # Automated Azure deployment
├── STATE_MANAGEMENT_IMPLEMENTATION.md  # State management documentation
├── LOCAL_TESTING_GUIDE.md     # Local testing instructions
├── CLAUDE.md                   # Development guidelines for AI assistants
└── run-all.sh                  # Local development orchestration
```

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Axios for HTTP requests with JWT auto-injection
- **State Management**: React Context API for authentication, custom hooks for cart
- Runtime environment configuration
- Nginx (production)

### Backend
- ASP.NET Core 7.0 Web API
- Entity Framework Core with Azure SQL Database
- JWT Authentication
- Repository Pattern
- Auto-migration on startup
- Swagger/OpenAPI documentation

### DevOps & Infrastructure
- **CI/CD**: GitHub Actions with automated testing and deployment
- **E2E Testing**: Playwright test suite with test gates before deployment
- **Containers**: Docker multi-stage builds
- **Registry**: DockerHub (shoaibzmian/frontend, shoaibzmian/backend2)
- **Hosting**: Azure Container Instances
- **Database**: Azure SQL Database
- **Networking**: Public IPs with DNS labels

## Deployment Architecture

### Automated CI/CD Pipeline

Every push to `main` or pull request triggers a comprehensive CI/CD workflow:

#### 1. Test Gate (`.github/workflows/playwright.yml`)
Runs on every pull request and push to `main`:
- Starts test environment with Docker Compose (SQL Server, Backend, Frontend)
- Waits for services to be healthy and ready
- Runs Playwright E2E tests for cart functionality
- **Deployment is blocked if tests fail**

#### 2. Build & Push
After tests pass:
- Builds Docker images with multi-stage builds
- Tags with `latest` and commit SHA
- Pushes to DockerHub

#### 3. Deploy to Azure
- Deploys backend container to Azure Container Instances
- Deploys frontend container with backend URL
- Verifies container health

#### 4. Production Smoke Tests
Post-deployment verification:
- Tests production endpoints
- Verifies services are responding

**GitHub Secrets Configured:**
- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
- `AZURE_CREDENTIALS`, `AZURE_SUBSCRIPTION_ID`
- `AZURE_RESOURCE_GROUP`, `AZURE_LOCATION`
- `DB_CONNECTION_STRING`
- `JWT_ISSUER`, `JWT_AUDIENCE`, `JWT_SECRET`

### Azure Resources

- **Resource Group**: Devops_Project (North Europe)
- **Backend Container**: backend2 (1 CPU, 1.5GB RAM)
- **Frontend Container**: frontend (1 CPU, 1GB RAM)
- **Database**: Azure SQL Database (sqldevopss.database.windows.net)

## Local Development

### Prerequisites

**Option 1: Docker (Recommended)**
- Docker Desktop installed and running

**Option 2: Local Development**
- Node.js 18+ and npm
- .NET 7.0 SDK
- SQL Server

### Quick Start with Docker

Run both frontend and backend:

```bash
# Start both services
./run-all.sh

# Start with fresh builds
./run-all.sh --build

# Stop all services
./run-all.sh --down

# View logs
./run-all.sh --logs

# Restart services
./run-all.sh --restart
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger: http://localhost:8080/swagger

### Individual Service Management

**Frontend:**
```bash
cd frontend
docker compose up -d          # Start
docker compose down           # Stop
docker compose logs -f        # View logs
```

**Backend:**
```bash
cd backend2
docker compose up -d          # Start
docker compose down           # Stop
docker compose logs -f        # View logs
```

### Local Development (No Docker)

**Frontend:**
```bash
cd frontend
npm install
npm start                    # http://localhost:3000
```

**Backend:**
```bash
cd backend2
dotnet restore
dotnet run                   # http://localhost:8080
```

## Environment Configuration

### Frontend
For production deployment, environment variables are injected at **runtime** via `docker-entrypoint.sh`:
- `REACT_APP_HOST_IP_ADDRESS` - Backend API URL

For local development, create `frontend/.env`:
```env
REACT_APP_HOST_IP_ADDRESS=http://localhost:8080
```

### Backend
Create `backend2/.env`:
```env
ConnectionStrings__DefaultConnection=<your-sql-connection-string>
JWT__Issuer=http://localhost:5259
JWT__Audience=http://localhost:5259
JWT__OnlineStoreGroupe24=<your-jwt-secret-key>
ASPNETCORE_ENVIRONMENT=Production
```

**Important:** Never commit `.env` files to source control.

## Features

- **Authentication**: JWT-based user authentication and authorization
- **Product Management**: Full CRUD operations with categories/subcategories
- **Shopping Cart**: Client-side cart with localStorage persistence
- **Order Management**: Track and manage customer orders
- **Admin Dashboard**: Protected admin routes
- **Responsive Design**: Mobile-friendly UI
- **RESTful API**: Clean, documented API architecture
- **Auto-Deployment**: Push to main = automatic deployment
- **Automated Testing**: E2E tests with Playwright protect production from bugs
- **Test Gates**: CI/CD pipeline blocks deployment if tests fail

## State Management Architecture

### Authentication State (React Context API)

Global authentication state managed via React Context:

**Location**: `frontend/src/contexts/AuthContext.tsx`

**Provides**:
- JWT token management with localStorage persistence
- User authentication status (isAuthenticated)
- Admin authorization checks (isAdmin)
- User profile information from JWT claims
- Automatic token expiration handling
- Reactive updates across all components

**Usage in components**:
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, isAdmin, userName, login, logout } = useAuth();
  // Component automatically re-renders when auth state changes
}
```

**Key Benefits**:
- Single source of truth for auth state
- No prop drilling - any component can access via `useAuth()` hook
- Automatic logout on token expiration (checked every minute)
- Syncs with localStorage for persistence across sessions

### Cart State (Custom Hook)

Reusable cart management via custom hook:

**Location**: `frontend/src/hooks/useCart.ts`

**Provides**:
- Cart items array with auto-persistence to localStorage
- Calculated values (item count, total price)
- CRUD operations (add, remove, update quantity, clear)
- Type-safe with TypeScript interfaces

**Usage**:
```typescript
import { useCart } from '../hooks/useCart';

function ProductCard() {
  const { cart, itemCount, totalPrice, addToCart } = useCart();
  // Cart automatically syncs with localStorage
}
```

### Critical Bug Fix

**Issue**: Admin dashboard was using `sessionStorage.getItem('token')` but login stored tokens in `localStorage`

**Impact**: All admin features failed with 401 Unauthorized errors

**Solution**: Centralized all auth token access through AuthContext, eliminating direct storage access

### State Storage Strategy

| State Type | Storage Method | Scope | Persistence |
|------------|----------------|-------|-------------|
| Auth Token | Context + localStorage | Global | Cross-session |
| User Info | Context (from JWT) | Global | From token |
| Cart Items | Hook + localStorage | Component | Cross-session |
| Form Data | Component useState | Local | Session only |

**Documentation**: See `STATE_MANAGEMENT_IMPLEMENTATION.md` for detailed architecture and testing guide

## API Endpoints

### Account
- `POST /api/Account/Register` - User registration
- `POST /api/Account/Login` - User login (returns JWT)

### Products
- `GET /api/Products/GetProducts` - List all products
- `GET /api/Products/GetProduct/{id}` - Get product by ID
- `POST /api/Products/CreateProduct` - Create product (Admin)

### Categories
- `GET /api/Categories/GetCategories` - List all categories

Full API documentation: http://backend2-devops-project.northeurope.azurecontainer.io/swagger

## Password Requirements

When registering a new account:
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (!, @, #, $, etc.)

**Example**: `Test123!`

## Testing

### End-to-End Testing with Playwright

The project includes comprehensive E2E tests that run automatically in CI/CD:

**Test Suite**: `tests/cart.spec.ts`
- Add single product to cart
- Add multiple products to cart
- Add product with quantity > 1

**Running Tests Locally**:
```bash
# Install Playwright browsers (first time only)
npx playwright install --with-deps chromium

# Run all tests
npx playwright test

# Run specific test file
npx playwright test cart.spec.ts

# Run tests with UI
npx playwright test --ui

# Run specific browser
npx playwright test --project=chromium
```

**Test Environment**:
Tests run against a Docker Compose environment (`docker-compose.test.yml`) with:
- SQL Server 2022
- Backend API with auto-migrations
- Frontend served by Nginx

**CI Integration**:
- Tests run automatically on every pull request
- Tests run before deployment to production
- Deployment is blocked if any test fails
- Test reports and videos are uploaded as GitHub artifacts

### Test Reports

After test runs in GitHub Actions:
- **Playwright Report**: HTML report with screenshots/videos
- **Test Results**: Detailed test execution logs
- Both available under workflow "Artifacts"

## Database

- **Provider**: Azure SQL Database
- **Auto-Migration**: EF Core migrations run automatically on container startup
- **Seeding**: Default admin user and sample products created on first run
- **Connection**: Configured via `ConnectionStrings__DefaultConnection` environment variable

### Recent Database Migration Fixes

**Issue**: The `ImageUrl` column migration was not executing in CI, causing "Invalid column name 'ImageUrl'" errors.

**Solution**: Consolidated the `ImageUrl` column into the `InitialCreate` migration to ensure it's created from the start. This eliminates dependency on multiple migrations running in sequence and ensures consistency across all environments.

## Docker Images

Multi-stage builds for optimal size and security:

- **Frontend**: `node:18` (build) → `nginx:alpine` (serve)
- **Backend**: `dotnet/sdk:7.0` (build) → `dotnet/aspnet:7.0` (run)

Images automatically built and pushed to DockerHub on every deployment.

## CI/CD Workflows

### Playwright Test Workflow (`.github/workflows/playwright.yml`)

**Triggers**: Pull requests and pushes to `dev`, `main`, `master`

**Steps**:
1. Checkout code
2. Setup Node.js and install dependencies
3. Install Playwright browsers
4. Start test services with Docker Compose
   - SQL Server with health checks
   - Backend with auto-migrations
   - Frontend with runtime config
5. Wait for services to be ready (health check endpoints)
6. Run Playwright E2E tests
7. Upload test reports and videos as artifacts
8. Cleanup test containers

**Important**: This workflow must pass before deployment proceeds.

### Azure Deployment Workflow (`.github/workflows/azure-deploy.yml`)

**Triggers**: Push to `main` or manual workflow dispatch

**Job Dependencies**:
1. **Test Job** (runs first):
   - Runs Playwright tests
   - Must pass for deployment to proceed
2. **Build & Push Job** (requires: test):
   - Builds frontend and backend Docker images
   - Tags with `latest` and commit SHA
   - Pushes to DockerHub
3. **Deploy Job** (requires: build-and-push):
   - Deploys backend container to Azure
   - Deploys frontend container with backend URL
   - Outputs deployment URLs
   - Verifies container health
4. **Production Smoke Test** (requires: deploy-to-azure):
   - Tests production health endpoints
   - Verifies deployment success

## Troubleshooting

### Local Development

**Port conflicts:**
```bash
# Check ports
lsof -i :3000
lsof -i :8080

# Modify ports in docker-compose.yml if needed
```

**Docker not running:**
```bash
docker info  # Check Docker status
# Start Docker Desktop and retry
```

**Registration/Login returns 405 Method Not Allowed:**

This usually means the frontend can't reach the backend API.

1. Check browser console for "Backend URL:" - it should show `http://localhost:8080`
2. If it shows empty string or wrong URL:
   ```bash
   # Edit frontend/.env
   echo "REACT_APP_HOST_IP_ADDRESS=http://localhost:8080" > frontend/.env

   # Restart frontend
   cd frontend
   docker compose restart
   ```
3. Hard refresh browser (Ctrl+Shift+R) to reload environment config
4. Check browser DevTools → Application → Local Storage for proper backend URL

**Authentication state not persisting:**
- Check browser DevTools → Application → Local Storage
- Verify "token" key exists with JWT value
- If using private/incognito mode, localStorage may be blocked

### Production Deployment

**Frontend not connecting to backend:**
- Check browser console for "Backend URL:" log
- Verify `/env-config.js` is accessible
- Ensure CORS is enabled (configured in `Program.cs`)

**Container crashes:**
```bash
# Check Azure container logs
az container logs --resource-group Devops_Project --name backend2
az container logs --resource-group Devops_Project --name frontend
```

**Deployment failures:**
- Check GitHub Actions workflow run logs
- Verify all GitHub secrets are configured
- Ensure Azure resource providers are registered

## Contributing

1. Create a feature branch from `dev` or `main`
2. Make your changes
3. Test locally:
   ```bash
   # Start services
   ./run-all.sh --build

   # Run tests
   npx playwright test
   ```
4. Create a pull request
   - Playwright tests run automatically on PR
   - Tests must pass before merging
5. Merge to `main`
   - Tests run again
   - If tests pass, automatic deployment to Azure
   - Production smoke tests verify deployment
6. Verify deployment at production URLs

**Quality Gates**:
- All E2E tests must pass
- Docker containers must build successfully
- Azure deployment must complete without errors
- Production health checks must succeed

## License

This project is for educational purposes.
