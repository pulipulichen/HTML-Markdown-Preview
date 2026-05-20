const markdownInput = document.getElementById('markdown-input');
const previewArea = document.getElementById('preview-area');
const copyBtn = document.getElementById('copy-btn');
const pasteRichBtn = document.getElementById('paste-rich-btn');
const clearBtn = document.getElementById('clear-btn');
const removeEmptyLinesBtn = document.getElementById('remove-empty-lines-btn');
const messageBox = document.getElementById('message-box');
const topHeadingLevelSelect = document.getElementById('top-heading-level');
const pasteModeSelect = document.getElementById('paste-mode');
const TOP_HEADING_LEVEL_KEY = 'top_heading_level';
const PASTE_MODE_KEY = 'paste_mode';

// 初始化：從 LocalStorage 讀取
window.onload = async () => {
    loadTopHeadingLevel();
    loadPasteMode();
    await loadInitialContent();
    updateEditorPreview();
};

// 即時轉換與儲存
markdownInput.addEventListener('input', () => {
    updateEditorPreview();
    localStorage.setItem('markdown_content', markdownInput.value);
});

topHeadingLevelSelect.addEventListener('change', () => {
    updateEditorPreview();
    localStorage.setItem(TOP_HEADING_LEVEL_KEY, topHeadingLevelSelect.value);
});

pasteModeSelect.addEventListener('change', () => {
    localStorage.setItem(PASTE_MODE_KEY, pasteModeSelect.value);
});

// 貼上富文本並轉成 Markdown
pasteRichBtn.addEventListener('click', pasteRichTextAsMarkdown);

// 複製富文本功能
copyBtn.addEventListener('click', () => {
    if (markdownInput.value.trim() === "") return;

    if (copyRichText(previewArea)) {
        showEditorToast("富文本已成功複製！");
    } else {
        showEditorToast("複製失敗，請手動選取。");
    }
});

// 清空功能
clearBtn.addEventListener('click', () => {
    if (confirm("確定要清空所有內容嗎？")) {
        markdownInput.value = "";
        updateEditorPreview();
        localStorage.removeItem('markdown_content');
    }
});

// 刪除空行功能
removeEmptyLinesBtn.addEventListener('click', () => {
    const lines = markdownInput.value.split('\n');
    const compacted = lines.filter(line => line.trim() !== '').join('\n');

    if (compacted === markdownInput.value) {
        showEditorToast("沒有可刪除的空行。");
        return;
    }

    markdownInput.value = compacted;
    updateEditorPreview();
    localStorage.setItem('markdown_content', markdownInput.value);
    showEditorToast("已刪除空行。");
});

async function loadInitialContent() {
    const savedContent = localStorage.getItem('markdown_content');
    if (savedContent) {
        markdownInput.value = savedContent;
        return;
    }

    try {
        const response = await fetch('default_markdown.md');
        let defaultContent = await response.text();
        defaultContent = defaultContent.trim();
        markdownInput.value = defaultContent;
    } catch (err) {
        console.error('無法讀取預設內容:', err);
        markdownInput.value = "# Markdown Editor";
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
    const validModes = ['replace', 'append', 'prepend'];

    if (savedPasteMode && validModes.includes(savedPasteMode)) {
        pasteModeSelect.value = savedPasteMode;
    }
}

async function pasteRichTextAsMarkdown() {
    try {
        const clipboardContent = await readClipboardContent();
        if (!clipboardContent) {
            showEditorToast("剪貼簿沒有可貼上的內容。");
            return;
        }

        const markdown = clipboardContent.html ? convertHtmlToMarkdown(clipboardContent.html) : clipboardContent.text;
        const sanitizedMarkdown = markdown.trim();

        if (!sanitizedMarkdown) {
            showEditorToast("剪貼簿內容是空白，未更新內容。");
            return;
        }

        const pasteMode = pasteModeSelect.value;
        markdownInput.value = mergeMarkdownContent(markdownInput.value, sanitizedMarkdown, pasteMode);
        updateEditorPreview();
        localStorage.setItem('markdown_content', markdownInput.value);

        if (copyRichText(previewArea)) {
            showEditorToast(`富文本已以 ${pasteMode} 模式轉成 Markdown 並複製！`);
        } else {
            showEditorToast(`富文本已以 ${pasteMode} 模式轉成 Markdown，但複製失敗。`);
        }
    } catch (err) {
        console.error('無法讀取剪貼簿:', err);
        showEditorToast("無法讀取剪貼簿，請確認瀏覽器權限。");
    }
}

function mergeMarkdownContent(currentContent, incomingContent, mode) {
    const currentText = currentContent.trim();

    if (mode === 'append') {
        if (!currentText) return incomingContent;
        return `${currentText}\n\n${incomingContent}`;
    }

    if (mode === 'prepend') {
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
