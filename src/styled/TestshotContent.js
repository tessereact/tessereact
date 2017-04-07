import styled from 'styled-components'

const TestshotContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  flex-basis: 80%;
  background: white;
  max-height: 100vh;
  overflow-y: auto;
`

TestshotContent.Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`

export default TestshotContent
