import styled from 'styled-components'
import defaultMixin from './mixins/default'

// TODO: Split it up into Button and built AcceptButton on top of it
const AcceptButton = styled.button`
  background-color: #1abc9c;
  position: fixed;
  right: 20px;
  color: #fff;
  padding: 10px 15px;
  font-size: 13px;
  border-radius: 4px;
  border: 0;
  line-height: 1.4;
  cursor: pointer;
  text-transform: uppercase;
`

export default defaultMixin(AcceptButton)
