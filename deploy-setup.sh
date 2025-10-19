#!/bin/bash

# Complete Deployment Setup - Master Script
# This script runs all setup steps in order

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     Azure Infrastructure & GitHub Actions Setup          ║
║     For E-Commerce Application Deployment                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

echo -e "${YELLOW}This script will guide you through the complete setup process.${NC}"
echo -e "${YELLOW}The setup includes:${NC}"
echo -e "  1. Installing Azure CLI and GitHub CLI"
echo -e "  2. Configuring Azure infrastructure (Resource Group, Service Principal)"
echo -e "  3. Setting up GitHub Secrets for automated deployment"
echo -e "  4. Preparing for deployment\n"

read -p "Press Enter to begin setup or Ctrl+C to cancel..."
echo ""

# Step 1: Install CLIs
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 1/4: Installing Required Tools${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

./setup-infrastructure.sh

# Step 2: Azure Authentication
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 2/4: Azure Authentication${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Please login to Azure...${NC}"
    az login
else
    echo -e "${GREEN}✓ Already logged in to Azure${NC}"
    CURRENT_ACCOUNT=$(az account show --query name -o tsv)
    echo -e "Current account: ${YELLOW}$CURRENT_ACCOUNT${NC}\n"
    read -p "Continue with this account? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        az login
    fi
fi

# Step 3: GitHub Authentication
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 3/4: GitHub Authentication${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Please login to GitHub...${NC}"
    gh auth login
else
    echo -e "${GREEN}✓ Already logged in to GitHub${NC}"
fi

# Step 4: Configure Azure Infrastructure
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 4/4: Configure Azure Infrastructure${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

./configure-azure.sh

# Step 5: Setup GitHub Secrets
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 5/5: Setup GitHub Secrets${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

./setup-github-secrets.sh

# Final Summary
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}\n"

echo -e "1. ${GREEN}Review the generated files:${NC}"
echo -e "   - ${BLUE}.azure-credentials.json${NC} (Service Principal credentials)"
echo -e "   - ${BLUE}azure-setup-summary.txt${NC} (Setup summary)\n"

echo -e "2. ${GREEN}Deploy your application:${NC}"
echo -e "   ${YELLOW}git add .${NC}"
echo -e "   ${YELLOW}git commit -m 'Add GitHub Actions deployment workflow'${NC}"
echo -e "   ${YELLOW}git push origin main${NC}\n"

echo -e "3. ${GREEN}Or trigger manual deployment:${NC}"
echo -e "   ${YELLOW}gh workflow run azure-deploy.yml${NC}\n"

echo -e "4. ${GREEN}Monitor deployment:${NC}"
echo -e "   ${YELLOW}gh run watch${NC}\n"

echo -e "5. ${GREEN}After deployment, get your app URLs:${NC}"
echo -e "   Check GitHub Actions output or run:"
echo -e "   ${YELLOW}az container list --resource-group <your-rg> --output table${NC}\n"

echo -e "${BLUE}📚 Documentation:${NC}"
echo -e "   - ${YELLOW}INFRASTRUCTURE_SETUP.md${NC} - Complete setup guide"
echo -e "   - ${YELLOW}.github/DEPLOYMENT_SETUP.md${NC} - Deployment workflow details\n"

echo -e "${RED}⚠️  Security Reminder:${NC}"
echo -e "   ${YELLOW}.azure-credentials.json${NC} contains sensitive data!"
echo -e "   It's already in .gitignore - DO NOT commit it to Git!\n"

echo -e "${GREEN}Happy Deploying! 🚀${NC}\n"
