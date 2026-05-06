function copyRichText(previewArea) {
    const range = document.createRange();
    range.selectNode(previewArea);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
        const successful = document.execCommand('copy');
        selection.removeAllRanges();
        return successful;
    } catch (err) {
        selection.removeAllRanges();
        return false;
    }
}
