import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Pane = defaultMixin(
  styled.div`
    background-color: #fafafa;
    text-align: left;
  `
)

Pane.Row = defaultMixin(
  styled.div`
    border-top: 1px solid #e6e6e6;
    display: flex;
  `
)

Pane.Column = defaultMixin(
  styled.div`
    width: 50%;
    overflow: scroll;
    padding: 20px;

    &:nth-child(even) {
      border-left: 1px solid #e6e6e6;
    }
  `
)

Pane.ColumnHeader = defaultMixin(
  styled.h3`
    border-bottom: 1px solid #e6e6e6;
    color: #4a4a4a;
    font-size: 16px;
    margin-bottom: 15px;
    padding-bottom: 15px;
  `
)

Pane.ColumnBody = styled.pre`
  color: #4a4a4a;
  line-height: 20px;
  font-size: 13px;
  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
  word-wrap: break-word;
  white-space: pre-wrap;
`

export default Pane
