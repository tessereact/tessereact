import React from 'react'
import {some} from 'lodash'
import List from '../List'
import Sidebar from '../../styled/Sidebar'
import Arrow from '../../styled/Arrow'
import ContextNavLink from '../../styled/ContextNavLink'
import {matchesQuery, SEARCH_LIMIT} from '../_lib/utils'
import routes from '../../routes'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

/**
 * Component which represents context node of the node tree in sidebar.
 * @extends React.Component
 * @property {ContextObject} props.node
 * @property {String} [props.searchQuery]
 */
class Context extends React.Component {
  _hasFailingChildren () {
    return this.props.node.children.find(({hasDiff}) => hasDiff)
  }

  _shouldExpand () {
    return window.location.pathname.match(`/contexts/${this.props.node.name}`) ||
      this._hasFailingChildren() || (this._applyFilter() && this._searchMatchChildren())
  }

  _applyFilter () {
    return this.props.searchQuery.length >= SEARCH_LIMIT
  }

  _matchFilter () {
    return matchesQuery(this.props.searchQuery, this.props.node.name)
  }

  _searchMatchChildren () {
    return some(this.props.node.children, child => (
      matchesQuery(this.props.searchQuery, child.name)
    ))
  }

  _renderIcon () {
    return this._shouldExpand() ? <Arrow.Down /> : <Arrow.Right />
  }

  render () {
    const {name, children} = this.props.node
    const path = routes.hrefTo('context', {context: name})

    // If context's name matches filter, render all children.
    // Otherwise, filter them by query or selected
    const filteredChildren = this._matchFilter()
      ? children
      : children.filter(scenario => {
        const childPath = routes.hrefTo('scenario', {context: name, scenario: scenario.name})
        return matchesQuery(this.props.searchQuery, scenario.name) ||
          routes.isPathMatchesRouteOrParents(childPath)
      })

    const hasSelectedChildren = routes.isPathMatchesRouteOrParentsOrChildren(path)
    const active = routes.isPathMatchesRouteOrParents(path)

    return (hasSelectedChildren || filteredChildren.length > 0) &&
      <Sidebar.ListItem key={name}>
        <ContextNavLink
          name='context'
          params={{context: name}}
          active={active}
        >
          {this._renderIcon()}
          <span ref={ref =>
            ref && active && ref.scrollIntoViewIfNeeded && ref.scrollIntoViewIfNeeded()
          }>
            {name}
          </span>
        </ContextNavLink>
        {this._shouldExpand() && <List nodes={filteredChildren} child />}
      </Sidebar.ListItem>
  }
}

if (PropTypes) {
  Context.propTypes = {
    node: PropTypes.object.isRequired,
    searchQuery: PropTypes.string
  }
}

export default Context
