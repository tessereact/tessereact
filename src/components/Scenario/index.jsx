import React, {PropTypes} from 'react'
import Sidebar from '../../styled/Sidebar'
import {matchesQuery} from '../_lib/utils'
import ScenarioNavLink from '../../styled/ScenarioNavLink'

const Scenario = React.createClass({
  propTypes: {
    node: PropTypes.object,
    searchQuery: PropTypes.string,
    child: PropTypes.bool
  },

  _makeURL () {
    return `/contexts/${this.props.node.context}/scenarios/${this.props.node.name}`
  },

  render () {
    return matchesQuery(this.props.searchQuery, this.props.node.name) &&
      <Sidebar.ListItem key={this.props.node.name}>
        <ScenarioNavLink to={this._makeURL()}
          hasDiff={this.props.node.hasDiff}
          child={this.props.child}
        >
          {this.props.node.name}
        </ScenarioNavLink>
      </Sidebar.ListItem>
  }

})

export default Scenario
