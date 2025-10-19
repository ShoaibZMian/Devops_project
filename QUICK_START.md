# 🚀 Quick Start - Azure Deployment

Get your application deployed to Azure in 5 minutes!

## Prerequisites

- Ubuntu/Linux system
- Docker installed
- Git repository: https://github.com/ShoaibZMian/Devops_project
- Azure account (with active subscription)
- DockerHub account

## One-Command Setup

Run the master setup script:

```bash
./deploy-setup.sh
```

This will automatically:
1. ✅ Install Azure CLI and GitHub CLI
2. ✅ Login to Azure and GitHub
3. ✅ Create Azure Resource Group and Service Principal
4. ✅ Configure all GitHub Secrets
5. ✅ Prepare for deployment

## What You'll Need

When prompted, have these ready:

1. **Azure Login**: Your Azure account credentials
2. **GitHub Login**: Your GitHub account credentials
3. **Resource Group Name**: Default: `Devops_Project`
4. **Azure Location**: Default: `northeurope`
5. **DockerHub Token**: Get from https://hub.docker.com/settings/security

## After Setup

### Deploy to Azure

```bash
# Commit and push (triggers automatic deployment)
git add .
git commit -m "Add Azure deployment"
git push origin main
```

Or manually trigger:

```bash
gh workflow run azure-deploy.yml
```

### Monitor Deployment

```bash
# Watch deployment progress
gh run watch

# View deployment logs
gh run view
```

### Access Your Application

After deployment completes (3-5 minutes), get your URLs:

```bash
az container list --resource-group <your-rg-name> --output table
```

URLs will be:
- **Frontend**: `http://frontend-<rg-name>.<location>.azurecontainer.io`
- **Backend**: `http://backend2-<rg-name>.<location>.azurecontainer.io`
- **API Docs**: `http://backend2-<rg-name>.<location>.azurecontainer.io/swagger`

## Troubleshooting

### Setup Issues

```bash
# Check if CLIs are installed
az --version
gh --version

# Verify authentication
az account show
gh auth status
```

### Deployment Issues

```bash
# View workflow runs
gh run list

# Check container logs
az container logs --resource-group <rg-name> --name backend2
az container logs --resource-group <rg-name> --name frontend
```

### Need Help?

See detailed documentation:
- **INFRASTRUCTURE_SETUP.md** - Complete setup guide with troubleshooting
- **.github/DEPLOYMENT_SETUP.md** - GitHub Actions workflow details

## Alternative: Manual Setup

If you prefer manual control:

### Step 1: Install Tools
```bash
./setup-infrastructure.sh
```

### Step 2: Login
```bash
az login
gh auth login
```

### Step 3: Configure Azure
```bash
./configure-azure.sh
```

### Step 4: Setup GitHub Secrets
```bash
./setup-github-secrets.sh
```

### Step 5: Deploy
```bash
git push origin main
```

## Post-Deployment

### Update JWT URLs

After first deployment, update JWT settings with actual backend URL:

```bash
BACKEND_URL="http://backend2-<rg-name>.<location>.azurecontainer.io"

gh secret set JWT_ISSUER --body "$BACKEND_URL" --repo ShoaibZMian/Devops_project
gh secret set JWT_AUDIENCE --body "$BACKEND_URL" --repo ShoaibZMian/Devops_project

# Redeploy
gh workflow run azure-deploy.yml
```

## Cost Estimate

Azure resources will cost approximately:
- **Container Instances**: ~$30-60/month
- **Networking**: ~$5/month
- **Azure SQL**: As per your existing plan

Total: ~$35-65/month

## Cleanup

To remove all Azure resources:

```bash
# Delete everything (careful!)
az group delete --name <your-rg-name> --yes
```

---

**Ready to deploy?** Run `./deploy-setup.sh` and follow the prompts! 🎉
