export const SEARCH_LIMIT = 3

export function isNodeActive (selectedScenario, node) {
  return selectedScenario.name === node.name &&
    selectedScenario.context === node.context
}

export function matchesQuery (searchQuery, string) {
  if (!searchQuery) return true
  if (searchQuery.length < SEARCH_LIMIT) return true
  return !!string.toLowerCase().match(searchQuery.toLowerCase())
}

