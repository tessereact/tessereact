import formatHTML from '../formatHTML'
import buildScreenshotPage from '../buildScreenshotPage'
import { chunk, sortBy } from 'lodash'
import { getTextDiff } from '../diff'

const defaultScreenshotSizes = [
  {width: 320, height: 568, alias: 'iPhone SE'},
  {width: 1024, height: 768}
]

/**
 * Find a scenario by the name of the scenario and the name of its context.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {String} contextName
 * @param {String} scenarioName
 * @returns {ScenarioObject} wanted scenario
 */
export function findScenario (scenarios, contextName, scenarioName) {
  return scenarios.find(s => {
    if (contextName !== 'null') {
      return s.name === scenarioName && s.context === contextName
    } else {
      return s.name === scenarioName && !s.context
    }
  })
}

function findScenarioIndex (scenarios, contextName, scenarioName) {
  return scenarios.findIndex(s => {
    if (contextName !== 'null') {
      return s.name === scenarioName && s.context === contextName
    } else {
      return s.name === scenarioName && !s.context
    }
  })
}

/**
 * Prepare scenario array to be sent to the server,
 * move selected scenario(s) to the start of the array if there are any,
 * split the array by chunks of the selected size.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 * @param {Number} [chunkSize]
 * @returns {Array<ScenarioObject>} scenario array prepared to be sent to server
 */
export function getChunksToLoad (routeData, scenarios, chunkSize = Infinity) {
  const {
    params: { context: contextName, scenario: name },
    route: { name: routeName }
  } = routeData

  const context = contextName === 'null' ? null : contextName
  if (routeName === 'scenario') {
    return shiftScenario(scenarios, context, name, chunkSize)
  } else if (routeName === 'context') {
    return shiftContext(scenarios, context, chunkSize)
  } else {
    return chunk(scenarios, chunkSize)
  }
}

function shiftScenario (scenarios, contextName, scenarioName, chunkSize) {
  const scenario = findScenario(scenarios, contextName, scenarioName)

  if (!scenario) {
    return scenarios
  }

  return [
    [scenario],
    ...chunk(
      scenarios.filter(s => {
        return s.name !== scenarioName || s.context !== contextName
      }),
      chunkSize
    )
  ]
}

function shiftContext (scenarios, contextName, chunkSize) {
  return [
    ...chunk(
      scenarios.filter(s => {
        return s.context === contextName
      }),
      chunkSize
    ),
    ...chunk(
      scenarios.filter(s => {
        return s.context !== contextName
      }),
      chunkSize
    )
  ]
}

/**
 * Accept the scenario in the given scenario array and return the array.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {ScenarioObject} acceptedScenario
 * @returns {Array<ScenarioObject>} new scenario array
 */
export function acceptScenario (scenarios, acceptedScenario) {
  const scenarioIndex = findScenarioIndex(
    scenarios,
    acceptedScenario.context,
    acceptedScenario.name
  )

  const scenario = scenarios[scenarioIndex]

  return Object.assign([], scenarios, {
    [scenarioIndex]: Object.assign({}, acceptedScenario, {
      previousSnapshot: scenario.snapshot,
      snapshot: scenario.snapshot,
      hasDiff: false,
      screenshotData: null
    })
  })
}

/**
 * Calculate diffs for the scenario, using old snapshots received from the server.
 * Replace the scenario with the new version in the given scenario array and return the array.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {ScenarioObject} scenario - scenario sent by the server
 * @param {Array<ScenarioObject>} css - array of CSS snapshots
 * @returns {Array<ScenarioObject>} new scenario array
 */
export function resolveScenario (scenarios, scenario, css) {
  let screenshotData

  const {name, context, snapshot: oldSnapshot, snapshotCSS: oldSnapshotCSS} = scenario

  const storedScenarioIndex = findScenarioIndex(
    scenarios,
    context,
    name
  )

  const storedScenario = scenarios[storedScenarioIndex]

  const element = storedScenario.getElement()
  const options = storedScenario.options

  const snapshot = formatHTML(storedScenario.getSnapshot())
  const snapshotCSS = options.css
    ? findScenario(css, context, name).snapshotCSS
    : null

  const hasDiff = snapshot !== oldSnapshot || (options.css && snapshotCSS !== oldSnapshotCSS)

  if (options.screenshot && hasDiff) {
    screenshotData = {
      before: buildScreenshotPage(oldSnapshot, oldSnapshotCSS),
      after: buildScreenshotPage(snapshot, snapshotCSS),
      screenshotSizes:
        (window.__tessereactConfig && window.__tessereactConfig.screenshotSizes) ||
          defaultScreenshotSizes
    }
  }

  return Object.assign([], scenarios, {
    [storedScenarioIndex]: {
      name,
      context,
      element,
      hasDiff,
      snapshot,
      snapshotCSS,
      oldSnapshot,
      oldSnapshotCSS,
      status: 'resolved',
      screenshotData,
      options
    }
  })
}

/**
 * Run callback on screenshotData of a specific scenario,
 * merge the result of the function with screenshotData
 * and return the resulting scenario array.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {ScenarioObject} scenario
 * @param {Function} callback
 * @returns {Array<ScenarioObject>} new scenario array
 */
export function changeScenarioScreenshotData (scenarios, scenario, callback) {
  const storedScenarioIndex = findScenarioIndex(
    scenarios,
    scenario.context,
    scenario.name
  )

  const storedScenario = scenarios[storedScenarioIndex]

  return Object.assign([], scenarios, {
    [storedScenarioIndex]: Object.assign({}, storedScenario, {
      screenshotData: Object.assign(
        {},
        storedScenario.screenshotData,
        callback(storedScenario.screenshotData)
      )
    })
  })
}

/**
 * Prepare scenario to be sent to server for acceptance:
 * return only those fields of scenario object which are required by the server.
 *
 * @param {ScenarioObject} scenario
 * @returns {ScenarioObject} scenario prepared to be sent to server
 */
export function requestScenarioAcceptance (scenario) {
  const payload = {
    name: scenario.name,
    context: scenario.context,
    snapshot: scenario.snapshot,
    snapshotCSS: scenario.snapshotCSS,
    screenshotData: scenario.screenshotData
  }

  return payload
}

/**
 * Create an object to send to the server in CI mode.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @returns {Object} CI report object
 */
export function prepareCIReport (scenarios) {
  const failingScenarios = scenarios
    .filter(({hasDiff}) => hasDiff)
    .map(scenario => ({
      name: scenario.name,
      context: scenario.context,
      diff: getTextDiff(scenario)
    }))

  if (failingScenarios.length > 0) {
    return {
      status: 'not OK',
      scenarios: failingScenarios
    }
  } else {
    return { status: 'OK' }
  }
}

/**
 * Sort an array of scenarios.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @returns {Array<ScenarioObject>} sorted scenarios
 */
export function sortScenarios (scenarios) {
  return sortBy(
    scenarios,
    ['context', 'name'],
    ['desc', 'desc']
  )
}

/**
 * Sort a tree of contexts and scenarios.
 *
 * @param {Array<ContextObject|ScenarioObject>} nodes
 * @returns {Array<ContextObject|ScenarioObject>} sorted nodes
 */
export function sortNodes (nodes) {
  return sortBy(
    nodes,
    [(node) => !node.hasDiff, (node) => !node.children, 'name'],
    ['desc', 'desc', 'desc']
  )
}
