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
        return table.outerHTML.trim();
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
