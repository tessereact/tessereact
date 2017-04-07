import React, {PropTypes} from 'react'
import {flatten} from 'lodash'
import BottomPane from '../../styled/BottomPane'
import HighlightedDiff from '../../styled/HighlightedDiff'

const Diff = React.createClass({
  propTypes: {
    nodes: PropTypes.array
  },

  getInitialState () {
    return {
      collapsed: true
    }
  },

  _getNodes () {
    if (!this.state.collapsed) { return this.props.nodes }
    return this.props.nodes.map((n, i) => {
      const newNode = Object.assign({}, n)
      let showedRows
      const rows = n.value.split('\n')
      if (n.removed || n.added) {
        showedRows = rows
      } else if (i === 0) {
        showedRows = ['...'].concat(rows.slice(rows.length - 1, rows.length))
      } else if (i === rows.length - 1) {
        showedRows = rows.slice(0, 1).push(['...'])
      } else if (rows.length > 1) {
        showedRows = rows.slice(0, 1).concat('...').concat(rows.slice(rows.length - 1, rows.length))
      } else {
        showedRows = rows
      }
      newNode.value = showedRows.join('\n')
      return newNode
    })
  },

  _toggleCollapsed () {
    this.setState({collapsed: !this.state.collapsed})
  },

  _renderCollapseButton () {
    return <BottomPane.CollapseButton onClick={this._toggleCollapsed}>{this.state.collapsed ? 'Expand' : 'Collapse'}</BottomPane.CollapseButton>
  },

  render () {
    return (
      <BottomPane>
        <BottomPane.Row>
          <BottomPane.Column>
            <BottomPane.ColumnHeader><BottomPane.Text>Previous version</BottomPane.Text></BottomPane.ColumnHeader>
            <BottomPane.ColumnBody>
              {flatten(this._getNodes()).map((n, i) => {
                return !n.added && <HighlightedDiff key={i} removed={n.removed}>
                  {n.value}
                </HighlightedDiff>
              })}
            </BottomPane.ColumnBody>
          </BottomPane.Column>
          <BottomPane.Column>
            <BottomPane.ColumnHeader><BottomPane.Text>Current version</BottomPane.Text> {this._renderCollapseButton()}</BottomPane.ColumnHeader>
            <BottomPane.ColumnBody>
              {flatten(this._getNodes()).map((n, i) => {
                return !n.removed && <HighlightedDiff key={i} added={n.added}>
                  {n.value}
                </HighlightedDiff>
              })}
            </BottomPane.ColumnBody>
          </BottomPane.Column>
        </BottomPane.Row>
      </BottomPane>
    )
  }
})

export default Diff
