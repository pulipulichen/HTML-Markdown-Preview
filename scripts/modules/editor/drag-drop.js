import { MARKDOWN_CONTENT_KEY } from "./settings.js";

const DRAG_ACTIVE_CLASSES = ["ring-2", "ring-blue-400", "border-blue-400"];

export function bindMarkdownFileDrop({ markdownInput, t, updateEditorPreview, showEditorToast }) {
    ["dragenter", "dragover"].forEach(eventName => {
        markdownInput.addEventListener(eventName, event => {
            if (!hasFileInDataTransfer(event.dataTransfer)) return;
            event.preventDefault();
            markdownInput.classList.add(...DRAG_ACTIVE_CLASSES);
        });
    });

    ["dragleave", "dragend", "drop"].forEach(eventName => {
        markdownInput.addEventListener(eventName, () => {
            markdownInput.classList.remove(...DRAG_ACTIVE_CLASSES);
        });
    });

    markdownInput.addEventListener("drop", async event => {
        event.preventDefault();
        const markdownFile = extractMarkdownFile(event.dataTransfer);

        if (!markdownFile) {
            showEditorToast(t("toast.onlyMarkdownFileAllowed"));
            return;
        }

        try {
            const markdownContent = await markdownFile.text();
            markdownInput.value = markdownContent;
            updateEditorPreview();
            localStorage.setItem(MARKDOWN_CONTENT_KEY, markdownInput.value);
            showEditorToast(t("toast.markdownFileLoaded", { fileName: markdownFile.name }));
        } catch (error) {
            console.error("Failed to read dropped markdown file:", error);
            showEditorToast(t("toast.markdownFileReadFailed"));
        }
    });

    ["dragover", "drop"].forEach(eventName => {
        document.addEventListener(eventName, event => {
            if (!hasFileInDataTransfer(event.dataTransfer)) return;
            event.preventDefault();
        });
    });
}

function hasFileInDataTransfer(dataTransfer) {
    if (!dataTransfer || !dataTransfer.types) return false;
    return Array.from(dataTransfer.types).includes("Files");
}

function extractMarkdownFile(dataTransfer) {
    if (!dataTransfer || !dataTransfer.files || dataTransfer.files.length === 0) {
        return null;
    }

    const [file] = dataTransfer.files;
    if (!file) return null;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".md") || fileName.endsWith(".markdown")) {
        return file;
    }

    return null;
}
