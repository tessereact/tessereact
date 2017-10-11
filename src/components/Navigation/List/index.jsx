import React from 'react'
import Context from '../Context'
import Scenario from '../Scenario'
import StyledList from '../../../styled/List'
import { sortNodes } from '../../_lib/scenarios'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

/**
 * Component which represents the nodes tree in sidebar.
 * @extends React.Component
 * @property {Array<ContextObject|ScenarioObject>} props.nodes - tree of contexts and scenarios
 * @property {Object} props.selectedRoute - name of selected route, and if available, selected scenario and context
 * @property {String} [props.searchQuery]
 * @property {Boolean} [props.child] - is the tree a subtree
 */
class List extends React.Component {
  _renderItem (node) {
    return node.children ? this._renderContext(node) : this._renderScenario(node)
  }

  _renderContext (node) {
    const {searchQuery, selectedRoute} = this.props

    return <Context
      key={node.name}
      node={node}
      searchQuery={searchQuery}
      selectedRoute={selectedRoute}
    />
  }

  _renderScenario (node) {
    const {searchQuery, child, selectedRoute} = this.props

    return <Scenario
      key={[node.context, node.name].join(' - ')}
      node={node}
      searchQuery={searchQuery}
      child={child}
      selectedRoute={selectedRoute}
    />
  }

  render () {
    return <StyledList>
      {sortNodes(this.props.nodes).map(this._renderItem, this)}
    </StyledList>
  }
}

if (PropTypes) {
  List.propTypes = {
    nodes: PropTypes.array.isRequired,
    child: PropTypes.bool,
    selectedRoute: PropTypes.object.isRequired,
    searchQuery: PropTypes.string
  }
}

export default List
