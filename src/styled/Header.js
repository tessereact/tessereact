import styled from 'styled-components'
import defaultMixin from './mixins/default'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  color: ${props => props.color || '#32363d'};
  text-align: left;
  font-weight: normal;
  min-height: 70px;
  padding: 20px;
  background: #f5f6f8;
  border: 1px solid #e2e2e2;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
`

export default defaultMixin(Header)
