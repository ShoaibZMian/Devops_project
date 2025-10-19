# Manual Service Principal Setup

## Problem

You're getting this error:
```
ERROR: Insufficient privileges to complete the operation.
```

This means you don't have Azure AD admin permissions to create service principals via CLI.

## Solutions

### ✅ Solution 1: Azure Portal Method (Try First)

Sometimes the Azure Portal has different permissions than the CLI. Follow these steps:

#### Step 1: Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to: **Azure Active Directory** → **App registrations**
3. Click: **New registration**
4. Enter:
   - Name: `github-actions-devops`
   - Supported account types: **Single tenant**
   - Redirect URI: Leave blank
5. Click **Register**
6. **Copy the Application (client) ID** - you'll need this

#### Step 2: Create Client Secret

1. In your app registration, go to: **Certificates & secrets**
2. Click: **New client secret**
3. Description: `GitHub Actions`
4. Expires: **24 months** (or as per your policy)
5. Click **Add**
6. **⚠️ IMMEDIATELY copy the secret VALUE** (not Secret ID) - you can't see it again!

#### Step 3: Assign Permissions to Resource Group

1. Go to your Resource Group (search for it in the search bar)
2. Click: **Access control (IAM)** in the left menu
3. Click: **Add** → **Add role assignment**
4. Select role: **Contributor**
5. Click **Next**
6. Click: **Select members**
7. Search for: `github-actions-devops` (your app name)
8. Select it and click **Select**
9. Click **Review + assign**

#### Step 4: Create Credentials JSON File

Get your Azure details:

```bash
# Get your subscription ID
az account show --query id -o tsv

# Get your tenant ID
az account show --query tenantId -o tsv
```

Create file `.azure-credentials.json`:

```json
{
  "clientId": "YOUR_APPLICATION_CLIENT_ID_FROM_STEP_1",
  "clientSecret": "YOUR_CLIENT_SECRET_VALUE_FROM_STEP_2",
  "subscriptionId": "YOUR_SUBSCRIPTION_ID",
  "tenantId": "YOUR_TENANT_ID"
}
```

**Important**: Replace all placeholder values with your actual values!

#### Step 5: Set GitHub Secrets

```bash
# Verify the file is correct
cat .azure-credentials.json

# Run the setup script
./setup-github-secrets.sh
```

---

### ✅ Solution 2: Request Admin Assistance

If Azure Portal also doesn't work, you need your Azure AD admin to create it for you.

#### Create Request File

```bash
./create-service-principal-alternative.sh
# Choose option 2
```

This creates `admin-request.txt` with all the details your admin needs.

#### Send to Admin

Email `admin-request.txt` to your Azure AD administrator with this message:

```
Subject: Azure Service Principal Request for GitHub Actions

Hi [Admin Name],

I need a service principal created for automated deployments via GitHub Actions.
Please find the details in the attached admin-request.txt file.

The command to run is:

az ad sp create-for-rbac \
  --name "github-actions-{RESOURCE_GROUP}" \
  --role contributor \
  --scopes "/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}" \
  --json-auth

Please send me the JSON output.

Thank you!
```

#### Once You Receive Credentials

1. Save the JSON to `.azure-credentials.json`
2. Run: `./setup-github-secrets.sh`

---

### ✅ Solution 3: Use Different Authentication (Advanced)

GitHub Actions now supports OIDC authentication (no secrets needed), but this also requires app registration permissions.

If interested, see: [GitHub OIDC for Azure](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure)

---

## Quick Command Reference

### Get Your Azure Information

```bash
# Subscription ID
az account show --query id -o tsv

# Tenant ID
az account show --query tenantId -o tsv

# Subscription name
az account show --query name -o tsv

# Current user
az account show --query user.name -o tsv
```

### Verify Service Principal (After Creation)

```bash
# List service principals you own
az ad sp list --show-mine --query "[].{Name:displayName, AppId:appId}" -o table

# Test login with service principal
az login --service-principal \
  -u <CLIENT_ID> \
  -p <CLIENT_SECRET> \
  --tenant <TENANT_ID>
```

### Test GitHub Secrets Setup

```bash
# List GitHub secrets
gh secret list --repo ShoaibZMian/Devops_project

# Test secret value (first few characters)
gh secret list --repo ShoaibZMian/Devops_project | grep AZURE_CREDENTIALS
```

---

## Troubleshooting

### "Application (client) ID not found in Portal"

Look for these tabs in your App Registration:
- **Overview** → Application (client) ID is at the top
- Not the Object ID, must be Application (client) ID

### "Client secret not showing after creation"

The secret value is only shown ONCE when created. If you closed the window:
1. Create a new secret (delete old one if needed)
2. Copy the VALUE immediately

### "Can't find the resource group in IAM"

Make sure you're:
1. In the correct subscription (check top-right in Portal)
2. Looking at the Resource Group, not the Subscription
3. Have at least "User Access Administrator" role on the RG

### "JSON file is invalid"

Validate your JSON:

```bash
# Check if valid JSON
cat .azure-credentials.json | jq .

# If jq not installed
python3 -m json.tool .azure-credentials.json
```

Must be exactly this format (no comments, no extra commas):

```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "your~secret~value~here",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

---

## After Successful Setup

Once you have the credentials working:

```bash
# Verify secrets are set
gh secret list --repo ShoaibZMian/Devops_project

# Should show:
# AZURE_CREDENTIALS
# AZURE_SUBSCRIPTION_ID
# AZURE_RESOURCE_GROUP
# AZURE_LOCATION
# DB_CONNECTION_STRING
# DOCKERHUB_TOKEN
# DOCKERHUB_USERNAME
# JWT_AUDIENCE
# JWT_ISSUER
# JWT_SECRET

# Deploy!
git push origin main

# Or manually trigger
gh workflow run azure-deploy.yml
```

---

## Still Having Issues?

Check:
1. Your Azure role: `az role assignment list --assignee $(az account show --query user.name -o tsv) --output table`
2. Required roles: At minimum "Contributor" on Resource Group
3. For Service Principal creation: Requires "Application Administrator" or "Global Administrator" in Azure AD

Contact your Azure administrator if you don't have the required permissions.
