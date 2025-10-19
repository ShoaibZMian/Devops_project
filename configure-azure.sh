#!/bin/bash

# Azure Infrastructure Configuration Script
# Run this AFTER installing Azure CLI and logging in with: az login

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Azure Infrastructure Configuration${NC}"
echo -e "${BLUE}=========================================${NC}\n"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed${NC}"
    echo "Please run: ./setup-infrastructure.sh first"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${RED}Error: Not logged in to Azure${NC}"
    echo "Please run: az login"
    exit 1
fi

echo -e "${GREEN}✓ Azure CLI is installed and authenticated${NC}\n"

# Get subscription info
echo -e "${BLUE}Current Azure Subscription:${NC}"
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo -e "Name: ${YELLOW}$SUBSCRIPTION_NAME${NC}"
echo -e "ID: ${YELLOW}$SUBSCRIPTION_ID${NC}\n"

# Prompt for resource group details
echo -e "${BLUE}Resource Group Configuration:${NC}"
read -p "Enter Resource Group name (or press Enter for 'Devops_Project'): " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-Devops_Project}

read -p "Enter Azure region (or press Enter for 'northeurope'): " LOCATION
LOCATION=${LOCATION:-northeurope}

echo -e "\n${GREEN}Configuration:${NC}"
echo -e "Resource Group: ${YELLOW}$RESOURCE_GROUP${NC}"
echo -e "Location: ${YELLOW}$LOCATION${NC}"
echo -e "Subscription ID: ${YELLOW}$SUBSCRIPTION_ID${NC}\n"

read -p "Continue with this configuration? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Create Resource Group
echo -e "\n${GREEN}Creating Resource Group...${NC}"
if az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}Resource Group '$RESOURCE_GROUP' already exists${NC}"
else
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    echo -e "${GREEN}✓ Resource Group created${NC}"
fi

# Create Service Principal
echo -e "\n${GREEN}Creating Service Principal for GitHub Actions...${NC}"
SP_NAME="github-actions-${RESOURCE_GROUP}"

echo -e "${YELLOW}This will create a service principal with Contributor role on the resource group${NC}"
AZURE_CREDENTIALS=$(az ad sp create-for-rbac \
    --name "$SP_NAME" \
    --role contributor \
    --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
    --sdk-auth)

echo -e "${GREEN}✓ Service Principal created${NC}\n"

# Configure Azure SQL Database firewall
echo -e "${GREEN}Configuring Azure SQL Database firewall...${NC}"
SQL_SERVER_NAME="devops-project"

echo -e "${YELLOW}Enabling 'Allow Azure services and resources to access this server'${NC}"
az sql server firewall-rule create \
    --resource-group "devops-project-rg" \
    --server "$SQL_SERVER_NAME" \
    --name "AllowAzureServices" \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0 \
    2>/dev/null || echo -e "${YELLOW}Firewall rule may already exist or server is in a different resource group${NC}"

echo -e "${GREEN}✓ Azure SQL configuration complete${NC}\n"

# Save credentials to a file
CREDS_FILE="/home/shweb/Documents/Dev/Devops_project/.azure-credentials.json"
echo "$AZURE_CREDENTIALS" > "$CREDS_FILE"
chmod 600 "$CREDS_FILE"

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Azure Infrastructure Setup Complete!${NC}"
echo -e "${BLUE}=========================================${NC}\n"

echo -e "${YELLOW}Important Information:${NC}\n"

echo -e "${GREEN}1. Azure Service Principal Credentials:${NC}"
echo -e "   Saved to: ${YELLOW}$CREDS_FILE${NC}"
echo -e "   ${RED}Keep this file secure and do not commit to Git!${NC}\n"

echo -e "${GREEN}2. GitHub Secrets Required:${NC}"
echo -e "   Copy these values to GitHub → Settings → Secrets and variables → Actions:\n"

echo -e "   ${BLUE}AZURE_CREDENTIALS:${NC}"
cat "$CREDS_FILE"
echo -e "\n"

echo -e "   ${BLUE}AZURE_SUBSCRIPTION_ID:${NC} $SUBSCRIPTION_ID"
echo -e "   ${BLUE}AZURE_RESOURCE_GROUP:${NC} $RESOURCE_GROUP"
echo -e "   ${BLUE}AZURE_LOCATION:${NC} $LOCATION\n"

echo -e "${GREEN}3. Next Steps:${NC}"
echo -e "   Run: ${YELLOW}./setup-github-secrets.sh${NC}"
echo -e "   This will automatically configure all GitHub secrets using GitHub CLI\n"

# Create a summary file
SUMMARY_FILE="/home/shweb/Documents/Dev/Devops_project/azure-setup-summary.txt"
cat > "$SUMMARY_FILE" << EOF
Azure Infrastructure Setup Summary
====================================

Date: $(date)

Azure Configuration:
- Subscription ID: $SUBSCRIPTION_ID
- Subscription Name: $SUBSCRIPTION_NAME
- Resource Group: $RESOURCE_GROUP
- Location: $LOCATION
- Service Principal: $SP_NAME

GitHub Secrets to Configure:
1. AZURE_CREDENTIALS: (see .azure-credentials.json)
2. AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID
3. AZURE_RESOURCE_GROUP: $RESOURCE_GROUP
4. AZURE_LOCATION: $LOCATION

Additional Secrets (from .env):
5. DOCKERHUB_USERNAME: shoaibzmian
6. DOCKERHUB_TOKEN: <get from hub.docker.com/settings/security>
7. DB_CONNECTION_STRING: <from backend2/.env>
8. JWT_ISSUER: <will be set after first deployment>
9. JWT_AUDIENCE: <will be set after first deployment>
10. JWT_SECRET: <from backend2/.env>

Next Steps:
- Run: ./setup-github-secrets.sh
- Or manually add secrets to: https://github.com/ShoaibZMian/Devops_project/settings/secrets/actions
EOF

echo -e "${GREEN}Summary saved to:${NC} ${YELLOW}$SUMMARY_FILE${NC}\n"
