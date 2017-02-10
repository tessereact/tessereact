import {map, find, groupBy, pickBy, pick} from 'lodash'
import formatHTML from '../../lib/formatter/'

export function pickFailingScenario (state) {
  let newState = state
  const failingScenario = find(state.scenarios, (s) => s.hasDiff)
  if (failingScenario) {
    newState = Object.assign({}, state)
    newState.selectedScenario = failingScenario
  }
  return newState
}

export function buildInitialState (data) {
  const scenarios = data.map((f) => (f()))
  return {
    selectedScenario: scenarios[0] || {},
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
    return s
  })
  return {scenarios: newData}
}

export function acceptCurrentScenario (state) {
  const newState = Object.assign({}, state)
  newState.selectedScenario.previousSnapshot = newState.selectedScenario.snapshot
  newState.selectedScenario.hasDiff = false
  return newState
}

function _extractProperties (children) {
  return children ? children.map(c => pick(c, ['name', 'hasDiff', 'context'])) : []
}

export function generateTreeNodes (snapshots) {
  const groupedByContext = groupBy(snapshots, 'context')
  const contextsOnly = pickBy(groupedByContext, (v, k) => k !== 'null')
  const plainScenarios = pickBy(groupedByContext, (v, k) => k === 'null')['null']
  return map(contextsOnly, (value, key) => {
    return {name: key, children: _extractProperties(value)}
  }).concat(_extractProperties(plainScenarios))
}
