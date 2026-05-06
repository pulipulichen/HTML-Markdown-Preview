function updatePreview(markdownInput, previewArea) {
    let rawValue = markdownInput.value;
    rawValue = filterMarkdown(rawValue);

    previewArea.innerHTML = marked.parse(rawValue);
    applyWordTableStyles(previewArea);
}
