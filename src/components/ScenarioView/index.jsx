import React, { PropTypes } from 'react'
import { find } from 'lodash'

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

ScenarioView.propTypes = {
  data: PropTypes.array.isRequired,
  routeData: PropTypes.object
}

export default ScenarioView
