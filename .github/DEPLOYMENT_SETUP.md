# Azure Deployment Setup Guide

This guide explains how to configure GitHub Actions for automated deployment to Azure.

## Prerequisites

1. **Azure Account** with an active subscription
2. **DockerHub Account** for storing container images
3. **Azure SQL Database** (already configured)
4. **GitHub Repository** with admin access

## Required GitHub Secrets

Navigate to your repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### DockerHub Configuration

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DOCKERHUB_USERNAME` | Your DockerHub username | `shoaibzmian` |
| `DOCKERHUB_TOKEN` | DockerHub access token ([Create here](https://hub.docker.com/settings/security)) | `dckr_pat_xxxxx...` |

### Azure Configuration

| Secret Name | Description | How to Get |
|------------|-------------|-----------|
| `AZURE_CREDENTIALS` | Service principal JSON | See instructions below |
| `AZURE_SUBSCRIPTION_ID` | Your Azure subscription ID | Find in Azure Portal → Subscriptions |
| `AZURE_RESOURCE_GROUP` | Resource group name | Choose existing or create new |
| `AZURE_LOCATION` | Azure region | e.g., `northeurope`, `westus2` |

### Application Configuration

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DB_CONNECTION_STRING` | Azure SQL connection string | Your existing connection string |
| `JWT_ISSUER` | JWT token issuer URL | `https://your-backend.azurecontainerapps.io` |
| `JWT_AUDIENCE` | JWT token audience URL | `https://your-backend.azurecontainerapps.io` |
| `JWT_SECRET` | JWT secret key | Your existing secret key |

## Setting Up Azure Service Principal

1. **Install Azure CLI** (if not already installed):
   ```bash
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **Login to Azure**:
   ```bash
   az login
   ```

3. **Get your Subscription ID**:
   ```bash
   az account show --query id -o tsv
   ```

4. **Create Service Principal**:
   ```bash
   az ad sp create-for-rbac \
     --name "github-actions-devops" \
     --role contributor \
     --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP} \
     --sdk-auth
   ```

   Replace `{SUBSCRIPTION_ID}` and `{RESOURCE_GROUP}` with your values.

5. **Copy the JSON output** and save it as the `AZURE_CREDENTIALS` secret:
   ```json
   {
     "clientId": "xxxxx",
     "clientSecret": "xxxxx",
     "subscriptionId": "xxxxx",
     "tenantId": "xxxxx"
   }
   ```

## Creating Azure Resource Group

If you don't have a resource group yet:

```bash
az group create \
  --name your-resource-group-name \
  --location northeurope
```

## Workflow Triggers

The deployment workflow runs:
- **Automatically** on every push to the `main` branch
- **Manually** via GitHub Actions tab → "Build and Deploy to Azure" → "Run workflow"

## Deployment Process

The workflow performs the following steps:

1. **Build Phase**:
   - Builds frontend Docker image
   - Builds backend Docker image
   - Pushes both images to DockerHub with `latest` and commit SHA tags

2. **Deploy Phase**:
   - Creates Azure Virtual Network (if not exists)
   - Deploys backend container to Azure Container Instances
   - Deploys frontend container to Azure Container Instances
   - Configures inter-service networking
   - Sets environment variables from GitHub secrets

3. **Verification**:
   - Checks container health
   - Displays deployment URLs

## Post-Deployment

After successful deployment, you'll see output like:

```
Frontend URL: http://frontend-{resource-group}.{location}.azurecontainer.io
Backend URL: http://backend2-{resource-group}.{location}.azurecontainer.io
Backend Swagger: http://backend2-{resource-group}.{location}.azurecontainer.io/swagger
```

## Networking Architecture

- Both containers are deployed in the same Azure Virtual Network (`devops-vnet`)
- Containers can communicate with each other via their container names
- Both containers have public IP addresses with DNS names
- Frontend connects to backend via public FQDN (configured via `REACT_APP_HOST_IP_ADDRESS`)

## Monitoring and Logs

View container logs in Azure Portal:

1. Navigate to Resource Group
2. Click on the container instance
3. Go to "Containers" → "Logs"

Or via Azure CLI:
```bash
# Backend logs
az container logs \
  --resource-group {RESOURCE_GROUP} \
  --name backend2

# Frontend logs
az container logs \
  --resource-group {RESOURCE_GROUP} \
  --name frontend
```

## Troubleshooting

### Deployment Fails at "Azure Login"
- Verify `AZURE_CREDENTIALS` is valid JSON
- Ensure service principal has `contributor` role on the resource group

### Containers Fail to Start
- Check container logs in Azure Portal
- Verify all environment variables are set correctly
- Check if Azure SQL firewall allows connections from Azure services

### Frontend Can't Connect to Backend
- Verify backend FQDN is correctly set in frontend environment
- Check if backend container is running: `az container show --name backend2 --resource-group {RG}`
- Test backend directly: `curl http://backend2-{rg}.{location}.azurecontainer.io/swagger`

### Database Connection Issues
- Add Azure Container Instance IP range to Azure SQL firewall
- Or enable "Allow Azure services" in SQL Server firewall settings

## Cost Optimization

Azure Container Instances pricing is based on:
- CPU cores (1 core per container = ~$44/month)
- Memory (1.5GB backend, 1GB frontend)
- Running time

To reduce costs:
- Use lower resource allocations if sufficient
- Stop containers when not needed:
  ```bash
  az container stop --name {container} --resource-group {rg}
  ```

## Manual Deployment

To deploy manually without pushing to main:

1. Go to GitHub Actions tab
2. Select "Build and Deploy to Azure"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Updating Environment Variables

To update environment variables after deployment:

```bash
az container delete --resource-group {RG} --name {CONTAINER} --yes
# Then re-run the GitHub Actions workflow
```

Or update GitHub secrets and trigger a new deployment.
