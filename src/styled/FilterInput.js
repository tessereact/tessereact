import styled from 'styled-components'
import defaultMixin from './mixins/default'

const FilterInput = styled.input`
  ${defaultMixin}
  font-size: 14px;
  width: 100%;
  height: 20px;
  padding-left: 10px;
  line-height: 1.2;
  color: #e4e4e4;
  border-radius: 5px;
  border: none;
  height: 36px;
  background: #52555c;
`

export default FilterInput
