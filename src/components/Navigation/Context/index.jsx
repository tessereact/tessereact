import React from 'react'
import {some} from 'lodash'
import List from '../List'
import Sidebar from '../../../styled/Sidebar'
import Arrow from '../../../styled/Arrow'
import ContextNavLink from '../../../styled/ContextNavLink'
import {
  SEARCH_LIMIT,
  matchesQuery,
  isContextSelected,
  isScenarioSelected,
  areContextChildrenSelected
} from '../../_lib/utils'

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
 * @property {Object} props.selectedRoute - name of selected route, and if available, selected scenario and context
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
    const {selectedRoute} = this.props
    const {name, children} = this.props.node

    // If context's name matches filter, render all children.
    // Otherwise, filter them by query or selected
    const filteredChildren = this._matchFilter()
      ? children
      : children.filter(scenario => {
        return matchesQuery(this.props.searchQuery, scenario.name) ||
          isScenarioSelected(selectedRoute, name, scenario.name)
      })

    const hasSelectedChildren = areContextChildrenSelected(selectedRoute, name)
    const active = isContextSelected(selectedRoute, name)

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
        {this._shouldExpand() && <List nodes={filteredChildren} selectedRoute={selectedRoute} child />}
      </Sidebar.ListItem>
  }
}

if (PropTypes) {
  Context.propTypes = {
    node: PropTypes.object.isRequired,
    searchQuery: PropTypes.string,
    selectedRoute: PropTypes.object.isRequired
  }
}

export default Context
