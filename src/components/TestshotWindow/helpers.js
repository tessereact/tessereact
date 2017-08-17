import { map, filter, find, findIndex, sortBy, groupBy, pickBy, pick, some } from 'lodash'

export function requestScenarioAcceptance (scenario) {
  const payload = {
    name: scenario.name,
    context: scenario.context,
    snapshot: scenario.snapshot
  }

  if (scenario.snapshotCSS) {
    payload.snapshotCSS = scenario.snapshotCSS
  }

  return payload
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

function _sortByContextName (node) {
  return node.context || -1
}

export function resolveScenario (storedScenarios, scenario) {
  const storedScenarioIndex = findScenarioIndex(
    storedScenarios,
    scenario.context,
    scenario.name
  )

  const storedScenario = storedScenarios[storedScenarioIndex]

  return Object.assign([], storedScenarios, {
    [storedScenarioIndex]: {
      name: scenario.name,
      context: scenario.context,
      element: storedScenario.getElement(),
      diff: scenario.diff,
      hasDiff: scenario.diff,
      snapshot: scenario.snapshot,
      snapshotCSS: scenario.snapshotCSS,
      status: 'resolved'
    }
  })
}

export function findScenario (scenarios, contextName, scenarioName) {
  return find(scenarios, s => {
    if (contextName !== 'null') {
      return s.name === scenarioName && s.context === contextName
    } else {
      return s.name === scenarioName && !s.context
    }
  })
}

export function findScenarioIndex (scenarios, contextName, scenarioName) {
  return findIndex(scenarios, s => {
    if (contextName !== 'null') {
      return s.name === scenarioName && s.context === contextName
    } else {
      return s.name === scenarioName && !s.context
    }
  })
}

export function generateTreeNodes (snapshots) {
  const groupedByContext = groupBy(snapshots, 'context')
  const contextsOnly = pickBy(groupedByContext, (v, k) => k !== 'null')
  const plainScenarios = pickBy(groupedByContext, (v, k) => k === 'null')['null']
  const result = map(contextsOnly, (value, key) => {
    const children = _extractProperties(value)
    return {name: key, children: children, hasDiff: some(children, c => c.hasDiff)}
  }).concat(_extractProperties(plainScenarios))
  return sortBy(result, _sortByContextName).sort(_sortingNodes)
}

export function shiftCurrentScenario (scenarios, { name, context }) {
  const scenario = find(scenarios, { name, context })

  if (!scenario) {
    return scenarios
  }

  return [scenario].concat(
    filter(scenarios, s => {
      return s.name !== name || s.context !== context
    })
  )
}

export function shiftCurrentContext (scenarios, { context }) {
  return filter(scenarios, s => {
    return s.context === context
  }).concat(
    filter(scenarios, s => {
      return s.context !== context
    })
  )
}

export function onLoad () {
  return new Promise((resolve, reject) => {
    if (document.readyState === 'complete') {
      resolve()
    } else {
      window.addEventListener('load', resolve)
    }
  })
}

export function toArray (object) {
  return Array.prototype.slice.call(object)
}
