import React, {PropTypes} from 'react'
import Sidebar from '../../styled/Sidebar'
import {matchesQuery} from '../_lib/utils'
import ScenarioNavLink from '../../styled/ScenarioNavLink'
import routes from '../../routes'

const Scenario = React.createClass({
  propTypes: {
    node: PropTypes.object,
    searchQuery: PropTypes.string,
    child: PropTypes.bool
  },

  render () {
    const {
      searchQuery,
      child,
      node: {name, context, hasDiff}
    } = this.props
    const params = {context: context || 'null', scenario: name}
    const path = routes.hrefTo('scenario', params)

    const active = routes.isPathMatchesRouteOrParents(path)

    return (active || matchesQuery(searchQuery, name)) &&
      <Sidebar.ListItem key={name}>
        <ScenarioNavLink
          name='scenario'
          params={params}
          hasDiff={hasDiff}
          child={child}
          active={active}
        >
          <a ref={ref =>
            ref && active && ref.scrollIntoViewIfNeeded && ref.scrollIntoViewIfNeeded()
          }>
            {name}
          </a>
        </ScenarioNavLink>
      </Sidebar.ListItem>
  }

})

export default Scenario
