#!/bin/bash

# GitHub Secrets Configuration Script
# Run this AFTER running configure-azure.sh and logging in with: gh auth login

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}GitHub Secrets Configuration${NC}"
echo -e "${BLUE}=========================================${NC}\n"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI is not installed${NC}"
    echo "Please run: ./setup-infrastructure.sh first"
    exit 1
fi

# Check if logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Not logged in to GitHub. Logging in now...${NC}"
    gh auth login
fi

echo -e "${GREEN}✓ GitHub CLI is installed and authenticated${NC}\n"

# Repository
REPO="ShoaibZMian/Devops_project"
echo -e "${BLUE}Repository:${NC} ${YELLOW}$REPO${NC}\n"

# Check if Azure credentials file exists
CREDS_FILE="/home/shweb/Documents/Dev/Devops_project/.azure-credentials.json"
if [ ! -f "$CREDS_FILE" ]; then
    echo -e "${RED}Error: Azure credentials file not found${NC}"
    echo "Please run: ./configure-azure.sh first"
    exit 1
fi

# Load backend .env file for database and JWT settings
ENV_FILE="/home/shweb/Documents/Dev/Devops_project/backend2/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: backend2/.env file not found${NC}"
    exit 1
fi

# Extract values from .env
DB_CONNECTION=$(grep "^ConnectionStrings__DefaultConnection=" "$ENV_FILE" | cut -d'=' -f2-)
JWT_SECRET=$(grep "^JWT__OnlineStoreGroupe24=" "$ENV_FILE" | cut -d'=' -f2-)

# Prompt for missing values
echo -e "${BLUE}Setting up GitHub Secrets...${NC}\n"

read -p "Enter your DockerHub username (default: shoaibzmian): " DOCKERHUB_USER
DOCKERHUB_USER=${DOCKERHUB_USER:-shoaibzmian}

echo -e "${YELLOW}Get your DockerHub token from: https://hub.docker.com/settings/security${NC}"
read -p "Enter your DockerHub access token: " DOCKERHUB_TOKEN

read -p "Enter Azure Resource Group name (from configure-azure.sh): " AZURE_RG
read -p "Enter Azure Location (default: northeurope: " AZURE_LOCATION
AZURE_LOCATION=${AZURE_LOCATION:-northeurope}

# Get Azure Subscription ID
AZURE_SUB_ID=$(jq -r '.subscriptionId' "$CREDS_FILE")

# Read Azure credentials
AZURE_CREDS=$(cat "$CREDS_FILE")

# For now, use localhost for JWT issuer/audience (will update after deployment)
JWT_ISSUER="http://localhost:5259"
JWT_AUDIENCE="http://localhost:5259"

echo -e "\n${GREEN}Setting GitHub Secrets...${NC}\n"

# Set secrets
echo "Setting DOCKERHUB_USERNAME..."
gh secret set DOCKERHUB_USERNAME --body "$DOCKERHUB_USER" --repo "$REPO"

echo "Setting DOCKERHUB_TOKEN..."
gh secret set DOCKERHUB_TOKEN --body "$DOCKERHUB_TOKEN" --repo "$REPO"

echo "Setting AZURE_CREDENTIALS..."
gh secret set AZURE_CREDENTIALS --body "$AZURE_CREDS" --repo "$REPO"

echo "Setting AZURE_SUBSCRIPTION_ID..."
gh secret set AZURE_SUBSCRIPTION_ID --body "$AZURE_SUB_ID" --repo "$REPO"

echo "Setting AZURE_RESOURCE_GROUP..."
gh secret set AZURE_RESOURCE_GROUP --body "$AZURE_RG" --repo "$REPO"

echo "Setting AZURE_LOCATION..."
gh secret set AZURE_LOCATION --body "$AZURE_LOCATION" --repo "$REPO"

echo "Setting DB_CONNECTION_STRING..."
gh secret set DB_CONNECTION_STRING --body "$DB_CONNECTION" --repo "$REPO"

echo "Setting JWT_ISSUER..."
gh secret set JWT_ISSUER --body "$JWT_ISSUER" --repo "$REPO"

echo "Setting JWT_AUDIENCE..."
gh secret set JWT_AUDIENCE --body "$JWT_AUDIENCE" --repo "$REPO"

echo "Setting JWT_SECRET..."
gh secret set JWT_SECRET --body "$JWT_SECRET" --repo "$REPO"

echo -e "\n${BLUE}=========================================${NC}"
echo -e "${GREEN}All GitHub Secrets Set Successfully!${NC}"
echo -e "${BLUE}=========================================${NC}\n"

# List all secrets
echo -e "${GREEN}Verifying secrets...${NC}"
gh secret list --repo "$REPO"

echo -e "\n${YELLOW}Important Notes:${NC}"
echo -e "1. JWT_ISSUER and JWT_AUDIENCE are currently set to localhost"
echo -e "2. After first deployment, update them with the backend URL:"
echo -e "   ${BLUE}gh secret set JWT_ISSUER --body 'http://your-backend-url' --repo $REPO${NC}"
echo -e "   ${BLUE}gh secret set JWT_AUDIENCE --body 'http://your-backend-url' --repo $REPO${NC}\n"

echo -e "${GREEN}Next Steps:${NC}"
echo -e "1. Push changes to trigger deployment:"
echo -e "   ${YELLOW}git add .${NC}"
echo -e "   ${YELLOW}git commit -m 'Add GitHub Actions deployment workflow'${NC}"
echo -e "   ${YELLOW}git push origin main${NC}\n"
echo -e "2. Or manually trigger the workflow:"
echo -e "   ${YELLOW}gh workflow run azure-deploy.yml --repo $REPO${NC}\n"
echo -e "3. Monitor deployment:"
echo -e "   ${YELLOW}gh run list --repo $REPO${NC}"
echo -e "   ${YELLOW}gh run watch --repo $REPO${NC}\n"
