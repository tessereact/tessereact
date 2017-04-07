import {map, find, groupBy, pickBy, pick, some} from 'lodash'
import formatHTML from '../../lib/formatter/'

export function pickFailingScenario (state) {
  let newState = state
  const failingScenario = find(state.scenarios, (s) => s.hasDiff)
  if (failingScenario) {
    newState = Object.assign({}, state)
    newState.selectedNode = failingScenario
  }
  return newState
}

export function buildInitialState (data) {
  const scenarios = data.map((f) => (f()))
  return {
    scenarios: scenarios
  }
}

export function requestScenariosList (scenarios) {
  return {
    data: scenarios.map(s => ({name: s.name, context: s.context}))
  }
}

export function requestScenarioAcceptance (scenario) {
  return {
    name: scenario.name,
    context: scenario.context,
    snapshot: scenario.snapshot
  }
}

export function mergeWithPayload (state, payload) {
  const newData = state.scenarios.map(s => {
    const query = s.context ? {name: s.name, context: s.context} : {name: s.name}
    const storedScenario = find(payload, query) || {}
    s.previousSnapshot = storedScenario.previousSnapshot
    s.snapshot = formatHTML(s.snapshot)
    s.hasDiff = s.snapshot !== s.previousSnapshot
    s.isScenario = true
    return s
  })
  return {scenarios: newData}
}

export function acceptCurrentScenario (state, scenario) {
  const newState = Object.assign({}, state)
  const newScenario = find(newState.scenarios, {name: scenario.name, context: scenario.context})
  newScenario.previousSnapshot = newScenario.snapshot
  newScenario.hasDiff = false
  newState.findNextFailingScenario = true
  return newState
}

function _extractProperties (children) {
  return children ? children.map(c => pick(c, ['name', 'hasDiff', 'context'])) : []
}

function _sortingNodes (node1, node2) {
  const node1HasDiff = node1.hasDiff || some(node1.children, c => c.hasDiff)
  if (node1HasDiff) return -1
  const node2HasDiff = node2.hasDiff || some(node2.children, c => c.hasDiff)
  if (node2HasDiff) return 1
  return 0
}

export function generateTreeNodes (snapshots) {
  const groupedByContext = groupBy(snapshots, 'context')
  const contextsOnly = pickBy(groupedByContext, (v, k) => k !== 'null')
  const plainScenarios = pickBy(groupedByContext, (v, k) => k === 'null')['null']
  const result = map(contextsOnly, (value, key) => {
    const children = _extractProperties(value)
    return {name: key, children: children, hasDiff: some(children, c => c.hasDiff)}
  }).concat(_extractProperties(plainScenarios))
  return result.sort(_sortingNodes)
}

