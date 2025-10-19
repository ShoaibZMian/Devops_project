#!/bin/bash

# Azure Infrastructure Setup Script
# This script helps set up Azure CLI, GitHub CLI, and configure infrastructure for deployment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Azure Infrastructure Setup${NC}"
echo -e "${BLUE}=========================================${NC}\n"

# Step 1: Install Azure CLI
echo -e "${GREEN}Step 1: Installing Azure CLI...${NC}"
if command -v az &> /dev/null; then
    echo -e "${YELLOW}Azure CLI is already installed${NC}"
    az version
else
    echo "Installing Azure CLI..."
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
    echo -e "${GREEN}Azure CLI installed successfully${NC}"
fi

# Step 2: Install GitHub CLI
echo -e "\n${GREEN}Step 2: Installing GitHub CLI...${NC}"
if command -v gh &> /dev/null; then
    echo -e "${YELLOW}GitHub CLI is already installed${NC}"
    gh --version
else
    echo "Installing GitHub CLI..."
    sudo mkdir -p -m 755 /etc/apt/keyrings
    wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
    sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt update
    sudo apt install gh -y
    echo -e "${GREEN}GitHub CLI installed successfully${NC}"
fi

echo -e "\n${BLUE}=========================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${BLUE}=========================================${NC}"
echo -e "\nNext steps:"
echo -e "1. Run: ${YELLOW}az login${NC} to authenticate with Azure"
echo -e "2. Run: ${YELLOW}gh auth login${NC} to authenticate with GitHub"
echo -e "3. Continue with the infrastructure setup\n"
