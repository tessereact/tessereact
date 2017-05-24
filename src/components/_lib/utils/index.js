export const SEARCH_LIMIT = 3

export function matchesQuery (searchQuery, string) {
  if (!searchQuery) return true
  if (searchQuery.length < SEARCH_LIMIT) return true
  return !!string.toLowerCase().match(searchQuery.toLowerCase())
}
