import React from 'react'
import {pad, flatten} from 'lodash'
import BottomPane from './styled/BottomPane'
import HighligthedDiff from './styled/HighligthedDiff'

const Formatter = React.createClass({
  render () {
    return (
      <BottomPane>
        <BottomPane.Row>
          <BottomPane.Column>
            <BottomPane.ColumnHeader>Previous version</BottomPane.ColumnHeader>
            <BottomPane.ColumnBody>
              {flatten(this.props.nodes).map((n, i) => {
                return !n.added && <HighligthedDiff key={i} removed={n.removed}>
                  {n.value}
                </HighligthedDiff>
              })}
            </BottomPane.ColumnBody>
          </BottomPane.Column>
          <BottomPane.Column>
            <BottomPane.ColumnHeader>Current version</BottomPane.ColumnHeader>
            <BottomPane.ColumnBody>
              {flatten(this.props.nodes).map((n, i) => {
                return !n.removed && <HighligthedDiff key={i} added={n.added}>
                  {n.value}
                </HighligthedDiff>
              })}
            </BottomPane.ColumnBody>
          </BottomPane.Column>
        </BottomPane.Row>
      </BottomPane>
    )
  }
})

export default Formatter
