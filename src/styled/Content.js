import styled from 'styled-components'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  flex-basis: 80%;
  background: white;
  max-height: 100vh;
  overflow-y: auto;
`

Content.Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`

export default Content
