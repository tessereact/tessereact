/**
 * Convert style sheet object to JSON suitable for sending to server.
 *
 * @param {StyleSheetList} styleSheets
 * @returns {Array} preparesStyleSheets
 */
export default function prepareStyles (styleSheets) {
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
    preparedRule.atRuleType = preparedRule.selectorText.match(/^@([a-z\-]+)/)[1]
  }

  return preparedRule
}

function toArray (object) {
  return Array.prototype.slice.call(object)
}
