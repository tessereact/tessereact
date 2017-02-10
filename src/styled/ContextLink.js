import styled from 'styled-components'
import defaultMixin from './mixins/default'

const ContextLink = styled.a`
  background: ${props => props.active && '#e6e6e6'};
  display: block;
  cursor: pointer;
  text-align: left;
  padding: 7px 20px;
  margin-left: -10px;
  margin-right: -10px;
  padding-left: 30px;
`

export default defaultMixin(ContextLink)

