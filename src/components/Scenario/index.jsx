import React, {PropTypes} from 'react'
import ScenarioLink from '../../styled/ScenarioLink'
import {isNodeActive, matchesQuery} from '../_lib/utils'

const Scenario = React.createClass({
  propTypes: {
    node: PropTypes.object,
    selectedNode: PropTypes.shape({
      name: PropTypes.string.isRequired,
      context: PropTypes.string
    }).isRequired,
    selectNode: PropTypes.func,
    searchQuery: PropTypes.string,
    child: PropTypes.bool
  },

  render () {
    return matchesQuery(this.props.searchQuery, this.props.node.name) &&
      <li key={this.props.node.name}>
        <ScenarioLink
          hasDiff={this.props.node.hasDiff}
          onClick={() => this.props.selectNode(this.props.node.context, this.props.node.name)}
          active={isNodeActive(this.props.selectedNode, this.props.node)}
          child={this.props.child}
        >
          {this.props.node.name}
        </ScenarioLink>
      </li>
  }

})

export default Scenario

