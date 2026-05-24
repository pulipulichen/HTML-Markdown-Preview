import { onLanguageChange, t } from "./modules/i18n.js";
import {
    TOP_HEADING_LEVEL_KEY,
    RICH_TEXT_FORMAT_KEY,
    PASTE_MODE_KEY,
    TABLE_STYLE_KEY,
    CODE_BLOCK_TO_TABLE_KEY,
    MARKDOWN_CONTENT_KEY,
    loadInitialContent,
    loadDefaultMarkdown,
    loadTopHeadingLevel,
    loadPasteMode,
    loadRichTextFormat,
    loadTableStyle,
    loadCodeBlockToTable,
    updateRichTextFormatUI
} from "./modules/editor/settings.js";
import { pasteRichTextAsMarkdown } from "./modules/editor/paste.js";
import { bindSopSettingsModal } from "./modules/editor/sop-settings-modal.js";

const markdownInput = document.getElementById("markdown-input");
const previewArea = document.getElementById("preview-area");
const copyBtn = document.getElementById("copy-btn");
const pasteRichBtn = document.getElementById("paste-rich-btn");
const clearBtn = document.getElementById("clear-btn");
const removeEmptyLinesBtn = document.getElementById("remove-empty-lines-btn");
const loadDefaultMarkdownBtn = document.getElementById("load-default-markdown-btn");
const messageBox = document.getElementById("message-box");
const topHeadingLevelSelect = document.getElementById("top-heading-level");
const richTextFormatSelect = document.getElementById("rich-text-format");
const pasteModeSelect = document.getElementById("paste-mode");
const tableStyleSelect = document.getElementById("table-style");
const codeBlockToTableCheckbox = document.getElementById("code-block-to-table");
const sopSettingsBtn = document.getElementById("sop-settings-btn");
const sopSettingsModal = document.getElementById("sop-settings-modal");
const sopSettingsCloseBtn = document.getElementById("sop-settings-close-btn");
const sopSettingsCloseIconBtn = document.getElementById("sop-settings-close-icon");
const renderSettingsSopSection = document.getElementById("render-settings-sop-section");
const sopTopHeadingHint = document.getElementById("sop-top-heading-hint");

const renderSettingsElements = {
    sopSection: renderSettingsSopSection,
    sopTopHeadingHint
};

bindSopSettingsModal({
    modal: sopSettingsModal,
    openBtn: sopSettingsBtn,
    closeBtn: sopSettingsCloseBtn,
    closeIconBtn: sopSettingsCloseIconBtn
});

// 初始化：從 LocalStorage 讀取
window.addEventListener("load", async () => {
    loadTopHeadingLevel(topHeadingLevelSelect);
    loadRichTextFormat(richTextFormatSelect, renderSettingsElements);
    loadCodeBlockToTable(codeBlockToTableCheckbox);
    loadPasteMode(pasteModeSelect);
    loadTableStyle(tableStyleSelect);
    await loadInitialContent(markdownInput, t);
    updateEditorPreview();
    refreshLocalizedRuntimeText();
});

// 即時轉換與儲存
markdownInput.addEventListener("input", () => {
    updateEditorPreview();
    localStorage.setItem(MARKDOWN_CONTENT_KEY, markdownInput.value);
});

topHeadingLevelSelect.addEventListener("change", () => {
    updateEditorPreview();
    localStorage.setItem(TOP_HEADING_LEVEL_KEY, topHeadingLevelSelect.value);
});

richTextFormatSelect.addEventListener("change", () => {
    updateRichTextFormatUI(richTextFormatSelect, renderSettingsElements);
    updateEditorPreview();
    localStorage.setItem(RICH_TEXT_FORMAT_KEY, richTextFormatSelect.value);
});

codeBlockToTableCheckbox.addEventListener("change", () => {
    updateEditorPreview();
    localStorage.setItem(CODE_BLOCK_TO_TABLE_KEY, codeBlockToTableCheckbox.checked ? "true" : "false");
});

pasteModeSelect.addEventListener("change", () => {
    localStorage.setItem(PASTE_MODE_KEY, pasteModeSelect.value);
});

tableStyleSelect.addEventListener("change", () => {
    const tableStyle = tableStyleSelect.value;
    if (typeof window.setTableStyleTheme === "function") {
        window.setTableStyleTheme(tableStyle);
    }
    updateEditorPreview();
    localStorage.setItem(TABLE_STYLE_KEY, tableStyle);
});

// 貼上富文本並轉成 Markdown
pasteRichBtn.addEventListener("click", async () => {
    await pasteRichTextAsMarkdown({
        markdownInput,
        pasteModeSelect,
        previewArea,
        markdownContentKey: MARKDOWN_CONTENT_KEY,
        updateEditorPreview,
        showEditorToast,
        t
    });
});

// 複製富文本功能
copyBtn.addEventListener("click", () => {
    if (markdownInput.value.trim() === "") return;

    if (copyRichText(previewArea)) {
        showEditorToast(t("toast.richCopiedSuccess"));
    } else {
        showEditorToast(t("toast.copyFailed"));
    }
});

// 清空功能
clearBtn.addEventListener("click", () => {
    if (confirm(t("confirm.clearAll"))) {
        markdownInput.value = "";
        updateEditorPreview();
        localStorage.removeItem(MARKDOWN_CONTENT_KEY);
    }
});

// 載入預設 Markdown
loadDefaultMarkdownBtn.addEventListener("click", async () => {
    if (markdownInput.value.trim() !== "" && !confirm(t("confirm.loadDefaultMarkdown"))) {
        return;
    }

    await loadDefaultMarkdown(markdownInput, t);
    updateEditorPreview();
    localStorage.setItem(MARKDOWN_CONTENT_KEY, markdownInput.value);
    showEditorToast(t("toast.defaultMarkdownLoaded"));
});

// 刪除空行功能
removeEmptyLinesBtn.addEventListener("click", () => {
    const lines = markdownInput.value.split("\n");
    const compacted = lines.filter(line => line.trim() !== "").join("\n");

    if (compacted === markdownInput.value) {
        showEditorToast(t("toast.noEmptyLines"));
        return;
    }

    markdownInput.value = compacted;
    updateEditorPreview();
    localStorage.setItem(MARKDOWN_CONTENT_KEY, markdownInput.value);
    showEditorToast(t("toast.removedEmptyLines"));
});

function updateEditorPreview() {
    updatePreview(
        markdownInput,
        previewArea,
        topHeadingLevelSelect.value,
        richTextFormatSelect.value,
        codeBlockToTableCheckbox.checked
    );
}

function showEditorToast(msg) {
    showToast(messageBox, msg);
}

function refreshLocalizedRuntimeText() {
    messageBox.textContent = t("toast.copiedToClipboard");
}

onLanguageChange(() => {
    refreshLocalizedRuntimeText();
});
