import { test, expect } from '@playwright/test';

test('links to manifest file for PWA support', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'manifest.json');
});
