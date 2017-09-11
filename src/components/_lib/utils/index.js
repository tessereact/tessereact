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
