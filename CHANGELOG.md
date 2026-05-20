# 1.0.3

- 導入多語系（i18n）架構，將翻譯字典拆分為 `scripts/modules/i18n/en.js` 與 `scripts/modules/i18n/zh-TW.js`，並新增 `scripts/modules/i18n.js` 管理語系邏輯。
- 新增語言切換選單（`#language-select`），可在英文與繁體中文間手動切換，並即時更新頁面靜態文案與動態提示訊息。
- 語系初始化支援優先順序：`localStorage`（`markdown_preview_language`）→ 瀏覽器語系 → 預設英文，且切換後會自動記憶。
- `index.html` 靜態文字改為 `data-i18n` / `data-i18n-attr` 綁定，包含標題、按鈕、區塊標頭、placeholder、meta description 與 toast 預設內容。
- 補上 i18n Playwright 測試情境，涵蓋載入語系、手動切換、reload 後持久化與 console error 檢查。

# 1.0.2

- 新增「貼上模式」選單，支援 `replace`、`append`、`prepend` 三種「貼上富文本」寫入策略，不再只能覆蓋原內容。
- 「貼上富文本」流程會依模式將轉換後 Markdown 內容插入前方或後方，並在合併段落間自動補空行。
- `paste_mode` 會寫入 `localStorage`，重新整理頁面後可保留上次選擇的貼上模式。
- 當剪貼簿內容為空白時，會顯示提示並避免覆寫現有 Markdown 內容。

# 1.0.1

- 新增「貼上富文本」按鈕，可讀取剪貼簿中的 HTML 富文本，轉換成 Markdown 後放入輸入區並更新預覽。
- 強化富文本表格轉換，能將一般 HTML 表格轉成 GFM Markdown 表格，並處理換行、欄位補齊與 `|` 字元跳脫。
- 若表格含有 `rowspan` 或 `colspan` 等 Markdown 無法表達的合併儲存格，會保留原始 HTML 表格以維持預覽效果。
- 轉換後的 HTML 表格會補上 `border`、`bgcolor`、`align`、`font` 等相容 Word 的舊式 HTML 屬性，讓複製貼上後保留類似 Word 的表格樣式。
- 新增最頂層標題層級設定，預設將 Markdown 內容中的最高標題調整為 `h2`，並依原始階層往下對應。
- 將前端腳本依功能拆分為多個檔案，降低 `scripts/script.js` 的長度，方便後續閱讀與維護。
- 新增「刪除空行」按鈕，可一鍵清除 Markdown 輸入區中的空白行並即時更新預覽內容。
