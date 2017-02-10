import React, {PropTypes} from 'react'
import {some} from 'lodash'
import List from '../List'
import ContextLink from '../../styled/ContextLink'
import {isNodeActive, matchesQuery, SEARCH_LIMIT} from '../_lib/utils'

const Context = React.createClass({
  propTypes: {
    node: PropTypes.object,
    selectedScenario: PropTypes.object,
    selectScenario: PropTypes.func,
    searchQuery: PropTypes.string
  },

  getInitialState () {
    return {
      expanded: false
    }
  },

  _hasFailingChildren () {
    return this.props.node.children.find(({hasDiff}) => hasDiff)
  },

  _shouldExpand () {
    return this.state.expanded || this._hasFailingChildren() || this._applyFilter()
  },

  _applyFilter () {
    return this.props.searchQuery.length >= SEARCH_LIMIT
  },

  _matchFilter () {
    return matchesQuery(this.props.searchQuery, this.props.node.name) ||
      some(this.props.node.children, child => (
        matchesQuery(this.props.searchQuery, child.name)
      ))
  },

  render () {
    console.log('isNodeActive', isNodeActive(this.props.selectedScenario, this.props.node))
    return this._matchFilter() && <li key={this.props.node.name}>
      <ContextLink
        hasDiff={this.props.node.hasDiff}
        active={isNodeActive(this.props.selectedScenario, this.props.node)}
        onClick={() => this.setState({expanded: !this.state.expanded})}
      >
        &rsaquo; {this.props.node.name}
      </ContextLink>
      {this._shouldExpand() && <List nodes={this.props.node.children} child selectedScenario={this.props.selectedScenario} selectScenario={this.props.selectScenario} />}
    </li>
  }
})

export default Context
