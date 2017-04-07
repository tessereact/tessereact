import styled from 'styled-components'
import defaultMixin from './mixins/default'
import {NavLink} from 'react-router-dom'

const ContextNavLink = styled(NavLink)`
  color: #c7c7c7;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: -20px;
  margin-right: -10px;
  border-radius: 0 3px 3px 0;
  padding: 7px 20px;

  &.active {
    background: #278db5;
    color: #fefefe;
  }
`

export default defaultMixin(ContextNavLink)
