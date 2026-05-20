# CHANGELOG

## 1.0.3

- Introduced an i18n architecture by splitting translation dictionaries into `scripts/modules/i18n/en.js` and `scripts/modules/i18n/zh-TW.js`, and added `scripts/modules/i18n.js` for language state management.
- Added a language switcher (`#language-select`) to manually switch between English and Traditional Chinese, with immediate updates to static UI text and dynamic messages.
- Implemented language initialization priority: `localStorage` (`markdown_preview_language`) -> browser language -> default English, with persistence after switching.
- Replaced static text in `index.html` with `data-i18n` / `data-i18n-attr` bindings, including titles, buttons, panel headers, placeholders, meta description, and default toast text.
- Added i18n Playwright scenarios covering initial language load, manual switching, persistence after reload, and console error checks.
- Split README documentation into bilingual files: `README.md` (English) and `README_zh_tw.md` (Traditional Chinese), with cross-links for language switching.
- Added a "Table Style" selector for rich-text table output with seven theme options: gray (default), blue, yellow, red, green, purple, and brown.
- Refactored table styling into reusable theme palettes and updated Word-friendly table generation to apply the selected palette while preserving existing formatting behavior.
- Persisted the selected table theme in `localStorage` (`table_style`) and restored it on load for consistent preview and copy results.

## 1.0.2

- Added a "Paste Mode" selector with `replace`, `append`, and `prepend` strategies for rich-text paste, instead of always overwriting content.
- Updated the rich-text paste flow to insert converted Markdown before or after existing content based on mode, with automatic blank-line separation between merged sections.
- Persisted `paste_mode` in `localStorage` so the selected mode is retained after page reload.
- Added a guard for blank clipboard content to prevent overwriting existing Markdown and show a user message.

## 1.0.1

- Added a "Paste Rich Text" button to read HTML rich text from the clipboard, convert it to Markdown, insert it into the editor, and refresh the preview.
- Improved rich-text table conversion to output GFM Markdown tables, including line-break handling, column padding, and `|` escaping.
- Preserved original HTML tables when `rowspan` or `colspan` merged cells are detected, because these structures cannot be fully represented in Markdown.
- Added Word-friendly legacy HTML attributes (`border`, `bgcolor`, `align`, `font`) to converted tables to keep table styling during copy/paste workflows.
- Added a configurable top heading level, defaulting the highest Markdown heading to `h2` while preserving relative heading hierarchy.
- Refactored frontend scripts into focused files to reduce `scripts/script.js` size and improve maintainability.
- Added a "Remove Empty Lines" button to clean empty lines from the Markdown input and refresh preview immediately.
