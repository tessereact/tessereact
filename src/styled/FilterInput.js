import styled from 'styled-components'
import defaultMixin from './mixins/default'

const FilterInput = styled.input`
  margin-bottom: 10px;
  font-size: 14px;
  width: 100%;
  height: 20px;
  padding-left: 5px;
  padding-height: 5px;
  line-height: 1.2
`

export default defaultMixin(FilterInput)

