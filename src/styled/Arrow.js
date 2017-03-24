import styled from 'styled-components'

// TODO: Split it up into Button and built AcceptButton on top of it
const Arrow = {}
Arrow.Right = styled.div`
  display: inline-block;
  width: 0;
  height: 0;
  margin-right: 5px;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 4px solid;
`

Arrow.Down = styled.div`
  display: inline-block;
  width: 0;
  height: 0;
  margin-right: 5px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;

  border-top: 4px solid ;
`

export default Arrow

