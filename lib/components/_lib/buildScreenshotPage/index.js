'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildScreenshotPage;
/**
 * Build full page snapshot from HTML and CSS snapshots.
 *
 * @param {String} html
 * @param {String} css
 * @returns {String} HTML and CSS snapshots combined
 */
function buildScreenshotPage(html, css) {
  if (!css || !html) {
    return null;
  }

  return ['<style>'].concat(css).concat('</style>').concat('').concat(html).join('\n');
}