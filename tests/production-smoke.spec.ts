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

    // Check products load from backend
    await expect(page.locator('text=Product ID')).toBeVisible({ timeout: 15000 });
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
    await page.click('button:has-text("Add to Cart")');

    // Verify toast appears
    await expect(page.locator('.Toastify')).toBeVisible({ timeout: 5000 });

    // Go to cart
    await page.click('button:has-text("Cart")');
    await expect(page).toHaveURL(/checkout/);
  });

  test('Production navigation works', async ({ page }) => {
    await page.goto('/');

    // Test About page
    await page.click('a:has-text("About")');
    await expect(page).toHaveURL(/about/);

    // Go back to home
    await page.click('a:has-text("Home")');
    await expect(page).toHaveURL(/^\//);
  });

  test('Production images load correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for products
    await page.waitForSelector('img', { timeout: 15000 });

    // Check if at least one product image is visible
    const images = page.locator('img[alt*="Vitamin"], img[alt*="shirt"]');
    await expect(images.first()).toBeVisible({ timeout: 10000 });
  });
});
