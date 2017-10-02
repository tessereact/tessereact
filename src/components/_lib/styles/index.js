/**
 * Generate a unique CSS ID for a scenario.
 * @param {ScenarioObject} scenario
 * @returns {String}
 */
export function generateScenarioId (scenario) {
  return `--tessereact--${scenario.context}/${scenario.name}`
}

/**
 * Convert style sheet object to JSON suitable for filtering by `buildSnapshotCSS`.
 *
 * @param {StyleSheetList} styleSheets
 * @returns {Array<StyleObject>} preparesStyleSheets
 */
export function prepareStyles (styleSheets) {
  return toArray(styleSheets).reduce(
    (array, {rules}) =>
      array.concat(
        toArray(rules).map(prepareCSSRule)
      ),
    []
  )
}

function prepareCSSRule (rule) {
  const matchResult = rule.cssText.match(/^([^{]*){/)

  const preparedRule = {
    selectorText: matchResult ? matchResult[1] : rule.cssText,
    cssText: rule.cssText
  }

  if (rule.cssRules) {
    preparedRule.cssRules = toArray(rule.cssRules).map(prepareCSSRule)
  }

  if (preparedRule.selectorText[0] === '@') {
    preparedRule.atRuleType = preparedRule.selectorText.match(/^@([a-z-]+)/)[1]
  }

  return preparedRule
}

function toArray (object) {
  return Array.prototype.slice.call(object)
}

/**
 * Filter only those CSS rules which are used in the provided HTML node
 * and compile them into CSS file.
 *
 * @param {Array<StyleObject>} styles - array of styles fetched from frontend
 * @param {Node} node
 * @param {Node} documentElement - <html> tag node of the document
 * @param {Node} body - <body> tag node of the document
 * @returns {String} compiled CSS snapshot
 */
export function buildSnapshotCSS (styles, node, documentElement, body) {
  if (!node) {
    return ''
  }

  return formatCSS(getMatchingStylesFromNode(styles, node, documentElement, body))
}

function getMatchingStylesFromNode (styles, node, documentElement, body) {
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
      const cssRules = getMatchingStylesFromNode(rule.cssRules, node, documentElement, body)
      return cssRules.length && Object.assign({}, rule, {cssRules})
    }

    // Ignore @charset, @import and @namespace rules
    if (
      rule.atRuleType === 'charset' ||
        rule.atRuleType === 'import' ||
        rule.atRuleType === 'namespace'
    ) {
      return null
    }

    // Pass all rules which are @page, @font-face, @viewport, @counter-style,
    // @swash, @ornaments, @annotation, @stylistic, @styleset or @character-variant
    if (rule.atRuleType) {
      return rule
    }

    // Strip all pseudoclasses and pseudoelements from the selector
    const selectorText = rule.selectorText
      .replace(/([^\s:]*)(::?[a-z-]+(\([^)]*\))?)+/g, (_, selector) => selector || '*')

    // Check if any node matches the resulting selector and pass the rule if so
    return (node.querySelector(selectorText) || documentElement.matches(selectorText) || body.matches(selectorText)) && rule
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
