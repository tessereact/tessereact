'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prepareStyles;
/**
 * Convert style sheet object to JSON suitable for sending to server.
 *
 * @param {StyleSheetList} styleSheets
 * @returns {Array} preparesStyleSheets
 */
function prepareStyles(styleSheets) {
  return toArray(styleSheets).reduce(function (array, _ref) {
    var rules = _ref.rules;
    return array.concat(toArray(rules).map(prepareCSSRule));
  }, []);
}

function prepareCSSRule(rule) {
  var matchResult = rule.cssText.match(/^([^{]*){/);

  var preparedRule = {
    selectorText: matchResult ? matchResult[1] : rule.cssText,
    cssText: rule.cssText
  };

  if (rule.cssRules) {
    preparedRule.cssRules = toArray(rule.cssRules).map(prepareCSSRule);
  }

  if (preparedRule.selectorText[0] === '@') {
    preparedRule.atRuleType = preparedRule.selectorText.match(/^@([a-z\-]+)/)[1];
  }

  return preparedRule;
}

function toArray(object) {
  return Array.prototype.slice.call(object);
}