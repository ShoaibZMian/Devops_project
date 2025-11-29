# 🎭 Playwright Testing Guide

This project uses Playwright for end-to-end testing of the e-commerce application.

## 📋 Test Files

- **`ecommerce.spec.ts`** - Comprehensive localhost tests for development
- **`production-smoke.spec.ts`** - Production smoke tests for Azure deployment
- **`example.spec.ts`** - Playwright example tests (can be deleted)

## 🚀 Quick Start

### Prerequisites

Make sure both frontend and backend are running:
```bash
# Start backend
cd backend2 && docker compose up -d

# Start frontend
cd frontend && docker compose up -d
```

### Running Tests

#### Option 1: Using the Interactive Script (Recommended)
```bash
./test-scripts.sh
```

#### Option 2: Direct Playwright Commands

**Localhost Tests (Development):**
```bash
npx playwright test ecommerce.spec.ts
```

**Production Tests (Azure):**
```bash
BASE_URL=http://frontend-devops-project.northeurope.azurecontainer.io npx playwright test production-smoke.spec.ts
```

**All Tests:**
```bash
npx playwright test
```

**Headed Mode (See the browser):**
```bash
npx playwright test --headed
```

**UI Mode (Interactive debugging):**
```bash
npx playwright test --ui
```

**Run specific test:**
```bash
npx playwright test -g "Homepage loads successfully"
```

## 📊 Viewing Reports

After tests run, view the HTML report:
```bash
npx playwright show-report
```

## 🎯 Test Coverage

### E-Commerce Tests (`ecommerce.spec.ts`)

✅ **Homepage & Navigation**
- Homepage loads successfully
- Navbar visibility
- Product display
- About page navigation

✅ **Product Browsing**
- Search functionality
- Product filtering
- Quantity selection (increment/decrement)

✅ **Shopping Cart**
- Add to cart functionality
- Toast notifications
- Cart page navigation
- Cart item display

✅ **Checkout Flow**
- Address form validation
- Form field auto-fill (city from zip code)
- Proceed to payment
- Payment method selection

✅ **User Authentication**
- Login page access
- Form visibility

✅ **Responsive Design**
- Mobile viewport testing
- Layout responsiveness

### Production Smoke Tests (`production-smoke.spec.ts`)

✅ **Health Checks**
- Production homepage accessibility
- Backend API response
- Database connectivity

✅ **Core Functionality**
- Cart operations
- Navigation
- Image loading

## 🔧 Configuration

### Environment Variables

**Localhost (default):**
```bash
BASE_URL=http://localhost:3000 npx playwright test
```

**Production:**
```bash
BASE_URL=http://frontend-devops-project.northeurope.azurecontainer.io npx playwright test
```

**Custom URL:**
```bash
BASE_URL=http://your-custom-url.com npx playwright test
```

### Playwright Config

The `playwright.config.ts` file includes:
- ✅ Screenshots on failure
- ✅ Video recording on failure
- ✅ Trace collection on retry
- ✅ Multi-browser testing (Chrome, Firefox, Safari)
- ✅ Parallel execution
- ✅ HTML reporting

## 🐛 Debugging Tests

### Debug Mode
```bash
npx playwright test --debug
```

### Show Browser
```bash
npx playwright test --headed
```

### Slow Motion
```bash
npx playwright test --headed --slow-mo=1000
```

### Inspect Element
```bash
npx playwright codegen http://localhost:3000
```

## 📝 Writing New Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test('Your test name', async ({ page }) => {
  // Navigate
  await page.goto('/');

  // Interact
  await page.click('button:has-text("Click Me")');

  // Assert
  await expect(page.locator('h1')).toHaveText('Success');
});
```

### Using baseURL
```typescript
// With baseURL configured, just use relative paths
await page.goto('/');
await page.goto('/about');
await page.goto('/checkout');
```

### Common Selectors
```typescript
// Text content
page.locator('text=Add to Cart')
page.locator('button:has-text("Submit")')

// CSS selectors
page.locator('.bg-card')
page.locator('#product-123')

// Accessible roles
page.getByRole('button', { name: 'Add to Cart' })
page.getByRole('link', { name: 'Home' })

// Placeholders
page.getByPlaceholder('Enter email')

