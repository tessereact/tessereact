import React from 'react'
import Context from '../Context'
import Scenario from '../Scenario'
import StyledList from '../../../styled/List'

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
 * @property {Object} props.selectedRoute - scenario and context name of selected route
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

if (PropTypes) {
  List.propTypes = {
    nodes: PropTypes.array.isRequired,
    child: PropTypes.bool,
    selectedRoute: PropTypes.object.isRequired,
    searchQuery: PropTypes.string
  }
}

export default List
