function filterMarkdown(markdown) {

    if (markdown.startsWith('```markdown') && markdown.endsWith('```')) {
        markdown = markdown.slice(11, -3).trim()
    }

    if (markdown.indexOf('```markdown') > -1) {
        let needle_start = markdown.indexOf('```markdown') + 11
        let needle_end = markdown.lastIndexOf('```')
        markdown = markdown.slice(needle_start, needle_end)
    }

    // @TODO 如果有一行只有多個 = 符號，則把該行刪除
    markdown = markdown.replace(/^={2,}\r?\n?/gm, '')

    markdown = markdown.replace(/\s*\[\d+(?:,\s*\d+)*\](?=。)/g, '')

    markdown = markdown.replace(/^\s*\[!NOTE\]\s*(.*)$/gm, '\n<table><tr><td bgcolor="yellow">[!NOTE] $1</td></tr></table>\n')

    markdown = markdown.replaceAll('</table>\n', '</table><br />\n')

    markdown = markdown.replaceAll('\n</pre>', '</pre>')

    return markdown
}