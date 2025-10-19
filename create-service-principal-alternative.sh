#!/bin/bash

# Alternative Service Principal Creation Methods
# Use this when you don't have permissions to create service principals

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Service Principal Creation - Alternatives${NC}"
echo -e "${BLUE}=========================================${NC}\n"

echo -e "${RED}⚠️  You don't have permissions to create service principals${NC}"
echo -e "${YELLOW}This requires Azure AD tenant admin privileges${NC}\n"

echo -e "${GREEN}Choose an alternative:${NC}\n"

echo -e "${BLUE}Option 1: Use GitHub OIDC Federated Identity (Recommended)${NC}"
echo -e "   ✓ No secrets needed (more secure)"
echo -e "   ✓ No expiration issues"
echo -e "   ✓ Requires app registration (may still need admin)\n"

echo -e "${BLUE}Option 2: Ask Your Azure Admin${NC}"
echo -e "   ✓ Admin creates service principal for you"
echo -e "   ✓ You get the credentials to use\n"

echo -e "${BLUE}Option 3: Use Azure Portal${NC}"
echo -e "   ✓ Create service principal via Azure Portal"
echo -e "   ✓ Sometimes has different permission requirements\n"

read -p "Which option do you want to try? (1/2/3): " CHOICE

case $CHOICE in
    1)
        echo -e "\n${GREEN}Setting up GitHub OIDC Federated Identity...${NC}\n"

        # Check if user has subscription access
        if ! az account show &> /dev/null; then
            echo -e "${RED}Error: Not logged in to Azure${NC}"
            exit 1
        fi

        SUBSCRIPTION_ID=$(az account show --query id -o tsv)
        TENANT_ID=$(az account show --query tenantId -o tsv)

        read -p "Enter Resource Group name: " RESOURCE_GROUP
        read -p "Enter App Registration name (e.g., gh-actions-devops): " APP_NAME
        APP_NAME=${APP_NAME:-gh-actions-devops}

        echo -e "\n${YELLOW}Attempting to create app registration...${NC}"

        # Try to create app registration
        APP_ID=$(az ad app create \
            --display-name "$APP_NAME" \
            --query appId -o tsv 2>&1)

        if [[ $? -ne 0 ]]; then
            echo -e "\n${RED}❌ Cannot create app registration - admin privileges required${NC}\n"
            echo -e "${YELLOW}Please ask your Azure AD admin to:${NC}"
            echo -e "1. Create an app registration named: ${BLUE}$APP_NAME${NC}"
            echo -e "2. Create a service principal for it"
            echo -e "3. Assign Contributor role on resource group: ${BLUE}$RESOURCE_GROUP${NC}"
            echo -e "4. Configure GitHub OIDC federated credentials with:"
            echo -e "   - Issuer: ${BLUE}https://token.actions.githubusercontent.com${NC}"
            echo -e "   - Subject: ${BLUE}repo:ShoaibZMian/Devops_project:ref:refs/heads/main${NC}"
            echo -e "   - Audience: ${BLUE}api://AzureADTokenExchange${NC}\n"
            exit 1
        fi

        echo -e "${GREEN}✓ App created: $APP_ID${NC}"
        echo -e "Setting up federated credentials...\n"

        # Continue with OIDC setup...
        # (This will also likely fail without permissions, but we'll try)
        ;;

    2)
        echo -e "\n${GREEN}Admin Request Instructions${NC}\n"

        SUBSCRIPTION_ID=$(az account show --query id -o tsv)
        TENANT_ID=$(az account show --query tenantId -o tsv)

        read -p "Enter Resource Group name: " RESOURCE_GROUP

        cat > admin-request.txt << EOF
Azure Service Principal Request
================================

Please create a service principal for GitHub Actions deployment with the following settings:

1. Service Principal Details:
   - Name: github-actions-${RESOURCE_GROUP}
   - Subscription ID: ${SUBSCRIPTION_ID}
   - Tenant ID: ${TENANT_ID}

2. Role Assignment:
   - Role: Contributor
   - Scope: /subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}

3. Create using this Azure CLI command:

   az ad sp create-for-rbac \\
     --name "github-actions-${RESOURCE_GROUP}" \\
     --role contributor \\
     --scopes "/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}" \\
     --json-auth

4. Please provide the JSON output which contains:
   - clientId
   - clientSecret
   - subscriptionId
   - tenantId

This will be used for automated GitHub Actions deployments.

Thank you!
EOF

        echo -e "${GREEN}✓ Admin request saved to: ${YELLOW}admin-request.txt${NC}\n"
        echo -e "${YELLOW}Next steps:${NC}"
        echo -e "1. Send ${BLUE}admin-request.txt${NC} to your Azure AD administrator"
        echo -e "2. Wait for the JSON credentials"
        echo -e "3. Save the JSON to ${BLUE}.azure-credentials.json${NC}"
        echo -e "4. Run ${BLUE}./setup-github-secrets.sh${NC}\n"
        ;;

    3)
        echo -e "\n${GREEN}Azure Portal Method${NC}\n"

        SUBSCRIPTION_ID=$(az account show --query id -o tsv)
        read -p "Enter Resource Group name: " RESOURCE_GROUP

        echo -e "${YELLOW}Follow these steps in Azure Portal:${NC}\n"
        echo -e "1. Go to: ${BLUE}https://portal.azure.com${NC}"
        echo -e "2. Navigate to: ${BLUE}Azure Active Directory → App registrations${NC}"
        echo -e "3. Click: ${BLUE}New registration${NC}"
        echo -e "4. Enter name: ${BLUE}github-actions-${RESOURCE_GROUP}${NC}"
        echo -e "5. Click: ${BLUE}Register${NC}"
        echo -e "6. Copy the ${BLUE}Application (client) ID${NC}"
        echo -e "7. Go to: ${BLUE}Certificates & secrets → New client secret${NC}"
        echo -e "8. Create secret and copy the ${BLUE}Value${NC} (not Secret ID)"
        echo -e "9. Go to Resource Group: ${BLUE}$RESOURCE_GROUP${NC}"
        echo -e "10. Click: ${BLUE}Access control (IAM) → Add role assignment${NC}"
        echo -e "11. Select role: ${BLUE}Contributor${NC}"
        echo -e "12. Assign to the app you created\n"

        echo -e "${YELLOW}Then create this JSON file as .azure-credentials.json:${NC}\n"

        TENANT_ID=$(az account show --query tenantId -o tsv)

        cat << EOF
{
  "clientId": "PASTE_APPLICATION_CLIENT_ID_HERE",
  "clientSecret": "PASTE_CLIENT_SECRET_VALUE_HERE",
  "subscriptionId": "${SUBSCRIPTION_ID}",
  "tenantId": "${TENANT_ID}"
}
EOF
        echo -e "\n${GREEN}After creating the file, run: ${YELLOW}./setup-github-secrets.sh${NC}\n"
        ;;

    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Instructions Complete${NC}"
echo -e "${BLUE}=========================================${NC}\n"
