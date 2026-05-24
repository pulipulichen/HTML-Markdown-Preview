import { test, expect } from '@playwright/test';

test('renders markdown headings and paragraphs in preview', async ({ page }) => {
  await page.goto('/');

  const input = page.locator('#markdown-input');
  const preview = page.locator('#preview-area');

  await input.fill('# Hello World\n\nThis is a preview test.');

  await expect(preview.locator('h2')).toHaveText('Hello World');
  await expect(preview.locator('p')).toHaveText('This is a preview test.');
});

test('normalizes heading levels based on selected top level', async ({ page }) => {
  await page.goto('/');

  const input = page.locator('#markdown-input');
  const preview = page.locator('#preview-area');

  await page.locator('#sop-settings-btn').click();
  await page.locator('#top-heading-level').selectOption('3');
  await page.locator('#sop-settings-close-btn').click();

  await input.fill('# Main Title\n\n## Sub Title');

  await expect(preview.locator('h3')).toHaveText('Main Title');
  await expect(preview.locator('h4')).toHaveText('Sub Title');
});
