import styled from 'styled-components'
import defaultMixin from './mixins/default'

const ContextLink = styled.a`
  background: ${props => props.active && '#278db5'};
  color: ${props => props.active ? '#fefefe' : '#c7c7c7'};
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  text-align: left;
  padding: 7px 20px;
  margin-left: -20px;
  margin-right: -10px;
  padding-left: 20px;
  border-radius: 0 3px 3px 0;
`

export default defaultMixin(ContextLink)

