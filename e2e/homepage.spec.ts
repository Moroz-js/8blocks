import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/8Blocks/);
  });

  test('should display main heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: '8Blocks' });
    await expect(heading).toBeVisible();
  });
});
