async function readClipboardContent() {
    if (navigator.clipboard?.read) {
        const clipboardItems = await navigator.clipboard.read();

        for (const item of clipboardItems) {
            if (item.types.includes('text/html')) {
                const blob = await item.getType('text/html');
                return { html: await blob.text() };
            }
        }

        for (const item of clipboardItems) {
            if (item.types.includes('text/plain')) {
                const blob = await item.getType('text/plain');
                return { text: await blob.text() };
            }
        }
    }

    if (navigator.clipboard?.readText) {
        return { text: await navigator.clipboard.readText() };
    }

    throw new Error('Clipboard API is not available.');
}
