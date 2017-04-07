import styled from 'styled-components'
import defaultMixin from './mixins/default'
import {NavLink} from 'react-router-dom'

const ScenarioNavLink = styled(NavLink)`
  color: ${props => props.hasDiff ? '#e91e63' : '#939599'};
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

  &.active {
    color: #fff;
    background: ${props => props.hasDiff ? '#e91e63' : '#278db5'}
  }
`

export default defaultMixin(ScenarioNavLink)
