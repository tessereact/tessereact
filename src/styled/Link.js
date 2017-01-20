import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Link = styled.a`
  display: inline-block;
  background: #33C3F0;
  border-radius: 4px;
  padding: 5px 10px;
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 11px;
  position: fixed;
  bottom: 5px;
  right: 5px;
`

export default defaultMixin(Link)
