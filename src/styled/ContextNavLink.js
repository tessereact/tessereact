import styled from 'styled-components'
import defaultMixin from './mixins/default'
import Link from '../lib/link'

const ContextNavLink = styled(Link)`
  ${defaultMixin}
  color: ${props => props.active ? '#fefefe' : '#c7c7c7'};
  background: ${props => props.active ? '#278db5' : 'inherit'};
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: -20px;
  margin-right: -10px;
  border-radius: 0 3px 3px 0;
  padding: 7px 20px;
`

export default ContextNavLink
