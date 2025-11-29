import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Tests', () => {

  test('Add one product to cart', async ({ page }) => {
    // Listen for console errors
    page.on('console', msg => console.log('Browser console:', msg.text()));

    // Listen for failed requests
    page.on('requestfailed', request => {
      console.log('Failed request:', request.url(), request.failure()?.errorText);
    });

    await page.goto('/');

    // Wait a bit for API call
    await page.waitForTimeout(3000);

    // Wait for products to load
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 10000 });

    // Click first "Add to Cart" button
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();

    // Wait a bit for the cart to update
    await page.waitForTimeout(1000);

    // Go to cart
    await page.click('button:has-text("Cart")');

    // Verify we're on checkout page
    await expect(page).toHaveURL(/checkout/);

    // Verify cart has items
    const cartItems = page.locator('.bg-card');
    await expect(cartItems.first()).toBeVisible();
  });

  test('Add multiple products to cart', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 10000 });

    // Add first product
    const firstButton = page.locator('button:has-text("Add to Cart")').first();
    await firstButton.click();
    await page.waitForTimeout(500);

    // Add second product
    const secondButton = page.locator('button:has-text("Add to Cart")').nth(1);
    await secondButton.click();
    await page.waitForTimeout(500);

    // Add third product
    const thirdButton = page.locator('button:has-text("Add to Cart")').nth(2);
    await thirdButton.click();
    await page.waitForTimeout(1000);

    // Go to cart
    await page.click('button:has-text("Cart")');

    // Verify we're on checkout page
    await expect(page).toHaveURL(/checkout/);

    // Verify cart has multiple items
    const cartItems = page.locator('.bg-card');
    const itemCount = await cartItems.count();
    expect(itemCount).toBeGreaterThan(1);

    console.log(`Cart has ${itemCount} items`);
  });

  test('Add product with quantity > 1', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 10000 });

    // Increase quantity for first product
    const incrementBtn = page.locator('button:has-text("+")').first();
    await incrementBtn.click();
    await incrementBtn.click(); // Click twice to set quantity to 3

    // Verify quantity is 3
    const quantityInput = page.locator('input[type="number"]').first();
    await expect(quantityInput).toHaveValue('3');

    // Add to cart
    await page.locator('button:has-text("Add to Cart")').first().click();
    await page.waitForTimeout(1000);

    // Go to cart
    await page.click('button:has-text("Cart")');

    // Verify we're on checkout page
    await expect(page).toHaveURL(/checkout/);

    // Verify cart has items
    await expect(page.locator('.bg-card').first()).toBeVisible();
  });
});
