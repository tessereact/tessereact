import { map, sortBy, groupBy, pickBy, pick, some } from 'lodash'

/**
 * Convert scenario array to the tree consumed by Navigation or List element.
 *
 * @param {Array<Scenario>} scenarios
 * @returns {Array<Context|Scenario>} tree of context and scenarios
 */
export default function generateTreeNodes (scenarios) {
  const groupedByContext = groupBy(scenarios, 'context')
  const contextsOnly = pickBy(groupedByContext, (v, k) => k !== 'null')
  const plainScenarios = pickBy(groupedByContext, (v, k) => k === 'null')['null']
  const result = map(contextsOnly, (value, key) => {
    const children = extractProperties(value)
    return {name: key, children: children, hasDiff: some(children, c => c.hasDiff)}
  }).concat(extractProperties(plainScenarios))
  return sortBy(result, sortByContextName).sort(sortingNodes)
}

function extractProperties (children) {
  return children ? children.map(c => pick(c, ['name', 'hasDiff', 'context'])) : []
}

function sortingNodes (node1, node2) {
  const node1HasDiff = node1.hasDiff || some(node1.children, c => c.hasDiff)
  if (node1HasDiff) return -1
  const node2HasDiff = node2.hasDiff || some(node2.children, c => c.hasDiff)
  if (node2HasDiff) return 1
  return 0
}

function sortByContextName (node) {
  return node.context || -1
}
