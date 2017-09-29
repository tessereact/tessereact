import React from 'react'
import Sidebar from '../../../styled/Sidebar'
import {matchesQuery, isScenarioSelected} from '../../_lib/utils'
import ScenarioNavLink from '../../../styled/ScenarioNavLink'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

/**
 * Component which represents scenario node of the node tree in sidebar.
 * @extends React.Component
 * @property {ScenarioObject} props.node
 * @property {Object} props.selectedRoute - scenario and context name of selected route
 * @property {String} [props.searchQuery]
 * @property {Boolean} [props.child] - is the scenarios is inside a context
 */
class Scenario extends React.Component {
  shouldComponentUpdate (nextProps) {
    const name = this.props.node.name
    const context = this.props.node.context

    if (
      isScenarioSelected(this.props.selectedRoute, context, name) !==
      isScenarioSelected(nextProps.selectedRoute, context, name)
    ) {
      return true
    }

    if (
      matchesQuery(this.props.searchQuery, name) !==
      matchesQuery(nextProps.searchQuery, name)
    ) {
      return true
    }

    return this.props.node.hasDiff !== nextProps.node.hasDiff
  }

  render () {
    const {
      searchQuery,
      child,
      node: {name, context, hasDiff},
      selectedRoute
    } = this.props
    const params = {context: context || 'null', scenario: name}

    const active = isScenarioSelected(selectedRoute, context, name)

    return (active || matchesQuery(searchQuery, name)) &&
      <Sidebar.ListItem key={name}>
        <ScenarioNavLink
          name='scenario'
          params={params}
          hasDiff={hasDiff}
          child={child}
          active={active}
        >
          <span ref={ref =>
            ref && active && ref.scrollIntoViewIfNeeded && ref.scrollIntoViewIfNeeded()
          }>
            {name}
          </span>
        </ScenarioNavLink>
      </Sidebar.ListItem>
  }
}

if (PropTypes) {
  Scenario.propTypes = {
    node: PropTypes.object.isRequired,
    searchQuery: PropTypes.string,
    child: PropTypes.bool,
    selectedRoute: PropTypes.object.isRequired
  }
}

export default Scenario
