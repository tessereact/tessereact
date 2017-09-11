import styled from 'styled-components'
import Button from './Button'

const SmallButton = styled(Button)`
  padding: 6px 10px;
  background-color: ${props => props.selected ? '#1abc9c' : '#bcbcbc'};
`

export default SmallButton
