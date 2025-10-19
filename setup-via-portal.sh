#!/bin/bash

# Setup Guide: Creating Service Principal via Azure Portal
# Use this when CLI fails due to insufficient permissions

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}║   Azure Service Principal Setup via Portal               ║${NC}"
echo -e "${BLUE}║   (When CLI permissions are insufficient)                ║${NC}"
echo -e "${BLUE}║                                                           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}\n"

# Get Azure information
if ! az account show &> /dev/null; then
    echo -e "${RED}Error: Not logged in to Azure${NC}"
    echo "Please run: az login"
    exit 1
fi

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)

echo -e "${GREEN}Your Azure Information:${NC}"
echo -e "Subscription: ${YELLOW}$SUBSCRIPTION_NAME${NC}"
echo -e "Subscription ID: ${YELLOW}$SUBSCRIPTION_ID${NC}"
echo -e "Tenant ID: ${YELLOW}$TENANT_ID${NC}\n"

read -p "Enter your Resource Group name: " RESOURCE_GROUP
read -p "Enter Azure Location (default: northeurope): " LOCATION
LOCATION=${LOCATION:-northeurope}

APP_NAME="github-actions-${RESOURCE_GROUP}"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 1: Create App Registration in Azure Portal${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo -e "1. Open Azure Portal: ${YELLOW}https://portal.azure.com${NC}"
echo -e "2. Go to: ${YELLOW}Azure Active Directory${NC} → ${YELLOW}App registrations${NC}"
echo -e "3. Click: ${YELLOW}New registration${NC}"
echo -e "4. Fill in:"
echo -e "   • Name: ${YELLOW}${APP_NAME}${NC}"
echo -e "   • Supported account types: ${YELLOW}Accounts in this organizational directory only (Single tenant)${NC}"
echo -e "   • Redirect URI: ${YELLOW}Leave blank${NC}"
echo -e "5. Click: ${YELLOW}Register${NC}"
echo -e "6. ${RED}COPY the 'Application (client) ID'${NC} - you'll need it!\n"

read -p "Press Enter after you've created the app and copied the Client ID..."
echo ""
read -p "Paste the Application (client) ID here: " CLIENT_ID

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 2: Create Client Secret${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo -e "1. In your app registration (${YELLOW}${APP_NAME}${NC}):"
echo -e "2. Go to: ${YELLOW}Certificates & secrets${NC}"
echo -e "3. Click: ${YELLOW}New client secret${NC}"
echo -e "4. Description: ${YELLOW}GitHub Actions${NC}"
echo -e "5. Expires: ${YELLOW}24 months${NC} (or as per your policy)"
echo -e "6. Click: ${YELLOW}Add${NC}"
echo -e "7. ${RED}IMMEDIATELY COPY the 'Value' (not Secret ID)${NC}"
echo -e "   ${RED}⚠️  You can only see this ONCE!${NC}\n"

read -p "Press Enter after creating the secret..."
echo ""
read -p "Paste the Client Secret Value here: " -s CLIENT_SECRET
echo ""

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 3: Assign Contributor Role to Resource Group${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo -e "1. In Azure Portal, search for: ${YELLOW}${RESOURCE_GROUP}${NC}"
echo -e "2. Open the Resource Group"
echo -e "3. Click: ${YELLOW}Access control (IAM)${NC} in the left menu"
echo -e "4. Click: ${YELLOW}Add${NC} → ${YELLOW}Add role assignment${NC}"
echo -e "5. Select role: ${YELLOW}Contributor${NC}"
echo -e "6. Click: ${YELLOW}Next${NC}"
echo -e "7. Click: ${YELLOW}Select members${NC}"
echo -e "8. Search for: ${YELLOW}${APP_NAME}${NC}"
echo -e "9. Select it and click: ${YELLOW}Select${NC}"
echo -e "10. Click: ${YELLOW}Review + assign${NC}\n"

read -p "Press Enter after assigning the role..."
echo ""

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 4: Creating Credentials File${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Create credentials JSON
CREDS_FILE=".azure-credentials.json"
cat > "$CREDS_FILE" << EOF
{
  "clientId": "${CLIENT_ID}",
  "clientSecret": "${CLIENT_SECRET}",
  "subscriptionId": "${SUBSCRIPTION_ID}",
  "tenantId": "${TENANT_ID}"
}
EOF

chmod 600 "$CREDS_FILE"

echo -e "${GREEN}✓ Credentials saved to: ${YELLOW}${CREDS_FILE}${NC}\n"

# Validate JSON
if command -v jq &> /dev/null; then
    if jq empty "$CREDS_FILE" 2>/dev/null; then
        echo -e "${GREEN}✓ JSON is valid${NC}\n"
    else
        echo -e "${RED}✗ JSON is invalid - please check the file${NC}\n"
        exit 1
    fi
fi

# Create summary file
SUMMARY_FILE="azure-setup-summary.txt"
cat > "$SUMMARY_FILE" << EOF
Azure Service Principal Setup Summary (Portal Method)
======================================================

Date: $(date)

Azure Configuration:
- Subscription ID: ${SUBSCRIPTION_ID}
- Subscription Name: ${SUBSCRIPTION_NAME}
- Tenant ID: ${TENANT_ID}
- Resource Group: ${RESOURCE_GROUP}
- Location: ${LOCATION}
- App Registration: ${APP_NAME}
- Client ID: ${CLIENT_ID}

Credentials File: ${CREDS_FILE}

Next Steps:
1. Run: ./setup-github-secrets.sh
2. Deploy: git push origin main

GitHub Secrets to be Configured:
- AZURE_CREDENTIALS (from ${CREDS_FILE})
- AZURE_SUBSCRIPTION_ID: ${SUBSCRIPTION_ID}
- AZURE_RESOURCE_GROUP: ${RESOURCE_GROUP}
- AZURE_LOCATION: ${LOCATION}
- DOCKERHUB_USERNAME
- DOCKERHUB_TOKEN
- DB_CONNECTION_STRING
- JWT_ISSUER
- JWT_AUDIENCE
- JWT_SECRET
EOF

echo -e "${GREEN}✓ Summary saved to: ${YELLOW}${SUMMARY_FILE}${NC}\n"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Service Principal Setup Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}\n"
echo -e "1. ${GREEN}Setup GitHub Secrets:${NC}"
echo -e "   ${YELLOW}./setup-github-secrets.sh${NC}\n"

echo -e "2. ${GREEN}Or manually verify credentials:${NC}"
echo -e "   ${YELLOW}cat ${CREDS_FILE}${NC}\n"

echo -e "${RED}⚠️  Security Reminder:${NC}"
echo -e "   ${YELLOW}${CREDS_FILE}${NC} is already in .gitignore"
echo -e "   DO NOT commit it to Git!\n"

# Test the service principal (optional)
read -p "Do you want to test the service principal login? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}Testing service principal login...${NC}"
    if az login --service-principal \
        -u "$CLIENT_ID" \
        -p "$CLIENT_SECRET" \
        --tenant "$TENANT_ID" &> /dev/null; then
        echo -e "${GREEN}✓ Service principal login successful!${NC}\n"
        # Switch back to user account
        az login &> /dev/null
    else
        echo -e "${RED}✗ Service principal login failed${NC}"
        echo -e "${YELLOW}Please verify:${NC}"
        echo -e "  1. Client ID and Secret are correct"
        echo -e "  2. Role assignment was completed"
        echo -e "  3. Wait a few minutes for permissions to propagate\n"
    fi
fi

echo -e "${GREEN}Setup complete! Run ./setup-github-secrets.sh to continue.${NC}\n"
