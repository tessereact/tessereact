import React, {PropTypes} from 'react'
import {some} from 'lodash'
import List from '../List'
import Sidebar from '../../styled/Sidebar'
import Arrow from '../../styled/Arrow'
import ContextNavLink from '../../styled/ContextNavLink'
import {matchesQuery, SEARCH_LIMIT} from '../_lib/utils'
import routes from '../../routes'

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
    return window.location.pathname.match(`/contexts/${this.props.node.name}`) ||
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

  render () {
    const {name, children} = this.props.node
    const path = routes.hrefTo('context', {context: name})

    // If context's name matches filter, render all children. Otherwise, filter them
    const filteredChildren = this._matchFilter()
      ? children
      : children.filter(({name}) => matchesQuery(this.props.searchQuery, name))

    return filteredChildren.length > 0 && <Sidebar.ListItem key={name}>
      <ContextNavLink
        name='context'
        params={{context: name}}
        active={routes.isPathMatchesRouteOrParents(path)}>
        {this._renderIcon()} {name}
      </ContextNavLink>
      {this._shouldExpand() && <List nodes={filteredChildren} child />}
    </Sidebar.ListItem>
  }
})

export default Context
