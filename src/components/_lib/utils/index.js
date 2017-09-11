export const SEARCH_LIMIT = 3

/**
 * Check if the context or scenario name matches search query.
 * @param {String} [searchQuery]
 * @param {String} string - context or scenario name
 * @returns {Boolean} result
 */
export function matchesQuery (searchQuery, string) {
  if (!searchQuery) return true
  if (searchQuery.length < SEARCH_LIMIT) return true
  return !!string.toLowerCase().match(searchQuery.toLowerCase())
}

/**
 * Check if the current scenario is selected.
 * @param {Object} routeParams
 * @param {String} [routeParams.context]
 * @param {String} [routeParams.scenario]
 * @param {String} contextName
 * @param {String} scenarioName
 * @returns {Boolean} result
 */
export function isScenarioSelected (routeParams, contextName, scenarioName) {
  return routeParams.context === (contextName || 'null') && routeParams.scenario === scenarioName
}

/**
 * Check if the current context is selected.
 * @param {Object} routeParams
 * @param {String} [routeParams.context]
 * @param {String} [routeParams.scenario]
 * @param {String} contextName
 * @returns {Boolean} result
 */
export function isContextSelected (routeParams, contextName) {
  return routeParams.context === contextName && !routeParams.scenario
}

/**
 * Check if the current context has scenario which is selected.
 * @param {Object} routeParams
 * @param {String} [routeParams.context]
 * @param {String} [routeParams.scenario]
 * @param {String} contextName
 * @returns {Boolean} result
 */
export function areContextChildrenSelected (routeParams, contextName) {
  return routeParams.context === contextName
}
