import styled from 'styled-components'
import defaultMixin from './mixins/default'

const TestshotContent = styled.div`
  position: relative;
  flex-basis: 60%;
  padding: 10px;
  background: white;
`

export default defaultMixin(TestshotContent)

