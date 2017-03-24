import styled from 'styled-components'
import defaultMixin from './mixins/default'

// TODO: Split it up into Button and built AcceptButton on top of it
const Text = styled.span`
  color: ${props => props.color};
  font-size: ${props => props.fontSize};
  font-weight: 500;
`

export default defaultMixin(Text)

