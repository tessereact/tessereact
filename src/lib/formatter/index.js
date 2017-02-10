import {html} from 'js-beautify'

const htmlFormatterOptions = {
  indent_size: 2,
  end_with_newline: true,
  unformatted: ['b', 'i', 'strong']
}

const formatHTML = str => {
  return str ? html(str, htmlFormatterOptions) : ''
}

export default formatHTML

