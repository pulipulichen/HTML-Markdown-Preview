import { onLanguageChange, t } from "./modules/i18n.js";

const markdownInput = document.getElementById("markdown-input");
const previewArea = document.getElementById("preview-area");
const copyBtn = document.getElementById("copy-btn");
const pasteRichBtn = document.getElementById("paste-rich-btn");
const clearBtn = document.getElementById("clear-btn");
const removeEmptyLinesBtn = document.getElementById("remove-empty-lines-btn");
const messageBox = document.getElementById("message-box");
const topHeadingLevelSelect = document.getElementById("top-heading-level");
const pasteModeSelect = document.getElementById("paste-mode");
const TOP_HEADING_LEVEL_KEY = "top_heading_level";
const PASTE_MODE_KEY = "paste_mode";
const MARKDOWN_CONTENT_KEY = "markdown_content";

// 初始化：從 LocalStorage 讀取
window.addEventListener("load", async () => {
    loadTopHeadingLevel();
    loadPasteMode();
    await loadInitialContent();
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

pasteModeSelect.addEventListener("change", () => {
    localStorage.setItem(PASTE_MODE_KEY, pasteModeSelect.value);
});

// 貼上富文本並轉成 Markdown
pasteRichBtn.addEventListener("click", pasteRichTextAsMarkdown);

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

async function loadInitialContent() {
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

function loadTopHeadingLevel() {
    const savedTopHeadingLevel = localStorage.getItem(TOP_HEADING_LEVEL_KEY);
    if (savedTopHeadingLevel) {
        topHeadingLevelSelect.value = savedTopHeadingLevel;
    }
}

function loadPasteMode() {
    const savedPasteMode = localStorage.getItem(PASTE_MODE_KEY);
    const validModes = ["replace", "append", "prepend"];

    if (savedPasteMode && validModes.includes(savedPasteMode)) {
        pasteModeSelect.value = savedPasteMode;
    }
}

async function pasteRichTextAsMarkdown() {
    try {
        const clipboardContent = await readClipboardContent();
        if (!clipboardContent) {
            showEditorToast(t("toast.clipboardEmpty"));
            return;
        }

        const markdown = clipboardContent.html ? convertHtmlToMarkdown(clipboardContent.html) : clipboardContent.text;
        const sanitizedMarkdown = markdown.trim();

        if (!sanitizedMarkdown) {
            showEditorToast(t("toast.clipboardBlank"));
            return;
        }

        const pasteMode = pasteModeSelect.value;
        markdownInput.value = mergeMarkdownContent(markdownInput.value, sanitizedMarkdown, pasteMode);
        updateEditorPreview();
        localStorage.setItem(MARKDOWN_CONTENT_KEY, markdownInput.value);
        const localizedMode = getLocalizedPasteMode(pasteMode);

        if (copyRichText(previewArea)) {
            showEditorToast(t("toast.pasteAndCopied", { mode: localizedMode }));
        } else {
            showEditorToast(t("toast.pasteCopyFailed", { mode: localizedMode }));
        }
    } catch (err) {
        console.error("Unable to read clipboard:", err);
        showEditorToast(t("toast.clipboardPermissionDenied"));
    }
}

function mergeMarkdownContent(currentContent, incomingContent, mode) {
    const currentText = currentContent.trim();

    if (mode === "append") {
        if (!currentText) return incomingContent;
        return `${currentText}\n\n${incomingContent}`;
    }

    if (mode === "prepend") {
        if (!currentText) return incomingContent;
        return `${incomingContent}\n\n${currentText}`;
    }

    return incomingContent;
}

function updateEditorPreview() {
    updatePreview(markdownInput, previewArea, topHeadingLevelSelect.value);
}

function showEditorToast(msg) {
    showToast(messageBox, msg);
}

function getLocalizedPasteMode(mode) {
    const modeKeyMap = {
        replace: "controls.pasteModeReplace",
        append: "controls.pasteModeAppend",
        prepend: "controls.pasteModePrepend"
    };

    const key = modeKeyMap[mode];
    return key ? t(key) : mode;
}

function refreshLocalizedRuntimeText() {
    messageBox.textContent = t("toast.copiedToClipboard");
}

onLanguageChange(() => {
    refreshLocalizedRuntimeText();
});
