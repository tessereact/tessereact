import styled from 'styled-components'

const HighligthedDiff = styled.span`
  background: ${props => props.added ? '#d8ffd8' : (props.removed && '#ffb0b0')}
`

export default HighligthedDiff
