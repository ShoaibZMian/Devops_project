#!/bin/bash

# E-Commerce Playwright Test Runner
# This script helps you run different test scenarios

echo "🎭 E-Commerce Playwright Test Runner"
echo "======================================"
echo ""
echo "Choose a test mode:"
echo "1) Localhost Tests (Development)"
echo "2) Production Tests (Azure)"
echo "3) All Tests (Localhost)"
echo "4) Headed Mode (See browser)"
echo "5) Specific Test File"
echo "6) UI Mode (Interactive)"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
  1)
    echo "Running localhost tests..."
    npx playwright test ecommerce.spec.ts
    ;;
  2)
    echo "Running production smoke tests..."
    BASE_URL=http://frontend-devops-project.northeurope.azurecontainer.io npx playwright test production-smoke.spec.ts
    ;;
  3)
    echo "Running all tests on localhost..."
    npx playwright test
    ;;
  4)
    echo "Running tests in headed mode (visible browser)..."
    npx playwright test --headed
    ;;
  5)
    echo "Available test files:"
    ls -1 tests/*.spec.ts
    echo ""
    read -p "Enter test filename: " filename
    npx playwright test "$filename"
    ;;
  6)
    echo "Starting Playwright UI mode..."
    npx playwright test --ui
    ;;
  *)
    echo "Invalid choice!"
    exit 1
    ;;
esac

echo ""
echo "✅ Tests completed!"
echo ""
echo "📊 To view HTML report, run: npx playwright show-report"
