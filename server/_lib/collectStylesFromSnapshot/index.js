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
    if (rule.cssRules) {
      // Ignore rules with prefixes (e.g. @-webkit-keyframes)
      if (rule.atRuleType[0] === '-') {
        return null
      }

      // Pass all children if the rule is @keyframes or @font-feature-values
      if (rule.atRuleType === 'keyframes' || rule.atRuleType === 'font-feature-values') {
        return rule
      }

      // Filter children in the rule is @media, @supports or @document
      const cssRules = getMatchingStylesFromNodeArray(rule.cssRules, nodes)
      return cssRules.length && Object.assign({}, rule, {cssRules})
    }

    // Ignore @charset, @import and @namespace rules
    if (
      rule.atRuleType === 'charset'
        || rule.atRuleType === 'import'
        || rule.atRuleType === 'namespace'
    ) {
      return null
    }

    // Pass all rules which are @page, @font-face, @viewport, @counter-style,
    // @swash, @ornaments, @annotation, @stylistic, @styleset or @character-variant
    if (rule.atRuleType) {
      return rule
    }

    // Strip all pseudoclasses and pseudoelements from the selector
    const selectorText = rule.selectorText.replace(/::?[a-z\-]+(\([^)]*\))?/g, '')

    // Check if any node matches the resulting selector and pass the rule if so
    return nodes.some(node => node.matches(selectorText)) && rule
  }).filter(x => x)
}

function formatCSS (rules) {
  return rules.map(rule => formatCSSRule(rule)).join('\n\n') + '\n'
}

function formatCSSRule (rule, indent = 0) {
  const outerIndent = '  '.repeat(indent)
  const innerIndent = '  '.repeat(indent + 1)

  if (rule.cssRules) {
    return [`${outerIndent}${rule.selectorText.trim()} {`]
      .concat(rule.cssRules.map(childRule => formatCSSRule(childRule, indent + 1)).join('\n\n'))
      .concat(`${outerIndent}}`)
      .join('\n')
  }

  const matchResult = rule.cssText.replace(/\n/g, ' ').match(/^([^{]*){(.*)}$/)

  // Format rules without a body (e.g. @namespace)
  if (!matchResult) {
    return `${outerIndent}${rule.cssText}`
  }

  const cssText = matchResult[2]

  return [`${outerIndent}${rule.selectorText.trim()} {`]
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
