function filterMarkdown(markdown) {

    if (markdown.startsWith('```markdown') && markdown.endsWith('```')) {
        markdown = markdown.slice(11, -3).trim()
    }

    if (markdown.indexOf('```markdown') > -1) {
        let needle_start = markdown.indexOf('```markdown') + 11
        let needle_end = markdown.lastIndexOf('```')
        markdown = markdown.slice(needle_start, needle_end)
    }


    markdown = markdown.replaceAll('</table>\n', '</table><br />\n')

    markdown = markdown.replaceAll('\n</pre>', '</pre>')

    return markdown
}