export function getEditorElements() {
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

    return {
        markdownInput,
        previewArea,
        copyBtn,
        pasteRichBtn,
        clearBtn,
        removeEmptyLinesBtn,
        loadDefaultMarkdownBtn,
        messageBox,
        topHeadingLevelSelect,
        richTextFormatSelect,
        pasteModeSelect,
        tableStyleSelect,
        codeBlockToTableCheckbox,
        sopSettingsBtn,
        sopSettingsModal,
        sopSettingsCloseBtn,
        sopSettingsCloseIconBtn,
        renderSettingsElements: {
            sopSection: renderSettingsSopSection,
            sopTopHeadingHint
        }
    };
}
