import React from 'react'
import { find } from 'lodash'
import router from '../../routes'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

/**
 * Component which renders a single scenario in isolation mode.
 * @extends React.Component
 * @property {Array<ScenarioObject>} props.data - list of scenarios created by user
 * @property {RouteData} props.routeData
 */
class ScenarioView extends React.Component {
  componentWillMount () {
    window.addEventListener('message', (event) => {
      router.navigateToRoute('view', event.data)
    }, false)
  }

  componentWillUnmount () {
    window.removeEventListener('message')
  }

  render () {
    const {
      routeData: {
        params: { context: contextName, scenario: name }
      }
    } = this.props
    const scenarios = this.props.data
    const context = contextName === 'null' ? null : contextName
    const scenario = find(scenarios, { name, context })
    const element = scenario.getElement()
    return element
  }
}

if (PropTypes) {
  ScenarioView.propTypes = {
    data: PropTypes.array.isRequired,
    routeData: PropTypes.object.isRequired
  }
}

export default ScenarioView
