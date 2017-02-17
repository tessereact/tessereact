import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Sidebar = styled.div`
  flex-basis: 15%;
  padding: 10px;
  color: #585858;
  text-align: left;
  max-height: 100vh;
  min-width: 200px;
  overflow-y: auto;
`

export default defaultMixin(Sidebar)
