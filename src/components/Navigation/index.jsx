import React from 'react'
import List from '../List'
import FilterInput from '../../styled/FilterInput'
import Sidebar from '../../styled/Sidebar'
import Link from '../../lib/link'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

class Navigation extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      searchQuery: ''
    }
  }

  _handleFilter (event) {
    this.setState({searchQuery: event.target.value})
  }

  _renderLoading () {
    const {loadedScenariosCount, scenariosCount} = this.props

    return loadedScenariosCount !== scenariosCount && <Sidebar.Progress>
      LOADING ({loadedScenariosCount}/{scenariosCount})
    </Sidebar.Progress>
  }

  _renderFailed () {
    const {failedScenariosCount, loadedScenariosCount, scenariosCount} = this.props
    const showFailed = loadedScenariosCount === scenariosCount && failedScenariosCount > 0

    return showFailed && <Sidebar.Progress>
      FAILED ({failedScenariosCount}/{scenariosCount})
    </Sidebar.Progress>
  }

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
          {this._renderLoading()}
          {this._renderFailed()}
          <List
            nodes={nodes}
            searchQuery={searchQuery}
          />
        </Sidebar.List>
      </Sidebar>
    )
  }
}

if (PropTypes) {
  Navigation.propTypes = {
    loadedScenariosCount: PropTypes.number,
    failedScenariosCount: PropTypes.number,
    scenariosCount: PropTypes.number,
    nodes: PropTypes.array
  }
}

export default Navigation
