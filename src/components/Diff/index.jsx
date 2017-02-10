import React, {PropTypes} from 'react'
import {flatten} from 'lodash'
import BottomPane from '../../styled/BottomPane'
import HighlightedDiff from '../../styled/HighlightedDiff'

const Diff = React.createClass({
  propTypes: {
    nodes: PropTypes.array
  },

  render () {
    return (
      <BottomPane>
        <BottomPane.Row>
          <BottomPane.Column>
            <BottomPane.ColumnHeader>Previous version</BottomPane.ColumnHeader>
            <BottomPane.ColumnBody>
              {flatten(this.props.nodes).map((n, i) => {
                return !n.added && <HighlightedDiff key={i} removed={n.removed}>
                  {n.value}
                </HighlightedDiff>
              })}
            </BottomPane.ColumnBody>
          </BottomPane.Column>
          <BottomPane.Column>
            <BottomPane.ColumnHeader>Current version</BottomPane.ColumnHeader>
            <BottomPane.ColumnBody>
              {flatten(this.props.nodes).map((n, i) => {
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
