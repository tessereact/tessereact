import React, {PropTypes} from 'react'
import Context from '../Context'
import Scenario from '../Scenario'

const List = React.createClass({
  propTypes: {
    nodes: PropTypes.array,
    child: PropTypes.bool,
    selectedNode: PropTypes.object,
    selectNode: PropTypes.func,
    searchQuery: PropTypes.string
  },

  _renderItem (node) {
    return node.children ? this._renderContext(node) : this._renderScenario(node)
  },

  _renderContext (node) {
    return <Context
      key={node.name}
      node={node}
      selectedNode={this.props.selectedNode}
      selectNode={this.props.selectNode}
      searchQuery={this.props.searchQuery}
    />
  },

  _renderScenario (node) {
    return <Scenario
      key={[node.context, node.name].join(' - ')}
      node={node}
      selectNode={this.props.selectNode}
      selectedNode={this.props.selectedNode}
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