// Chaining
page.locator('.product').locator('button').first()
```

## 🔄 CI/CD Integration

### Automated Testing in GitHub Actions

This project has **three levels of automated testing** integrated into the CI/CD pipeline:

#### 1️⃣ Pull Request Tests (`.github/workflows/playwright.yml`)

**When:** Runs on every pull request to `dev` or `main` branches
**Purpose:** Catch bugs before code is merged
**Tests:** Cart functionality tests (`cart.spec.ts`)

**What it does:**
- Starts Docker services (backend + frontend)
- Runs Playwright cart tests
- Blocks PR merge if tests fail (with branch protection)

**Trigger:**
```bash
# Automatically runs when you:
git push origin feature-branch
# Then create PR to dev or main
```

#### 2️⃣ Pre-Deployment Tests (`.github/workflows/azure-deploy.yml`)

**When:** Runs before deploying to Azure on push to `main`
**Purpose:** Prevent broken code from reaching production
**Tests:** Cart functionality tests (`cart.spec.ts`)

**What it does:**
- Tests run FIRST (before build/deploy)
- If tests PASS → Build images → Deploy to Azure
- If tests FAIL → Deployment is BLOCKED ❌

**Job Sequence:**
```
test → build-and-push → deploy-to-azure → production-smoke-test
  ↓
  ✗ STOPS HERE if tests fail
```

#### 3️⃣ Production Smoke Tests (`.github/workflows/azure-deploy.yml`)

**When:** Runs after successful deployment to Azure
**Purpose:** Verify production is working correctly
**Tests:** Production smoke tests (`production-smoke.spec.ts`)
**URL:** http://frontend-devops-project.northeurope.azurecontainer.io

**What it does:**
- Waits 30 seconds for deployment to stabilize
- Runs smoke tests against production URL
- Alerts if production has issues (but deployment already happened)

### Viewing Test Results in GitHub

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click on a workflow run
4. View test results and logs
5. Download test reports/videos from **Artifacts** section

### Setting Up Branch Protection

To require tests to pass before merging PRs:

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Check:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Select: `test / Run E2E Tests`
4. Click **Create**

Now PRs cannot be merged unless tests pass! 🎉

### CI/CD Workflow Files

**Playwright Tests** (`.github/workflows/playwright.yml`)
```yaml
name: Playwright Tests
on:
  pull_request:
    branches: [ dev, main, master ]
  push:
    branches: [ dev, main, master ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install Playwright
      - Start Docker services (backend + frontend)
      - Run cart.spec.ts tests
      - Upload test reports
```

**Azure Deployment** (`.github/workflows/azure-deploy.yml`)
```yaml
name: Build and Deploy to Azure
on:
  push:
    branches: [ main ]

jobs:
  test:           # ← Runs FIRST
    - Start Docker services
    - Run cart.spec.ts tests
    - FAIL workflow if tests fail

  build-and-push: # ← Only runs if tests pass
    needs: test
    - Build Docker images
    - Push to DockerHub

  deploy-to-azure:
    needs: build-and-push
    - Deploy containers to Azure

  production-smoke-test: # ← Runs LAST
    needs: deploy-to-azure
    - Test production URL
    - Verify deployment success
```

### Understanding Test Failures in CI

**If PR tests fail:**
1. Check the GitHub Actions logs
2. Download test artifacts (screenshots/videos)
3. Fix the issue locally
4. Push new commits to update the PR
5. Tests will automatically re-run

**If pre-deployment tests fail:**
1. Deployment to Azure is BLOCKED
2. Check GitHub Actions logs for errors
3. Fix the issue and push to `main` again
4. Deployment will retry with fixed code

**If production smoke tests fail:**
1. Deployment already happened (tests run after)
2. Check production directly: http://frontend-devops-project.northeurope.azurecontainer.io
3. Review test artifacts to identify the issue
4. May need to rollback or hotfix

## 🎨 Best Practices

✅ **DO:**
- Use `baseURL` for navigation
- Wait for elements before interacting
- Use descriptive test names
- Group related tests in `test.describe()`
- Use accessibility selectors when possible
- Clean up test data after tests

❌ **DON'T:**
- Use hard-coded `sleep()` - use `waitFor()` instead
- Test implementation details
- Make tests dependent on each other
- Use fragile selectors (like CSS classes that might change)

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)

## 🆘 Troubleshooting

### Tests timing out?
- Increase timeout in `playwright.config.ts`
- Check if services are running (`docker compose ps`)
- Use `{ timeout: 10000 }` in specific assertions

### Flaky tests?
- Add proper waits (`waitForSelector`, `waitForTimeout`)
- Use `toBeVisible()` instead of checking if element exists
- Check for race conditions

### Tests fail in CI but pass locally?
- Ensure services are properly started
- Check for timing issues
- Review environment variables

---

**Happy Testing! 🎉**
