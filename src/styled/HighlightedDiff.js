import styled from 'styled-components'

const HighlightedDiff = styled.span`
  background: ${props => props.added ? '#d8ffd8' : (props.removed && '#ffb0b0')}
`

export default HighlightedDiff
