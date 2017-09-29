/**
 * Build full page snapshot from HTML and CSS snapshots.
 *
 * @param {String} html
 * @param {String} css
 * @returns {String} HTML and CSS snapshots combined
 */
export default function buildScreenshotPage (html, css) {
  if (!css || !html) {
    return null
  }

  return ['<style>']
    .concat(css)
    .concat('</style>')
    .concat('')
    .concat(html)
    .join('\n')
}
