import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Sidebar = styled.div`
  flex-basis: ${ props => props.right ? '35%' : '15%' };
  padding: 10px;
  color: #333;
  text-align: left;
`

export default defaultMixin(Sidebar)
