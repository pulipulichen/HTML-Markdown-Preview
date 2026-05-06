function convertHtmlToMarkdown(html) {
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        bulletListMarker: '-'
    });

    if (window.turndownPluginGfm) {
        turndownService.use(window.turndownPluginGfm.gfm);
    }

    addMarkdownTableRule(turndownService);

    return turndownService.turndown(html);
}

function addMarkdownTableRule(turndownService) {
    turndownService.addRule('markdownTables', {
        filter: 'table',
        replacement: (content, node) => {
            const markdownTable = convertTableNodeToMarkdown(node, turndownService);
            return `\n\n${markdownTable}\n\n`;
        }
    });
}

function convertTableNodeToMarkdown(table, turndownService) {
    if (table.querySelector('[rowspan], [colspan]')) {
        const tableClone = table.cloneNode(true);
        applyWordTableStyles(tableClone);
        return tableClone.outerHTML.trim();
    }

    const rows = Array.from(table.rows)
        .map(row => Array.from(row.cells).map(cell => convertTableCellToMarkdown(cell, turndownService)))
        .filter(row => row.length > 0);

    if (rows.length === 0) {
        return '';
    }

    const columnCount = Math.max(...rows.map(row => row.length));
    const normalizedRows = rows.map(row => padTableRow(row, columnCount));
    const headerRow = normalizedRows[0].map((cell, index) => cell || `欄位 ${index + 1}`);
    const dividerRow = Array(columnCount).fill('---');
    const bodyRows = normalizedRows.slice(1);

    return [headerRow, dividerRow, ...bodyRows]
        .map(row => `| ${row.join(' | ')} |`)
        .join('\n');
}

function convertTableCellToMarkdown(cell, turndownService) {
    const cellClone = cell.cloneNode(true);

    cellClone.querySelectorAll('br').forEach(br => {
        br.replaceWith(document.createTextNode('<br>'));
    });

    return turndownService.turndown(cellClone.innerHTML)
        .replace(/\r?\n\s*\r?\n/g, '<br>')
        .replace(/\r?\n/g, '<br>')
        .replace(/\|/g, '\\|')
        .trim();
}

function padTableRow(row, columnCount) {
    return row.concat(Array(Math.max(columnCount - row.length, 0)).fill(''));
}

function applyWordTableStyles(container) {
    const tables = container.matches?.('table') ? [container] : Array.from(container.querySelectorAll('table'));

    tables.forEach(table => {
        table.removeAttribute('style');
        table.setAttribute('border', '1');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '6');
        table.setAttribute('width', '100%');
        table.setAttribute('bordercolor', '#4b5563');

        Array.from(table.rows).forEach((row, rowIndex) => {
            const isHeaderRow = rowIndex === 0;
            const isEvenBodyRow = rowIndex > 0 && rowIndex % 2 === 0;
            const backgroundColor = isHeaderRow ? '#1f4e79' : isEvenBodyRow ? '#d9eaf7' : '#ffffff';

            row.removeAttribute('style');
            row.setAttribute('bgcolor', backgroundColor);

            Array.from(row.cells).forEach((cell, cellIndex) => {
                const align = cell.getAttribute('align') || getStyleTextAlign(cell) || 'left';

                cell.removeAttribute('style');
                cell.setAttribute('bgcolor', backgroundColor);
                cell.setAttribute('align', align);
                cell.setAttribute('valign', 'top');

                if (isHeaderRow) {
                    wrapCellContent(cell, '#ffffff', true, true);
                    return;
                }

                wrapCellContent(cell, '#1f2937', false, cellIndex === 0);
            });
        });

        table.querySelectorAll('[style]').forEach(element => {
            element.removeAttribute('style');
        });
    });
}

function getStyleTextAlign(cell) {
    const match = cell.getAttribute('style')?.match(/text-align\s*:\s*([^;]+)/i);

    return match ? match[1].trim() : '';
}

function wrapCellContent(cell, color, isBold, isItalic) {
    let content = cell.innerHTML;

    if (isItalic) {
        content = `<i>${content}</i>`;
    }

    if (isBold) {
        content = `<b>${content}</b>`;
    }

    cell.innerHTML = `<font color="${color}" face="Microsoft JhengHei, Arial">${content}</font>`;
}
