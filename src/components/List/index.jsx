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
    const {selectedNode, searchQuery, selectNode} = this.props

    return <Context
      key={node.name}
      node={node}
      selectedNode={selectedNode}
      selectNode={selectNode}
      searchQuery={searchQuery}
    />
  },

  _renderScenario (node) {
    const {selectNode, selectedNode, searchQuery, child} = this.props

    return <Scenario
      key={[node.context, node.name].join(' - ')}
      node={node}
      selectNode={selectNode}
      selectedNode={selectedNode}
      searchQuery={searchQuery}
      child={child}
    />
  },

  render () {
    return <ul>
      {this.props.nodes.map(this._renderItem)}
    </ul>
  }
})

export default List
