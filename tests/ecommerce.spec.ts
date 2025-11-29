import { test, expect } from '@playwright/test';

test.describe('E-Commerce Application Tests', () => {

  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle('Home');

    // Check navbar is visible
    await expect(page.locator('nav')).toBeVisible();

    // Check products are loaded
    await expect(page.locator('text=Product ID')).toBeVisible();
  });

  test('Search functionality works', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('text=Product ID', { timeout: 10000 });

    // Search for Vitamin products
    await page.fill('input[placeholder*="Product Name"]', 'Vitamin');
    await page.click('button:has-text("Search")');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Verify search results contain "Vitamin"
    const productNames = await page.locator('h4.text-xl').allTextContents();
    const hasVitamin = productNames.some(name => name.toLowerCase().includes('vitamin'));
    expect(hasVitamin).toBeTruthy();
  });

  test('Add product to cart shows toast notification', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('text=Product ID', { timeout: 10000 });

    // Get first product name
    const firstProductName = await page.locator('h4.text-xl').first().textContent();

    // Click "Add to Cart" button
    await page.click('button:has-text("Add to Cart")');

    // Verify toast notification appears
    await expect(page.locator('.Toastify')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.Toastify')).toContainText('added to cart');
  });

  test('Quantity selection works correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('text=Product ID', { timeout: 10000 });

    // Get the quantity input for first product
    const quantityInput = page.locator('input[type="number"]').first();

    // Click increment button twice
    const incrementBtn = page.locator('button:has-text("+")').first();
    await incrementBtn.click();
    await incrementBtn.click();

    // Verify quantity is now 3
    await expect(quantityInput).toHaveValue('3');

    // Click decrement button
    const decrementBtn = page.locator('button:has-text("-")').first();
    await decrementBtn.click();

    // Verify quantity is now 2
    await expect(quantityInput).toHaveValue('2');
  });

  test('Navigate to cart page', async ({ page }) => {
    await page.goto('/');

    // Wait for navbar to load
    await page.waitForSelector('nav', { timeout: 10000 });

    // Click Cart button in navbar
    await page.click('button:has-text("Cart")');

    // Verify we're on the checkout page
    await expect(page).toHaveURL(/checkout/);
  });

  test('Complete checkout flow (unauthenticated user)', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('text=Product ID', { timeout: 10000 });

    // Add product to cart
    await page.click('button:has-text("Add to Cart")');
    await page.waitForTimeout(500);

    // Go to cart
    await page.click('button:has-text("Cart")');
    await expect(page).toHaveURL(/checkout/);

    // Click Continue button
    await page.click('button:has-text("Continue")');

    // Should redirect to address form
    await expect(page).toHaveURL(/checkout\/address/);

    // Check that address form is visible
    await expect(page.locator('h1:has-text("Delivery Information")')).toBeVisible();
  });

  test('Fill address form and proceed to payment', async ({ page }) => {
    await page.goto('/checkout/address');

    // Fill delivery address
    await page.fill('input[placeholder="Full Name"]', 'Test User');
    await page.selectOption('select', 'Denmark');
    await page.fill('input[placeholder="1234"]', '2100');

    // Wait for city to auto-fill
    await page.waitForTimeout(1000);

    await page.fill('input[placeholder*="Street"]', '123 Test Street');
    await page.fill('input[placeholder="12345678"]', '12345678');
    await page.fill('input[placeholder*="email"]', 'test@example.com');

    // Submit form
    await page.click('button:has-text("Continue to Payment")');

    // Should navigate to payment page
    await expect(page).toHaveURL(/checkout\/payment/);
  });

  test('Payment page displays correctly', async ({ page }) => {
    // First add item to cart and fill address
    await page.goto('/');
    await page.waitForSelector('text=Product ID', { timeout: 10000 });
    await page.click('button:has-text("Add to Cart")');
    await page.waitForTimeout(500);

    // Navigate to address
    await page.goto('/checkout/address');

    // Quick fill form
    await page.fill('input[placeholder="Full Name"]', 'Test User');
    await page.fill('input[placeholder="1234"]', '2100');
    await page.waitForTimeout(1000);
    await page.fill('input[placeholder*="Street"]', '123 Test Street');
    await page.fill('input[placeholder="12345678"]', '12345678');
    await page.fill('input[placeholder*="email"]', 'test@example.com');
    await page.click('button:has-text("Continue to Payment")');

    // Verify payment page elements
    await expect(page.locator('h1:has-text("Payment")')).toBeVisible();
    await expect(page.locator('h2:has-text("Order Summary")')).toBeVisible();
    await expect(page.locator('h2:has-text("Payment Method")')).toBeVisible();

    // Verify payment method buttons are visible
    await expect(page.locator('text=Gift Card')).toBeVisible();
    await expect(page.locator('text=MobilePay')).toBeVisible();
    await expect(page.locator('text=Invoice')).toBeVisible();
  });

  test('Login functionality', async ({ page }) => {
    await page.goto('/');

    // Click Login link
    await page.click('a:has-text("Login")');

    // Verify we're on login page
    await expect(page).toHaveURL(/login/);

    // Check login form is visible
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('About page loads', async ({ page }) => {
    await page.goto('/');

    // Click About link
    await page.click('a:has-text("About")');

    // Verify we're on about page
    await expect(page).toHaveURL(/about/);
  });

  test('Responsive design - mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('text=Product ID', { timeout: 10000 });

    // Verify navbar is still visible
    await expect(page.locator('nav')).toBeVisible();

    // Verify products render correctly in mobile view
    await expect(page.locator('button:has-text("Add to Cart")').first()).toBeVisible();
  });
});
