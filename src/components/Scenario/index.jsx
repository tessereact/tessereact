import React, {PropTypes} from 'react'
import ScenarioLink from '../../styled/ScenarioLink'
import {isNodeActive, matchesQuery} from '../_lib/utils'

const Scenario = React.createClass({
  propTypes: {
    node: PropTypes.object,
    selectedScenario: PropTypes.shape({
      name: PropTypes.string.isRequired,
      context: PropTypes.string
    }).isRequired,
    selectScenario: PropTypes.func,
    searchQuery: PropTypes.string,
    child: PropTypes.bool
  },

  render () {
    return matchesQuery(this.props.searchQuery, this.props.node.name) &&
      <li key={this.props.node.name}>
        <ScenarioLink
          hasDiff={this.props.node.hasDiff}
          onClick={() => this.props.selectScenario(this.props.node.name, this.props.node.context)}
          active={isNodeActive(this.props.selectedScenario, this.props.node)}
          child={this.props.child}
        >
          {this.props.node.name}
        </ScenarioLink>
      </li>
  }

})

export default Scenario

