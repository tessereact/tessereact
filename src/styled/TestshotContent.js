import styled from 'styled-components'
import defaultMixin from './mixins/default'

const TestshotContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  flex-basis: 85%;
  background: white;
  max-height: 100vh;
  overflow-y: auto;
`

export default defaultMixin(TestshotContent)
