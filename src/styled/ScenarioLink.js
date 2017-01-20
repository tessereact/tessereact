import styled from 'styled-components'
import defaultMixin from './mixins/default'

// TODO: Split it up into Button and built AcceptButton on top of it
const ScenarioLink = styled.a`
  color: ${ props => props.noDiff ? '#1abc9c' : '#e74c3c' };
  background: ${ props => props.active && '#e6e6e6'};
  display: block;
  text-align: left;
  cursor: pointer;
  padding: 7px 20px;
  margin-left: -10px;
  margin-right: -10px;
  padding-left: 30px;
`

export default defaultMixin(ScenarioLink)

