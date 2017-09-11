import React from 'react'
import { find } from 'lodash'

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
  getInitialState () {
    return {
      element: null
    }
  }

  componentWillMount () {
    const {
      routeData: {
        params: { context: contextName, scenario: name }
      }
    } = this.props
    const scenarios = this.props.data
    const context = contextName === 'null' ? null : contextName
    const scenario = find(scenarios, { name, context })
    this.setState({
      element: scenario.getElement()
    })
  }

  render () {
    const {element} = this.state
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
