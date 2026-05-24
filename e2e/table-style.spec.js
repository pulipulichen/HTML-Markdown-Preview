import { test, expect } from '@playwright/test';

const TABLE_MARKDOWN = [
  '| Name | Value |',
  '| --- | --- |',
  '| Alpha | 1 |',
  '| Beta | 2 |'
].join('\n');

test('applies selected table style to preview table', async ({ page }) => {
  await page.goto('/');

  const input = page.locator('#markdown-input');
  const previewTable = page.locator('#preview-area table').first();

  await input.fill(TABLE_MARKDOWN);
  await expect(previewTable).toHaveAttribute('bordercolor', '#6b7280');

  await page.locator('#sop-settings-btn').click();
  await page.locator('#table-style').selectOption('blue');
  await page.locator('#sop-settings-close-btn').click();

  await expect(previewTable).toHaveAttribute('bordercolor', '#4b5563');
  await expect(previewTable.locator('tr').nth(0)).toHaveAttribute('bgcolor', '#1f4e79');
  await expect(previewTable.locator('tr').nth(2)).toHaveAttribute('bgcolor', '#d9eaf7');
});

test('persists selected table style after reload', async ({ page }) => {
  await page.goto('/');

  const input = page.locator('#markdown-input');
  const previewTable = page.locator('#preview-area table').first();

  await page.locator('#sop-settings-btn').click();
  await page.locator('#table-style').selectOption('yellow');
  await page.locator('#sop-settings-close-btn').click();

  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem('table_style')))
    .toBe('yellow');

  await page.reload();
  await input.fill(TABLE_MARKDOWN);

  await page.locator('#sop-settings-btn').click();
  await expect(page.locator('#table-style')).toHaveValue('yellow');
  await page.locator('#sop-settings-close-btn').click();

  await expect(previewTable).toHaveAttribute('bordercolor', '#a16207');
  await expect(previewTable.locator('tr').nth(0)).toHaveAttribute('bgcolor', '#ca8a04');
});
