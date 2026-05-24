function sanitizePastedMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const firstLine = lines[0]?.trim();
    const lastLine = lines[lines.length - 1]?.trim();

    if (firstLine === "**" && lastLine === "**" && lines.length >= 2) {
        lines.shift();
        lines.pop();
    }

    return lines.join("\n").trim();
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

function getLocalizedPasteMode(mode, t) {
    const modeKeyMap = {
        replace: "controls.pasteModeReplace",
        append: "controls.pasteModeAppend",
        prepend: "controls.pasteModePrepend"
    };

    const key = modeKeyMap[mode];
    return key ? t(key) : mode;
}

export async function pasteRichTextAsMarkdown({
    markdownInput,
    pasteModeSelect,
    previewArea,
    markdownContentKey,
    updateEditorPreview,
    showEditorToast,
    t
}) {
    try {
        const clipboardContent = await window.readClipboardContent();
        if (!clipboardContent) {
            showEditorToast(t("toast.clipboardEmpty"));
            return;
        }

        const markdown = clipboardContent.html ? window.convertHtmlToMarkdown(clipboardContent.html) : clipboardContent.text;
        const sanitizedMarkdown = sanitizePastedMarkdown(markdown);

        if (!sanitizedMarkdown) {
            showEditorToast(t("toast.clipboardBlank"));
            return;
        }

        const pasteMode = pasteModeSelect.value;
        markdownInput.value = mergeMarkdownContent(markdownInput.value, sanitizedMarkdown, pasteMode);
        updateEditorPreview();
        localStorage.setItem(markdownContentKey, markdownInput.value);
        const localizedMode = getLocalizedPasteMode(pasteMode, t);

        if (window.copyRichText(previewArea)) {
            showEditorToast(t("toast.pasteAndCopied", { mode: localizedMode }));
        } else {
            showEditorToast(t("toast.pasteCopyFailed", { mode: localizedMode }));
        }
    } catch (err) {
        console.error("Unable to read clipboard:", err);
        showEditorToast(t("toast.clipboardPermissionDenied"));
    }
}
