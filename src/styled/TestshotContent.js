import styled from 'styled-components'
import defaultMixin from './mixins/default'

const TestshotContent = styled.div`
  position: relative;
  flex-basis: 60%;
  padding: 10px;
  background: white;
  max-height: 100vh;
  overflow-y: auto;
`

export default defaultMixin(TestshotContent)

