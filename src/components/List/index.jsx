import React, {PropTypes} from 'react'
import Context from '../Context'
import Scenario from '../Scenario'
import StyledList from '../../styled/List'

class List extends React.Component {
  _renderItem (node) {
    return node.children ? this._renderContext(node) : this._renderScenario(node)
  }

  _renderContext (node) {
    const {selectedNode, searchQuery, selectNode} = this.props

    return <Context
      key={node.name}
      node={node}
      selectedNode={selectedNode}
      selectNode={selectNode}
      searchQuery={searchQuery}
    />
  }

  _renderScenario (node) {
    const {searchQuery, child} = this.props

    return <Scenario
      key={[node.context, node.name].join(' - ')}
      node={node}
      searchQuery={searchQuery}
      child={child}
    />
  }

  render () {
    return <StyledList>
      {
        this.props.nodes
          // Separate contexts and scenarios and then sort alphabetically by name
          .sort((a, b) =>
            (Boolean(a.children) === Boolean(b.children) ? 0 : a.children ? -1 : 1) ||
              a.name.localeCompare(b.name)
          )
          .map(this._renderItem, this)
      }
    </StyledList>
  }
}

List.propTypes = {
  nodes: PropTypes.array,
  child: PropTypes.bool,
  selectedNode: PropTypes.object,
  selectNode: PropTypes.func,
  searchQuery: PropTypes.string
}

export default List
