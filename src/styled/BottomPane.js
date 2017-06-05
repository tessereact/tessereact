import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Pane = defaultMixin(
  styled.div`
    background-color: #f5f6f8;
    text-align: left;
    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.15);
  `
)

Pane.Buttons = defaultMixin(
  styled.div`
    border-top: 1px solid #e2e2e2;
    display: flex;
    padding: 20px;
  `
)

Pane.Row = defaultMixin(
  styled.div`
    border-top: 1px solid #e2e2e2;
    display: flex;
  `
)

Pane.Column = defaultMixin(
  styled.div`
    width: 50%;
    overflow: scroll;
    padding: 10px;

    &:nth-child(even) {
      border-left: 1px solid #e2e2e2;
    }
  `
)

Pane.ColumnHeader = defaultMixin(
  styled.h3`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e2e2e2;
    color: #32363d;
    font-weight: normal;
    font-size: 14px;
    margin: 0;
    padding-bottom: 10px;
  `
)

Pane.ColumnBody = styled.pre`
  color: #32363d;
  line-height: 20px;
  font-size: 13px;
  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
  word-wrap: break-word;
  white-space: pre-wrap;
`

Pane.CollapseButton = styled.a`
  background: #278db5;
  float: right;
  cursor: pointer;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  padding: 3px;
`

Pane.Text = styled.span`
  padding: 3px;
`

export default Pane
