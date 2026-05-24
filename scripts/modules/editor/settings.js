export const TOP_HEADING_LEVEL_KEY = "top_heading_level";
export const RICH_TEXT_FORMAT_KEY = "rich_text_format";
export const PASTE_MODE_KEY = "paste_mode";
export const TABLE_STYLE_KEY = "table_style";
export const MARKDOWN_CONTENT_KEY = "markdown_content";

export const VALID_TABLE_STYLES = ["gray", "blue", "yellow", "red", "green", "purple", "brown"];
export const VALID_RICH_TEXT_FORMATS = ["sop", "plain"];

export async function loadInitialContent(markdownInput, t) {
    const savedContent = localStorage.getItem(MARKDOWN_CONTENT_KEY);
    if (savedContent) {
        markdownInput.value = savedContent;
        return;
    }

    try {
        const response = await fetch("default_markdown.md");
        let defaultContent = await response.text();
        defaultContent = defaultContent.trim();
        markdownInput.value = defaultContent;
    } catch (err) {
        console.error(t("error.loadDefaultContent"), err);
        markdownInput.value = t("fallback.defaultMarkdownTitle");
    }
}

export function loadTopHeadingLevel(topHeadingLevelSelect) {
    const savedTopHeadingLevel = localStorage.getItem(TOP_HEADING_LEVEL_KEY);
    if (savedTopHeadingLevel) {
        topHeadingLevelSelect.value = savedTopHeadingLevel;
    }
}

export function loadPasteMode(pasteModeSelect) {
    const savedPasteMode = localStorage.getItem(PASTE_MODE_KEY);
    const validModes = ["replace", "append", "prepend"];

    if (savedPasteMode && validModes.includes(savedPasteMode)) {
        pasteModeSelect.value = savedPasteMode;
    }
}

export function loadRichTextFormat(richTextFormatSelect, tableStyleSelect) {
    const savedRichTextFormat = localStorage.getItem(RICH_TEXT_FORMAT_KEY);
    const richTextFormat = VALID_RICH_TEXT_FORMATS.includes(savedRichTextFormat) ? savedRichTextFormat : "sop";
    richTextFormatSelect.value = richTextFormat;
    updateRichTextFormatUI(richTextFormatSelect, tableStyleSelect);
}

export function loadTableStyle(tableStyleSelect) {
    const savedTableStyle = localStorage.getItem(TABLE_STYLE_KEY);
    const tableStyle = VALID_TABLE_STYLES.includes(savedTableStyle) ? savedTableStyle : "gray";
    tableStyleSelect.value = tableStyle;

    if (typeof window.setTableStyleTheme === "function") {
        window.setTableStyleTheme(tableStyle);
    }
}

export function updateRichTextFormatUI(richTextFormatSelect, tableStyleSelect) {
    const isSopFormat = richTextFormatSelect.value === "sop";
    tableStyleSelect.disabled = !isSopFormat;
    tableStyleSelect.classList.toggle("opacity-60", !isSopFormat);
    tableStyleSelect.classList.toggle("cursor-not-allowed", !isSopFormat);
}
