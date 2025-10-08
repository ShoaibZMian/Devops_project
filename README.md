# Backend Project

A full-stack e-commerce application built with React TypeScript frontend and ASP.NET Core backend.

## Project Structure

- **`/frontend/`** - React TypeScript application
- **`/backend2/`** - ASP.NET Core 7.0 Web API

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Styled Components for styling
- Axios for HTTP requests
- Heroicons for icons

### Backend
- ASP.NET Core 7.0 Web API
- Entity Framework Core with SQL Server
- JWT Authentication
- Swagger/OpenAPI documentation
- Docker support

## Getting Started

### Prerequisites
- Node.js and npm (for frontend)
- .NET 7.0 SDK (for backend)
- SQL Server (for database)

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will be available at http://localhost:3000

### Backend Setup
```bash
cd backend2
dotnet restore
dotnet run
```
The API will be available at https://localhost:7xxx with Swagger UI in development mode.

## Features

- User authentication and authorization with JWT
- Product catalog management
- Category and subcategory organization
- Shopping cart functionality
- Order management
- Responsive web design

## Database

The application uses SQL Server with Entity Framework Core. The database is automatically seeded with initial data on startup.

## Deployment

- **Frontend**: Deployed to Vercel with automatic deployment from master branch
- **Backend**: Docker-ready with included Dockerfile
- Live demo available in the About section

## API Documentation

When running in development mode, visit the Swagger UI at `/swagger` for complete API documentation.
