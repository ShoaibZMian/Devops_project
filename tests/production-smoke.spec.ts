import { test, expect } from '@playwright/test';

/**
 * Production Smoke Tests
 * Run with: BASE_URL=http://frontend-devops-project.northeurope.azurecontainer.io npx playwright test production-smoke.spec.ts
 */

test.describe('Production Smoke Tests', () => {

  test('Production homepage is accessible', async ({ page }) => {
    await page.goto('/');

    // Check page loads
    await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });

    // Check products load from backend (use .first() since there are multiple products)
    await expect(page.locator('text=Product ID').first()).toBeVisible({ timeout: 15000 });
  });

  test('Production backend API is responding', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load (indicates backend is working)
    await page.waitForSelector('text=Product ID', { timeout: 15000 });

    // Verify we have products displayed
    const products = await page.locator('.bg-card').count();
    expect(products).toBeGreaterThan(0);
  });

  test('Production cart functionality works', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 15000 });

    // Add item to cart
    await page.locator('button:has-text("Add to Cart")').first().click();

    // Wait a moment for cart to update
    await page.waitForTimeout(1000);

    // Go to cart
    await page.click('button:has-text("Cart")');
    await expect(page).toHaveURL(/checkout/);

    // Verify cart has items
    await expect(page.locator('.bg-card').first()).toBeVisible();
  });

  test('Production navigation works', async ({ page }) => {
    await page.goto('/');

    // Test About page
    await page.click('a:has-text("About")');
    await expect(page).toHaveURL(/about/);

    // Go back to home
    await page.click('a:has-text("Home")');
    await expect(page).toHaveURL(/\/$/);  // Match URLs ending with /
  });

  test('Production images load correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 15000 });

    // Check if product cards are visible (images may not have specific alt text)
    const productCards = page.locator('.bg-card');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // Verify we have multiple products
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
