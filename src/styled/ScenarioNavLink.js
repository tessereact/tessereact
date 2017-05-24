import styled from 'styled-components'
import defaultMixin from './mixins/default'
import Link from '../lib/link'

const ScenarioNavLink = styled(Link)`
  color: ${props => props.active ? '#fff' : (props.hasDiff ? '#e91e63' : '#939599')};
  background: ${props => !props.active ? '' : props.hasDiff ? '#e91e63' : '#278db5'}
  overflow: hidden;
  display: block;
  text-align: left;
  cursor: pointer;
  padding: 7px 0px;
  border-radius: 0 3px 3px 0;
  margin-left: -20px;
  margin-right: -10px;
  padding-left: ${props => props.child ? '40px' : '20px'};
  text-decoration: none;
`

export default defaultMixin(ScenarioNavLink)
