import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Text = styled.span`
  color: ${props => props.color};
  font-size: ${props => props.fontSize};
  font-weight: 500;
`

export default defaultMixin(Text)
