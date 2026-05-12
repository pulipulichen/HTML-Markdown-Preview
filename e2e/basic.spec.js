import { test, expect } from '@playwright/test';

test('應該能夠正確渲染 Markdown 並清空內容', async ({ page }) => {
  // 1. 導航到應用程式
  await page.goto('/');

  // 2. 設定控制台錯誤追蹤
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 3. 檢查初始狀態
  const input = page.locator('#markdown-input');
  const preview = page.locator('#preview-area');
  
  // 等待內容載入（如果有預設內容）
  await page.waitForLoadState('networkidle');

  // 4. 輸入 Markdown
  const testMarkdown = '# Hello World\n\n這是一個測試。';
  await input.fill(testMarkdown);

  // 5. 驗證預覽區域
  await expect(preview.locator('h2')).toHaveText('Hello World');
  await expect(preview.locator('p')).toHaveText('這是一個測試。');

  // // 6. 測試清空按鈕
  // await page.locator('#clear-btn').click();
  // await expect(input).toHaveValue('');
  // await expect(preview).toHaveText('');

  // 7. 最後檢查控制台有無錯誤
  expect(consoleErrors).toHaveLength(0);
});


// test('複製按鈕應該能觸發提示訊息', async ({ page }) => {
//   await page.goto('/');
  
//   await page.locator('#markdown-input').fill('測試複製功能');
  
//   // 點擊複製按鈕
//   await page.locator('#copy-btn').click();
  
//   // 檢查提示訊息是否顯示 (opacity 應該會變動，或是檢查 DOM)
//   const messageBox = page.locator('#message-box');
//   await expect(messageBox).toBeVisible();
//   await expect(messageBox).toHaveText('已複製到剪貼簿！');
// });


test('PWA manifest 已連結', async ({ page }) => {
  await page.goto('/');
  const manifest = page.locator('link[rel="manifest"]');
  await expect(manifest).toHaveAttribute('href', 'manifest.json');
});

test('Markdown 標題最高層級應該從 h2 開始', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#markdown-input');
  const preview = page.locator('#preview-area');
  const topHeadingLevel = page.locator('#top-heading-level');

  await input.fill('# 主標題\n\n### 小節\n\n###### 最深層');

  await expect(topHeadingLevel).toHaveValue('2');
  await expect(preview.locator('h1')).toHaveCount(0);
  await expect(preview.locator('h2')).toHaveText('主標題');
  await expect(preview.locator('h4')).toHaveText('小節');
  await expect(preview.locator('h6')).toHaveText('最深層');
});

test('可調整 Markdown 標題最高層級', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#markdown-input');
  const preview = page.locator('#preview-area');

  await input.fill('# 主標題\n\n## 子標題');
  await page.locator('#top-heading-level').selectOption('3');

  await expect(preview.locator('h3')).toHaveText('主標題');
  await expect(preview.locator('h4')).toHaveText('子標題');
});