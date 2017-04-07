import React, {PropTypes} from 'react'
import {some} from 'lodash'
import List from '../List'
import Sidebar from '../../styled/Sidebar'
import Arrow from '../../styled/Arrow'
import ContextNavLink from '../../styled/ContextNavLink'
import {matchesQuery, SEARCH_LIMIT} from '../_lib/utils'
import {withRouter} from 'react-router'

const Context = React.createClass({
  propTypes: {
    node: PropTypes.object,
    selectedNode: PropTypes.object,
    selectNode: PropTypes.func,
    searchQuery: PropTypes.string,
    location: PropTypes.object
  },

  _hasFailingChildren () {
    return this.props.node.children.find(({hasDiff}) => hasDiff)
  },

  _shouldExpand () {
    return this.props.location.pathname.match(`/contexts/${this.props.node.name}`) ||
      this._hasFailingChildren() || (this._applyFilter() && this._searchMatchChildren())
  },

  _applyFilter () {
    return this.props.searchQuery.length >= SEARCH_LIMIT
  },

  _matchFilter () {
    return matchesQuery(this.props.searchQuery, this.props.node.name)
  },

  _searchMatchChildren () {
    return some(this.props.node.children, child => (
      matchesQuery(this.props.searchQuery, child.name)
    ))
  },

  _renderIcon () {
    return this._shouldExpand() ? <Arrow.Down /> : <Arrow.Right />
  },

  _makeURL () {
    return `/contexts/${this.props.node.name}`
  },

  render () {
    return this._matchFilter() && <Sidebar.ListItem key={this.props.node.name}>
      <ContextNavLink exact to={this._makeURL()}>
        {this._renderIcon()} {this.props.node.name}
      </ContextNavLink>
      {this._shouldExpand() && <List nodes={this.props.node.children} child />}
    </Sidebar.ListItem>
  }
})

export default withRouter(Context)
