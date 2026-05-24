export function createEditorSync({ markdownInput, previewArea, topHeadingLevelSelect, richTextFormatSelect, codeBlockToTableCheckbox, messageBox, t }) {
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

    return {
        updateEditorPreview,
        showEditorToast,
        refreshLocalizedRuntimeText
    };
}
