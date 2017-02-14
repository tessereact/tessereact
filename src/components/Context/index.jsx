import React, {PropTypes} from 'react'
import {some} from 'lodash'
import List from '../List'
import ContextLink from '../../styled/ContextLink'
import {isNodeActive, matchesQuery, SEARCH_LIMIT} from '../_lib/utils'

const Context = React.createClass({
  propTypes: {
    node: PropTypes.object,
    selectedNode: PropTypes.object,
    selectNode: PropTypes.func,
    searchQuery: PropTypes.string
  },

  _hasFailingChildren () {
    return this.props.node.children.find(({hasDiff}) => hasDiff)
  },

  _shouldExpand () {
    return this.props.selectedNode.name === this.props.node.name ||
      this.props.selectedNode.context === this.props.node.name ||
      this._hasFailingChildren() ||
      this._applyFilter()
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

  _handleClick () {
    this.props.selectNode(this.props.node.name, null)
  },

  render () {
    return this._matchFilter() && <li key={this.props.node.name}>
      <ContextLink
        hasDiff={this.props.node.hasDiff}
        active={isNodeActive(this.props.selectedNode, this.props.node)}
        onClick={this._handleClick}
      >
        &rsaquo; {this.props.node.name}
      </ContextLink>
      {this._shouldExpand() && <List nodes={this.props.node.children} child selectedNode={this.props.selectedNode} selectNode={this.props.selectNode} />}
    </li>
  }
})

export default Context
