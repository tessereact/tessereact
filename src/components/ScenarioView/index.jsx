import React, { PropTypes } from 'react'
import { find } from 'lodash'

const ScenarioView = React.createClass({
  propTypes: {
    data: PropTypes.array.isRequired,
    routeData: PropTypes.object
  },

  getInitialState () {
    return {
      element: null
    }
  },

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
  },

  render () {
    const {element} = this.state
    return element
  }
})

export default ScenarioView
