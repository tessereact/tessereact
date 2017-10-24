import React from 'react'
import Sidebar from '../../../styled/Sidebar'
import ScenarioNavLink from '../../../styled/ScenarioNavLink'

/**
 * Footer of the sidebar. Shows demo mode page link.
 * @extends React.Component
 * @property {Object} props.selectedRoute - name of selected route, and if available, selected scenario and context
 */
class Footer extends React.Component {
  render () {
    if (!window.__tessereactDemoMode) {
      return null
    }

    return <Sidebar.Footer>
      <Sidebar.ListItem>
        <ScenarioNavLink
          name='demo'
          active={this.props.selectedRoute.name === 'demo'}
        >
          {window.__tessereactDemoMode.link}
        </ScenarioNavLink>
      </Sidebar.ListItem>
    </Sidebar.Footer>
  }
}

export default Footer
