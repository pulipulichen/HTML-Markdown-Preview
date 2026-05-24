import { test, expect } from '@playwright/test';

test('initializes language from localStorage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('markdown_preview_language', 'zh-TW');
  });

  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('#language-select')).toHaveValue('zh-TW');
  await expect(page.locator('header h1')).toHaveText('Markdown 編輯器');
});

test('switches language and updates UI text immediately', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('/');

  await page.locator('#language-select').selectOption('zh-TW');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('#clear-btn')).toContainText('清空內容');

  await page.locator('#language-select').selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#clear-btn')).toContainText('Clear Content');

  expect(consoleErrors).toHaveLength(0);
});

test('persists selected language after reload', async ({ page }) => {
  await page.goto('/');

  await page.locator('#language-select').selectOption('zh-TW');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');

  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem('markdown_preview_language')))
    .toBe('zh-TW');

  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('#language-select')).toHaveValue('zh-TW');
  await expect(page.locator('header h1')).toHaveText('Markdown 編輯器');
});
