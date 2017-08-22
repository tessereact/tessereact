const { JSDOM } = require('jsdom')

const styleCache = {}

/**
 * Filter only those CSS rules which are used in the provided HTML snapshot
 * and compile them into CSS file.
 *
 * @param {Array} styles - array of styles fetched from frontend
 * @param {String} snapshot
 * @param {Boolean} [shouldCacheCSS=false]
 * @param {String} [styleHash]
 * @returns {String} compiled CSS file
 */
function collectStylesFromSnapshot (styles, snapshot, shouldCacheCSS, styleHash) {
  let key
  if (shouldCacheCSS) {
    key = styleHash + ':' + snapshot
    if (Object.keys(styleCache).includes(key)) {
      return styleCache[key]
    }
  }

  const dom = new JSDOM(`<div>${snapshot}</div>`)
  const css = collectStylesFromNode(styles, dom.window.document.documentElement)

  if (shouldCacheCSS) {
    styleCache[key] = css
  }

  return css
}

function collectStylesFromNode (styles, node) {
  if (!node) {
    return ''
  }

  const nodes = treeIntoArray(node)

  return formatCSS(getMatchingStylesFromNodeArray(styles, nodes))
}

function treeIntoArray (node) {
  return [node]
    .concat(Array.prototype.slice.call(node.children).reduce(
      (array, child) => array.concat(treeIntoArray(child)),
      []
    ))
}

function getMatchingStylesFromNodeArray (styles, nodes) {
  return styles.map(rule => {
    // Filter only those @media rules which contain matching rules
    if (rule.type === 'media') {
      const mediaRules = getMatchingStylesFromNodeArray(rule.rules, nodes)
      return mediaRules.length && Object.assign({}, rule, {rules: mediaRules})
    }

    // All at-rules (e.g. @font-face) except @media are passed
    if (!rule.selectorText) {
      return rule
    }

    // Strip all pseudoclasses and pseudoelements from the selector
    const selectorText = rule.selectorText.replace(/::?[a-z\-]+(\([^)]*\))?/g, '')
    return nodes.some(node => node.matches(selectorText)) && rule
  }).filter(x => x)
}

function formatCSS (rules) {
  return rules.map(rule => formatCSSRule(rule)).join('\n\n') + '\n'
}

function formatCSSRule (rule, indent = 0) {
  const outerIndent = '  '.repeat(indent)
  const innerIndent = '  '.repeat(indent + 1)

  if (rule.type === 'media') {
    return [`${outerIndent}${rule.selectorText.trim()} {`]
      .concat(rule.rules.map(childRule => formatCSSRule(childRule, indent + 1)).join('\n\n'))
      .concat(`${outerIndent}}`)
      .join('\n')
  }

  const [_, selectorText, cssText] = rule.cssText.replace(/\n/g, ' ').match(/^([^{]*){(.*)}$/)

  return [`${outerIndent}${selectorText.trim()} {`]
    .concat(cssText
      .split(';')
      .map(prop => prop.trim())
      .filter(prop => prop)
      .map(prop => `${innerIndent}${prop};`)
    )
    .concat(`${outerIndent}}`)
    .join('\n')
}

module.exports = collectStylesFromSnapshot
