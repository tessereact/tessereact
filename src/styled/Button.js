import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Button = styled.button`
  background-color: ${props => props.selected ? '#1abc9c' : '#bcbcbc'};
  color: #fff;
  padding: 10px 15px;
  font-size: 13px;
  border-radius: 4px;
  border: 0;
  line-height: 1.4;
  cursor: pointer;
  text-transform: uppercase;
  margin-left: 10px;
`

export default defaultMixin(Button)
