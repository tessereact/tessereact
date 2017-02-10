import React, {PropTypes} from 'react'
import List from '../List'
import Header from '../../styled/Header'
import FilterInput from '../../styled/FilterInput'
import Sidebar from '../../styled/Sidebar'

const Navigation = React.createClass({
  propTypes: {
    nodes: PropTypes.array,
    selectedScenario: PropTypes.object,
    selectScenario: PropTypes.func
  },

  getInitialState () {
    return {
      searchQuery: ''
    }
  },

  _handleFilter (event) {
    this.setState({searchQuery: event.target.value})
  },

  render () {
    return (
      <Sidebar>
        <Header>Scenarios</Header>
        <FilterInput ref={this.state.searchQuery} onChange={this._handleFilter} />
        <List
          nodes={this.props.nodes}
          selectScenario={this.props.selectScenario}
          selectedScenario={this.props.selectedScenario}
          searchQuery={this.state.searchQuery}
        />
      </Sidebar>
    )
  }
})

export default Navigation

