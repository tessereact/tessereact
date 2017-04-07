import React, {PropTypes} from 'react'
import List from '../List'
import FilterInput from '../../styled/FilterInput'
import Sidebar from '../../styled/Sidebar'
import {Link} from 'react-router-dom'

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
    return this.props.failedScenariosCount > 0 && <Sidebar.Failed>
      FAILED ({this.props.failedScenariosCount}/{this.props.scenariosCount})
    </Sidebar.Failed>
  },

  render () {
    return (
      <Sidebar>
        <Link to='/' style={{textDecoration: 'none'}}><Sidebar.Header>Testshot</Sidebar.Header></Link>
        <Sidebar.SearchBox>
          <FilterInput placeholder='Search' ref={this.state.searchQuery} onChange={this._handleFilter} />
        </Sidebar.SearchBox>
        <Sidebar.List>
          {this._renderFailed()}
          <List
            nodes={this.props.nodes}
            searchQuery={this.state.searchQuery}
          />
        </Sidebar.List>
      </Sidebar>
    )
  }
})

export default Navigation
