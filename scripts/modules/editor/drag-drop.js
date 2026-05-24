import { MARKDOWN_CONTENT_KEY } from "./settings.js";

export function bindMarkdownFileDrop({ markdownInput, markdownDropOverlay, t, updateEditorPreview, showEditorToast }) {
    const overlayController = createOverlayController(markdownDropOverlay);

    document.addEventListener("dragenter", event => {
        if (!hasFileInDataTransfer(event.dataTransfer)) return;
        event.preventDefault();
        overlayController.show();
    });

    document.addEventListener("dragover", event => {
        if (!hasFileInDataTransfer(event.dataTransfer)) return;
        event.preventDefault();
        overlayController.show();
    });

    document.addEventListener("dragleave", event => {
        if (!hasFileInDataTransfer(event.dataTransfer)) return;
        if (event.relatedTarget !== null) return;
        overlayController.hide();
    });

    window.addEventListener("dragend", overlayController.hide);
    window.addEventListener("blur", overlayController.hide);

    document.addEventListener("drop", async event => {
        if (!hasFileInDataTransfer(event.dataTransfer)) return;
        event.preventDefault();
        overlayController.hide();

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

function createOverlayController(overlayElement) {
    let hideTimerId = null;

    function setOverlayVisible(isVisible) {
        if (!overlayElement) return;
        overlayElement.classList.toggle("hidden", !isVisible);
        overlayElement.setAttribute("aria-hidden", isVisible ? "false" : "true");
    }

    function showOverlay() {
        if (hideTimerId !== null) {
            window.clearTimeout(hideTimerId);
            hideTimerId = null;
        }
        setOverlayVisible(true);
    }

    function hideOverlayWithDebounce() {
        if (hideTimerId !== null) {
            window.clearTimeout(hideTimerId);
        }

        hideTimerId = window.setTimeout(() => {
            setOverlayVisible(false);
            hideTimerId = null;
        }, 80);
    }

    return {
        show: showOverlay,
        hide: hideOverlayWithDebounce
    };
}
