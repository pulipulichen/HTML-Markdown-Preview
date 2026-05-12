const DEFAULT_TOP_HEADING_LEVEL = 2;

function updatePreview(markdownInput, previewArea, topHeadingLevel = DEFAULT_TOP_HEADING_LEVEL) {
    let rawValue = markdownInput.value;
    rawValue = filterMarkdown(rawValue);

    previewArea.innerHTML = marked.parse(rawValue);
    normalizeHeadingLevels(previewArea, topHeadingLevel);
    applyWordTableStyles(previewArea);
}

function normalizeHeadingLevels(container, topHeadingLevel) {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    if (headings.length === 0) {
        return;
    }

    const targetTopLevel = normalizeTopHeadingLevel(topHeadingLevel);
    const topLevel = Math.min(...headings.map(getHeadingLevel));
    const offset = targetTopLevel - topLevel;

    headings.forEach(heading => {
        const nextLevel = Math.min(6, Math.max(1, getHeadingLevel(heading) + offset));
        if (nextLevel === getHeadingLevel(heading)) {
            return;
        }

        const replacement = document.createElement(`h${nextLevel}`);
        Array.from(heading.attributes).forEach(attribute => {
            replacement.setAttribute(attribute.name, attribute.value);
        });
        replacement.innerHTML = heading.innerHTML;
        heading.replaceWith(replacement);
    });
}

function getHeadingLevel(heading) {
    return Number(heading.tagName.slice(1));
}

function normalizeTopHeadingLevel(level) {
    const normalizedLevel = Number(level);
    if (!Number.isInteger(normalizedLevel) || normalizedLevel < 1 || normalizedLevel > 6) {
        return DEFAULT_TOP_HEADING_LEVEL;
    }

    return normalizedLevel;
}
