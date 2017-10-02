import { html } from 'js-beautify'

const htmlFormatterOptions = {
  indent_size: 2,
  end_with_newline: true,
  unformatted: ['b', 'i', 'strong']
}

/**
 * Indent the provided HTML string.
 *
 * @param {String} str - unindented HTML
 * @returns {String} - indented HTML
 */
export default function formatHTML (str) {
  return str ? html(str, htmlFormatterOptions) : ''
}
