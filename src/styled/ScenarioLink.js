import styled from 'styled-components'
import defaultMixin from './mixins/default'

// TODO: Split it up into Button and built AcceptButton on top of it
const ScenarioLink = styled.a`
  color: ${props => props.hasDiff && '#ff3a3a'};
  background: ${props => props.active && '#e6e6e6'};
  display: block;
  text-align: left;
  cursor: pointer;
  padding: 7px 20px;
  margin-left: -10px;
  margin-right: -10px;
  padding-left: 30px;
  list-style: none;
  padding-left: ${props => props.child && '50px'};
  border-left: ${props => props.child && '3px solid #34495e'};
`

export default defaultMixin(ScenarioLink)
