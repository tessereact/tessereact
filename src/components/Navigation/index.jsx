import React, {PropTypes} from 'react'
import List from '../List'
import FilterInput from '../../styled/FilterInput'
import Sidebar from '../../styled/Sidebar'
import Link from '../../lib/link'

const Navigation = React.createClass({
  propTypes: {
    failedScenariosCount: PropTypes.number,
    scenariosCount: PropTypes.number,
    nodes: PropTypes.array
  },

  getInitialState () {
    return {
      searchQuery: ''
    }
  },

  _handleFilter (event) {
    this.setState({searchQuery: event.target.value})
  },

  _renderFailed () {
    const {failedScenariosCount, scenariosCount} = this.props

    return failedScenariosCount > 0 && <Sidebar.Failed>
      FAILED ({failedScenariosCount}/{scenariosCount})
    </Sidebar.Failed>
  },

  render () {
    const {searchQuery} = this.state
    const {nodes} = this.props

    return (
      <Sidebar>
        <Link name='home' style={{textDecoration: 'none'}}><Sidebar.Header>Testshot</Sidebar.Header></Link>
        <Sidebar.SearchBox>
          <FilterInput placeholder='Search' ref={searchQuery} onChange={this._handleFilter} />
        </Sidebar.SearchBox>
        <Sidebar.List>
          {this._renderFailed()}
          <List
            nodes={nodes}
            searchQuery={searchQuery}
          />
        </Sidebar.List>
      </Sidebar>
    )
  }
})

export default Navigation
