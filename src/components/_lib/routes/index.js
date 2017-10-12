import History from '../../../lib/router/history'
import { findScenario, sortScenarios } from '../scenarios'

/**
 * Check if scenario/context associated by given route doesn't exist.
 * In that case, redirect to the correct route.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 */
export function checkIfRouteExists (routeData, scenarios) {
  const {
    params: { context, scenario },
    route: { name: routeName }
  } = routeData

  switch (routeName) {
    case 'scenario':
      !findScenario(scenarios, context, scenario) &&
        History.push(`/contexts/${context}`)
      break
    case 'context':
      !scenarios.find((s) => { return s.context === context }) &&
        History.push('/')
      break
    case 'home':
    case 'demo':
      break
    default:
      History.push('/')
  }
}

/**
 * Check if the current route is home (/) and redirect to the first failing scenario.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 */
export function checkForHomeRoute (routeData, scenarios) {
  const routeName = routeData.route.name

  if (routeName === 'home') {
    const scenario = scenarios.find((s) => { return s.hasDiff }) || scenarios[0]
    History.push(`/contexts/${scenario.context}/scenarios/${scenario.name}`)
  }
}

function redirectToFirstScenario (scenarios) {
  const scenario = sortScenarios(scenarios)[0]
  redirectToScenario(scenario)
}

/**
 * Check if the current route is home (/) and redirect to /demo.
 *
 * @param {RouteData} routeData
 */
export function checkForHomeRouteDemoMode (routeData, scenarios) {
  const routeName = routeData.route.name

  if (routeName === 'home') {
    History.push('/demo')
  }
}

/**
 * Redirect to home (/).
 *
 * @param {RouteData} routeData
 */
export function redirectToHome (routeData, scenarios) {
  History.push('/')
}

/**
 * Redirect to the first failing scenario.
 * In the case when none of the scenarios is failing, redirect to the first scenario.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 */
export function redirectToFirstFailingScenario (scenarios) {
  const scenario = sortScenarios(scenarios).find(s => s.hasDiff)

  if (!scenario) {
    return redirectToFirstScenario(scenarios)
  }

  redirectToScenario(scenario)
}

function redirectToScenario (scenario) {
  const { context, name } = scenario
  scenario && History.push(`/contexts/${context}/scenarios/${name}`)
}
