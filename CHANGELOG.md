# CHANGELOG

## 1.0.3

### Added

- Introduced an i18n architecture (`scripts/modules/i18n/en.js`, `scripts/modules/i18n/zh-TW.js`, and `scripts/modules/i18n.js`), added `data-i18n` / `data-i18n-attr` bindings in `index.html`, and shipped a language switcher with `localStorage` persistence (`markdown_preview_language`).
- Added i18n Playwright scenarios for initial language detection, manual switching, reload persistence, and console error checks, and split project documentation into bilingual files (`README.md` and `README_zh_tw.md`).
- Added a "Table Style" selector for rich-text table output with seven themes and persisted the selected value in `localStorage` (`table_style`).
- Added Markdown cleanup improvements to remove trailing numeric citation tags (for example `[15]` or `[12, 15]`) before `。`, and render `[!NOTE]` lines as highlighted notes.
- Added a "Copy Rich Text Format" selector in Live Preview with `SOP Manual` and `Plain` modes, persisted the selection in `localStorage` (`rich_text_format`), and applied plain-mode table output with default black borders.

### Fixed

- Fixed Docker E2E failures caused by host `node_modules` shadowing Playwright in the container by adding an anonymous `/app/node_modules` volume in `docker-compose.yml`.
- Fixed Playwright artifact/report path conflicts by removing `--output=/app/playwright-report-videos` from `Dockerfile.test` and using `outputDir: test-results` from `playwright.config.js`.
- Fixed an invalid regular expression in `scripts/filter.js` (`/^\n=++\n$/`) that caused a runtime `SyntaxError`, replacing it with a multiline-safe rule for repeated `=` lines.

### Improved

- Added `.jshintrc` lint configuration to allow no trailing semicolons (`asi: true`) and support modern JavaScript syntax used in this project.

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
