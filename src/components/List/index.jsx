import React, {PropTypes} from 'react'
import Context from '../Context'
import Scenario from '../Scenario'

const List = React.createClass({
  propTypes: {
    nodes: PropTypes.array,
    child: PropTypes.bool,
    selectedScenario: PropTypes.object,
    selectScenario: PropTypes.func,
    searchQuery: PropTypes.string
  },

  _renderItem (node) {
    return node.children ? this._renderContext(node) : this._renderScenario(node)
  },

  _renderContext (node) {
    return <Context
      key={node.name}
      node={node}
      selectedScenario={this.props.selectedScenario}
      selectScenario={this.props.selectScenario}
      searchQuery={this.props.searchQuery}
    />
  },

  _renderScenario (node) {
    return <Scenario
      key={[node.context, node.name].join(' - ')}
      node={node}
      selectScenario={this.props.selectScenario}
      selectedScenario={this.props.selectedScenario}
      searchQuery={this.props.searchQuery}
      child={this.props.child}
    />
  },

  render () {
    return <ul>
      {this.props.nodes.map(this._renderItem)}
    </ul>
  }
})

export default List
