import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Header = styled.div`
  text-align: center;
  font-size: 24.5px;
  color: #34495e;
  font-weight: bold;
  margin-bottom: 15px;
  margin-top: 5px;
`

export default defaultMixin(Header)
