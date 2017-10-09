import styled from 'styled-components'
import defaultMixin from './mixins/default'

const ScenarioBlockHeader = styled.a`
  color: ${props => props.hasDiff ? '#e91e63 !important' : '#8f9297'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export default defaultMixin(ScenarioBlockHeader)
